/** AssemblyAI REST client (fetch-only — works in Node and Cloudflare Workers). */

export interface AssemblyUtterance {
  speaker: string;
  start: number;
  end: number;
  text: string;
}

export interface AssemblyWord {
  speaker?: string;
  start: number;
  end: number;
}

export interface AssemblyTranscript {
  status: string;
  error?: string;
  audio_duration?: number;
  utterances?: AssemblyUtterance[];
  words?: AssemblyWord[];
}

const API = "https://api.assemblyai.com/v2";

async function pollTranscript(id: string, apiKey: string, deadlineMs: number): Promise<AssemblyTranscript> {
  const started = Date.now();
  while (Date.now() - started < deadlineMs) {
    const res = await fetch(`${API}/transcript/${id}`, {
      headers: { authorization: apiKey },
    });
    if (!res.ok) {
      throw new Error(`AssemblyAI poll failed (${res.status}): ${await res.text()}`);
    }
    const data = (await res.json()) as AssemblyTranscript;
    if (data.status === "completed") return data;
    if (data.status === "error") {
      throw new Error(`Transcription failed: ${data.error ?? "unknown error"}`);
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error("Transcription timed out — try a shorter clip or upgrade Cloudflare Workers limits");
}

/** Upload audio bytes and poll until the diarized transcript is ready. */
export async function transcribeAudio(
  audio: Uint8Array,
  apiKey: string,
  opts?: { pollDeadlineMs?: number },
): Promise<AssemblyTranscript> {
  const uploadRes = await fetch(`${API}/upload`, {
    method: "POST",
    headers: {
      authorization: apiKey,
      "content-type": "application/octet-stream",
    },
    body: new Blob([new Uint8Array(audio)]),
  });
  if (!uploadRes.ok) {
    throw new Error(`AssemblyAI upload failed (${uploadRes.status}): ${await uploadRes.text()}`);
  }
  const { upload_url } = (await uploadRes.json()) as { upload_url: string };

  const createRes = await fetch(`${API}/transcript`, {
    method: "POST",
    headers: {
      authorization: apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      audio_url: upload_url,
      speaker_labels: true,
      speech_models: ["universal-2"],
    }),
  });
  if (!createRes.ok) {
    throw new Error(`AssemblyAI transcript create failed (${createRes.status}): ${await createRes.text()}`);
  }
  const { id } = (await createRes.json()) as { id: string };
  return pollTranscript(id, apiKey, opts?.pollDeadlineMs ?? 120_000);
}
