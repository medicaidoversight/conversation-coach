/**
 * Cloudflare Worker — Conversation Coach
 * Serves the Vite SPA from ASSETS and handles POST /api/analyze (AssemblyAI).
 */

import { analyzeConversation } from "../../../lib/conversation-analysis/src/index.ts";

export interface Env {
  ASSEMBLYAI_API_KEY?: string;
  ASSETS: Fetcher;
}

const MAX_BYTES = 50 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/m4a",
  "audio/x-m4a",
  "audio/mp4",
  "audio/aac",
  "application/octet-stream",
]);

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function isAllowedAudio(file: File): boolean {
  if (ALLOWED_TYPES.has(file.type)) return true;
  return /\.(mp3|wav|m4a)$/i.test(file.name);
}

async function handleAnalyze(request: Request, env: Env): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { error: "Please choose an audio file to continue." });
  }

  const audio = form.get("audio");
  if (!(audio instanceof File)) {
    return json(400, { error: "Please choose an audio file to continue." });
  }
  if (audio.size > MAX_BYTES) {
    return json(400, { error: "File is too large. Maximum size is 50 MB." });
  }
  if (!isAllowedAudio(audio)) {
    return json(400, {
      error: "Unsupported file type. Please upload an MP3, WAV, or M4A file.",
    });
  }

  try {
    const apiKey = env.ASSEMBLYAI_API_KEY;
    if (!apiKey) {
      await new Promise((r) => setTimeout(r, 1500));
    }

    const bytes = new Uint8Array(await audio.arrayBuffer());
    const analysis = await analyzeConversation(bytes, apiKey, {
      // Long clips need Workers Paid (I/O wait is fine; CPU stays low while polling).
      pollDeadlineMs: 300_000,
    });
    return json(200, analysis);
  } catch (err) {
    console.error("Analysis error:", err);
    return json(500, { error: "We couldn't analyze that file. Please try again." });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/healthz" && request.method === "GET") {
      return json(200, { status: "ok" });
    }

    if (url.pathname === "/api/analyze" && request.method === "POST") {
      return handleAnalyze(request, env);
    }

    if (url.pathname.startsWith("/api/")) {
      return json(404, { error: "Not found" });
    }

    return env.ASSETS.fetch(request);
  },
};
