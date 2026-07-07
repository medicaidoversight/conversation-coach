import type { AssemblyTranscript } from "./assemblyai-fetch.js";

const FILLER_WORDS = new Set([
  "um", "uh", "erm", "ah", "like", "you know", "i mean",
  "sort of", "kind of", "basically", "actually", "literally",
  "right", "okay", "so", "well", "hmm",
]);

type SpeakerToneStyle = {
  tone: string;
  style: string;
  sentiment: "positive" | "neutral" | "negative" | "mixed";
  energy: "high" | "medium" | "low";
  formality: "formal" | "casual" | "mixed";
};

function analyzeToneAndStyle(
  text: string,
  questionCount: number,
  interruptionCount: number,
  wpm: number,
  fillerCount: number,
  wordCount: number,
): SpeakerToneStyle {
  const lower = text.toLowerCase();

  const positiveWords = ["great", "love", "amazing", "wonderful", "awesome", "fantastic", "happy", "glad", "thank", "appreciate", "good", "nice", "excellent", "perfect", "agree", "absolutely", "definitely"];
  const negativeWords = ["terrible", "awful", "hate", "frustrated", "angry", "annoyed", "disappointed", "unfortunately", "problem", "wrong", "bad", "never", "can't", "won't", "disagree", "no way"];
  const formalWords = ["however", "therefore", "regarding", "additionally", "furthermore", "consequently", "essentially", "specifically", "respectively", "accordingly"];
  const casualWords = ["yeah", "gonna", "wanna", "kinda", "sorta", "stuff", "things", "cool", "hey", "dude", "man", "guys", "awesome", "totally", "literally"];

  let posCount = 0;
  let negCount = 0;
  let formalCount = 0;
  let casualCount = 0;

  for (const w of positiveWords) {
    const matches = lower.match(new RegExp(`\\b${w}\\b`, "g"));
    if (matches) posCount += matches.length;
  }
  for (const w of negativeWords) {
    const matches = lower.match(new RegExp(`\\b${w}\\b`, "g"));
    if (matches) negCount += matches.length;
  }
  for (const w of formalWords) {
    const matches = lower.match(new RegExp(`\\b${w}\\b`, "g"));
    if (matches) formalCount += matches.length;
  }
  for (const w of casualWords) {
    const matches = lower.match(new RegExp(`\\b${w}\\b`, "g"));
    if (matches) casualCount += matches.length;
  }

  let sentiment: SpeakerToneStyle["sentiment"];
  if (posCount > 0 && negCount > 0 && posCount < negCount * 3 && negCount < posCount * 3) sentiment = "mixed";
  else if (posCount > negCount + 2) sentiment = "positive";
  else if (negCount > posCount + 2) sentiment = "negative";
  else if (posCount > negCount) sentiment = "positive";
  else if (negCount > posCount) sentiment = "negative";
  else sentiment = "neutral";

  let energy: SpeakerToneStyle["energy"];
  if (wpm >= 170 || interruptionCount >= 3) energy = "high";
  else if (wpm <= 120) energy = "low";
  else energy = "medium";

  let formality: SpeakerToneStyle["formality"];
  if (formalCount > casualCount + 2) formality = "formal";
  else if (casualCount > formalCount + 2) formality = "casual";
  else if (formalCount > 0 && casualCount > 0) formality = "mixed";
  else if (fillerCount > wordCount * 0.03 || casualCount > 0) formality = "casual";
  else if (formalCount > 0) formality = "formal";
  else formality = "mixed";

  let tone: string;
  if (sentiment === "positive" && energy === "high") tone = "Enthusiastic";
  else if (sentiment === "positive" && energy === "medium") tone = "Friendly";
  else if (sentiment === "positive" && energy === "low") tone = "Warm";
  else if (sentiment === "negative" && energy === "high") tone = "Confrontational";
  else if (sentiment === "negative") tone = "Tense";
  else if (sentiment === "mixed" && interruptionCount >= 2) tone = "Passionate";
  else if (sentiment === "mixed") tone = "Nuanced";
  else if (energy === "high") tone = "Assertive";
  else if (energy === "low") tone = "Reserved";
  else tone = "Neutral";

  let style: string;
  if (questionCount >= 4 && sentiment === "positive") style = "Collaborative";
  else if (questionCount >= 4) style = "Inquisitive";
  else if (interruptionCount >= 3 && energy === "high") style = "Competitive";
  else if (formality === "formal") style = "Analytical";
  else if (sentiment === "positive" && questionCount >= 2) style = "Supportive";
  else if (questionCount <= 1 && energy === "high") style = "Direct";
  else if (energy === "low" && questionCount <= 1) style = "Passive";
  else style = "Conversational";

  return { tone, style, sentiment, energy, formality };
}

function getOverallTone(s1: SpeakerToneStyle, s2: SpeakerToneStyle): string {
  if (s1.tone === s2.tone) return s1.tone;
  if (s1.sentiment === "positive" && s2.sentiment === "positive") return "Warm & Friendly";
  if (s1.sentiment === "negative" || s2.sentiment === "negative") return "Tense & Guarded";
  if (s1.energy === "high" && s2.energy === "high") return "Energetic & Dynamic";
  if (s1.energy === "low" && s2.energy === "low") return "Calm & Measured";
  return "Mixed Energy";
}

function getOverallStyle(s1: SpeakerToneStyle, s2: SpeakerToneStyle): string {
  if (s1.style === "Collaborative" || s2.style === "Collaborative") return "Collaborative Discussion";
  if (s1.style === "Competitive" || s2.style === "Competitive") return "Debate-Style";
  if (s1.style === "Inquisitive" || s2.style === "Inquisitive") return "Interview-Style";
  if (s1.style === "Direct" && s2.style === "Direct") return "Direct Exchange";
  if (s1.style === "Passive" && s2.style === "Passive") return "Low-Key Chat";
  if (s1.style === "Supportive" || s2.style === "Supportive") return "Supportive Dialogue";
  return "Open Conversation";
}

function countFillerWords(text: string): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const filler of FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, "gi");
    const matches = lower.match(regex);
    if (matches) count += matches.length;
  }
  return count;
}

function countQuestions(text: string): number {
  const matches = text.match(/\?/g);
  return matches ? matches.length : 0;
}

function getPersonality(
  talkRatio: number,
  questions: number,
  interruptions: number,
): { name: string; insight: string } {
  if (talkRatio >= 70 && questions <= 2) {
    return {
      name: "The Monologuer",
      insight: `You spoke ${talkRatio}% of the time and asked very few questions. Try inviting the other person to share more by asking open-ended questions.`,
    };
  }
  if (talkRatio >= 60 && questions <= 3) {
    return {
      name: "The Storyteller",
      insight: `You spoke ${talkRatio}% of the time and asked only ${questions} question${questions === 1 ? "" : "s"}. More balanced conversations usually include more questions and more listening.`,
    };
  }
  if (talkRatio <= 35 && questions >= 4) {
    return {
      name: "The Interviewer",
      insight: `You asked ${questions} questions and let the other person do most of the talking. Great listening skills, but sharing more of your own perspective could deepen the connection.`,
    };
  }
  if (talkRatio <= 35) {
    return {
      name: "The Listener",
      insight: `You spoke only ${talkRatio}% of the time. Listening is a strength, but contributing more of your thoughts can make conversations feel more mutual.`,
    };
  }
  if (interruptions >= 5) {
    return {
      name: "The Debater",
      insight: `You had ${interruptions} interruptions during this conversation. Passionate exchanges are great, but pausing before responding can lead to more productive dialogue.`,
    };
  }
  if (talkRatio >= 40 && talkRatio <= 60 && questions >= 3) {
    return {
      name: "The Connector",
      insight: `You balanced speaking and listening well, asking ${questions} questions along the way. This kind of engagement builds trust and rapport.`,
    };
  }
  return {
    name: "The Storyteller",
    insight: `You spoke ${talkRatio}% of the time. Consider asking more questions to create a more balanced conversation.`,
  };
}

function detectInterruptions(
  utterances: Array<{ speaker: string; start: number; end: number; text: string }>,
  words: Array<{ speaker?: string; start: number; end: number }>,
): { speaker_1: number; speaker_2: number } {
  const result = { speaker_1: 0, speaker_2: 0 };

  for (let i = 1; i < utterances.length; i++) {
    const prev = utterances[i - 1];
    const curr = utterances[i];

    if (prev.speaker === curr.speaker) continue;

    const gap = curr.start - prev.end;

    if (gap < 0) {
      if (curr.speaker === "A") result.speaker_1++;
      else result.speaker_2++;
      continue;
    }

    if (gap < 300 && prev.text && !prev.text.trim().endsWith(".") && !prev.text.trim().endsWith("?") && !prev.text.trim().endsWith("!")) {
      if (curr.speaker === "A") result.speaker_1++;
      else result.speaker_2++;
      continue;
    }
  }

  let prevWordSpeaker: string | null = null;
  let prevWordEnd = 0;
  let wordInterruptions = { A: 0, B: 0 };
  for (const word of words) {
    if (!word.speaker) continue;
    if (prevWordSpeaker && word.speaker !== prevWordSpeaker && word.start < prevWordEnd) {
      wordInterruptions[word.speaker as "A" | "B"] = (wordInterruptions[word.speaker as "A" | "B"] || 0) + 1;
    }
    prevWordSpeaker = word.speaker;
    prevWordEnd = word.end;
  }

  result.speaker_1 = Math.max(result.speaker_1, Math.floor((wordInterruptions["A"] || 0) / 3));
  result.speaker_2 = Math.max(result.speaker_2, Math.floor((wordInterruptions["B"] || 0) / 3));

  return result;
}

export function buildConversationAnalysis(transcript: AssemblyTranscript) {
  const utterances = transcript.utterances || [];
  const words = transcript.words || [];

  const speakerData: Record<string, { totalMs: number; wordCount: number; text: string }> = {};

  for (const utterance of utterances) {
    const speaker = utterance.speaker;
    if (!speakerData[speaker]) {
      speakerData[speaker] = { totalMs: 0, wordCount: 0, text: "" };
    }
    speakerData[speaker].totalMs += (utterance.end - utterance.start);
    speakerData[speaker].text += " " + utterance.text;
  }

  for (const word of words) {
    const speaker = word.speaker;
    if (speaker && speakerData[speaker]) {
      speakerData[speaker].wordCount++;
    }
  }

  const speakers = Object.keys(speakerData).sort();
  const s1 = speakers[0] || "A";
  const s2 = speakers[1] || "B";
  const s1Data = speakerData[s1] || { totalMs: 0, wordCount: 0, text: "" };
  const s2Data = speakerData[s2] || { totalMs: 0, wordCount: 0, text: "" };

  const totalMs = s1Data.totalMs + s2Data.totalMs;
  const s1Pct = totalMs > 0 ? Math.round((s1Data.totalMs / totalMs) * 100) : 50;
  const s2Pct = 100 - s1Pct;

  const s1Minutes = s1Data.totalMs / 60000;
  const s2Minutes = s2Data.totalMs / 60000;
  const s1Wpm = s1Minutes > 0 ? Math.round(s1Data.wordCount / s1Minutes) : 0;
  const s2Wpm = s2Minutes > 0 ? Math.round(s2Data.wordCount / s2Minutes) : 0;

  const s1Questions = countQuestions(s1Data.text);
  const s2Questions = countQuestions(s2Data.text);
  const s1Filler = countFillerWords(s1Data.text);
  const s2Filler = countFillerWords(s2Data.text);

  const interruptions = detectInterruptions(
    utterances.map((u) => ({ speaker: u.speaker, start: u.start, end: u.end, text: u.text })),
    words.map((w) => ({ speaker: w.speaker, start: w.start, end: w.end })),
  );

  const balance = 100 - Math.abs(s1Pct - 50) * 2;
  const questionBonus = Math.min(s1Questions, 5) * 2;
  const interruptionPenalty = interruptions.speaker_1 * 3;
  const fillerPenalty = Math.min(s1Filler, 10);
  const score = Math.max(20, Math.min(100, Math.round(balance + questionBonus - interruptionPenalty - fillerPenalty)));

  const personality = getPersonality(s1Pct, s1Questions, interruptions.speaker_1);

  const s1ToneStyle = analyzeToneAndStyle(s1Data.text, s1Questions, interruptions.speaker_1, s1Wpm, s1Filler, s1Data.wordCount);
  const s2ToneStyle = analyzeToneAndStyle(s2Data.text, s2Questions, interruptions.speaker_2, s2Wpm, s2Filler, s2Data.wordCount);

  const toneStyle = {
    overall_tone: getOverallTone(s1ToneStyle, s2ToneStyle),
    overall_style: getOverallStyle(s1ToneStyle, s2ToneStyle),
    speaker_1: s1ToneStyle,
    speaker_2: s2ToneStyle,
  };

  const durationSeconds = transcript.audio_duration || 0;

  const transcriptLines = utterances.map((u) => ({
    speaker: u.speaker === s1 ? "Speaker 1" : "Speaker 2",
    start: u.start / 1000,
    end: u.end / 1000,
    text: u.text,
  }));

  return {
    conversation_score: score,
    personality: personality.name,
    key_insight: personality.insight,
    duration_seconds: Math.round(durationSeconds),
    talk_ratio: {
      speaker_1_pct: s1Pct,
      speaker_2_pct: s2Pct,
    },
    questions: {
      speaker_1: s1Questions,
      speaker_2: s2Questions,
    },
    interruptions,
    speaking_speed_wpm: {
      speaker_1: s1Wpm,
      speaker_2: s2Wpm,
    },
    filler_words: {
      speaker_1: s1Filler,
      speaker_2: s2Filler,
    },
    tone_style: toneStyle,
    transcript: transcriptLines,
  };
}
