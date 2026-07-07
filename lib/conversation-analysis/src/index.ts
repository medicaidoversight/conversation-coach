import { transcribeAudio } from "./assemblyai-fetch.js";
import { buildConversationAnalysis } from "./build-analysis.js";
import { getMockAnalysis } from "./mock.js";

export type { AssemblyTranscript } from "./assemblyai-fetch.js";
export { getMockAnalysis } from "./mock.js";

/** Analyze audio bytes. Uses AssemblyAI when apiKey is set; otherwise returns mock data. */
export async function analyzeConversation(
  audio: Uint8Array,
  apiKey?: string | null,
  opts?: { pollDeadlineMs?: number },
) {
  if (!apiKey?.trim()) {
    return getMockAnalysis();
  }
  const transcript = await transcribeAudio(audio, apiKey.trim(), opts);
  return buildConversationAnalysis(transcript);
}
