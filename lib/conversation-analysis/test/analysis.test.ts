import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildConversationAnalysis } from "../src/build-analysis.js";
import { getMockAnalysis } from "../src/mock.js";

describe("conversation-analysis", () => {
  it("mock analysis has core coaching fields", () => {
    const m = getMockAnalysis();
    assert.equal(typeof m.conversation_score, "number");
    assert.ok(m.conversation_score >= 20 && m.conversation_score <= 100);
    assert.equal(typeof m.personality, "string");
    assert.equal(typeof m.key_insight, "string");
    assert.ok(Array.isArray(m.transcript));
    assert.equal(typeof m.talk_ratio.speaker_1_pct, "number");
    assert.equal(typeof m.talk_ratio.speaker_2_pct, "number");
  });

  it("buildConversationAnalysis handles diarized utterances", () => {
    const result = buildConversationAnalysis({
      status: "completed",
      audio_duration: 120,
      utterances: [
        { speaker: "A", start: 0, end: 30_000, text: "Hello, how are you today?" },
        { speaker: "B", start: 31_000, end: 60_000, text: "I'm doing well, thanks for asking." },
      ],
      words: [
        { speaker: "A", start: 0, end: 100 },
        { speaker: "B", start: 31_000, end: 31_100 },
      ],
    });

    assert.equal(result.talk_ratio.speaker_1_pct + result.talk_ratio.speaker_2_pct, 100);
    assert.equal(result.transcript.length, 2);
    assert.ok(result.duration_seconds >= 0);
  });
});
