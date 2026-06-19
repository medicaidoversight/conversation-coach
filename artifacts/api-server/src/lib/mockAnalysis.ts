function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const personalities = [
  {
    name: "The Storyteller",
    insight: (ratio: number, q: number) =>
      `You spoke ${ratio}% of the time and asked only ${q} question${q === 1 ? "" : "s"}. More balanced conversations usually include more questions and more listening.`,
  },
  {
    name: "The Interviewer",
    insight: (ratio: number, q: number) =>
      `You asked ${q} questions, which kept the other person talking. Great listening, but sharing more of your own perspective could deepen the conversation.`,
  },
  {
    name: "The Debater",
    insight: (_ratio: number, _q: number) =>
      `You had several back-and-forth exchanges and a few interruptions. Passionate discussions are great, but pausing before responding can lead to more productive dialogue.`,
  },
  {
    name: "The Listener",
    insight: (ratio: number, _q: number) =>
      `You spoke only ${ratio}% of the time. Listening is a strength, but contributing more of your thoughts can make conversations feel more mutual.`,
  },
  {
    name: "The Connector",
    insight: (_ratio: number, q: number) =>
      `You balanced speaking and listening well, asking ${q} questions along the way. This kind of engagement builds trust and rapport.`,
  },
  {
    name: "The Monologuer",
    insight: (ratio: number, _q: number) =>
      `You dominated ${ratio}% of the conversation. Try pausing more often and inviting the other person to share their thoughts.`,
  },
];

const transcriptSets = [
  [
    { speaker: "Speaker 1", start: 0.0, end: 4.2, text: "How do you think the meeting went?" },
    { speaker: "Speaker 2", start: 4.4, end: 8.9, text: "I think it went pretty well overall." },
    { speaker: "Speaker 1", start: 9.1, end: 12.0, text: "What would you change next time?" },
    { speaker: "Speaker 2", start: 12.5, end: 18.3, text: "Maybe we could have been more structured with the agenda. I felt like we went off on a few tangents." },
    { speaker: "Speaker 1", start: 18.5, end: 25.1, text: "Yeah, I agree. I think I tend to go off on tangents when I get excited about a topic. I should probably work on staying more focused." },
    { speaker: "Speaker 2", start: 25.4, end: 29.8, text: "That's a good self-awareness to have. Do you want me to help keep us on track next time?" },
    { speaker: "Speaker 1", start: 30.0, end: 38.2, text: "That would be great actually. I also noticed that I interrupted you a couple of times, which I want to be more mindful of." },
    { speaker: "Speaker 2", start: 38.5, end: 42.0, text: "I appreciate you mentioning that. It happens to everyone." },
  ],
  [
    { speaker: "Speaker 1", start: 0.0, end: 3.5, text: "So tell me about your weekend. What did you get up to?" },
    { speaker: "Speaker 2", start: 3.8, end: 9.2, text: "It was actually really relaxing. I went hiking on Saturday morning and then spent the afternoon reading." },
    { speaker: "Speaker 1", start: 9.5, end: 15.0, text: "Oh nice, where did you go hiking? I've been wanting to find some new trails around here." },
    { speaker: "Speaker 2", start: 15.3, end: 22.1, text: "There's this great trail just north of town. It's about a two-hour loop with some really beautiful views at the top." },
    { speaker: "Speaker 1", start: 22.4, end: 28.0, text: "That sounds amazing. I should check it out. I've been meaning to get outside more but keep putting it off." },
    { speaker: "Speaker 2", start: 28.3, end: 31.5, text: "You should definitely go. Want to join me next weekend?" },
    { speaker: "Speaker 1", start: 31.8, end: 36.2, text: "I'd love that. Let's plan on it. What time do you usually head out?" },
    { speaker: "Speaker 2", start: 36.5, end: 41.0, text: "Usually around eight in the morning. Early enough to beat the crowds but not too early." },
    { speaker: "Speaker 1", start: 41.3, end: 45.8, text: "Perfect, that works for me. I'll set a reminder so I don't forget." },
  ],
  [
    { speaker: "Speaker 1", start: 0.0, end: 5.2, text: "I wanted to talk about the project timeline. I think we might need to push back the deadline." },
    { speaker: "Speaker 2", start: 5.5, end: 8.0, text: "Oh, really? What's causing the delay?" },
    { speaker: "Speaker 1", start: 8.3, end: 16.5, text: "Well, the design phase took longer than expected, and now the development team is saying they need at least two more weeks to finish the core features." },
    { speaker: "Speaker 2", start: 16.8, end: 21.0, text: "That's frustrating. Have you talked to the stakeholders about this yet?" },
    { speaker: "Speaker 1", start: 21.3, end: 30.1, text: "Not yet, I wanted to get your input first. I was thinking we could present a revised timeline with some options for what we could cut to stay on schedule." },
    { speaker: "Speaker 2", start: 30.4, end: 36.8, text: "That makes sense. I think we should prioritize the must-have features and move the nice-to-haves to a second phase." },
    { speaker: "Speaker 1", start: 37.1, end: 42.5, text: "Exactly what I was thinking. Let's draft something up and present it tomorrow." },
  ],
  [
    { speaker: "Speaker 1", start: 0.0, end: 6.0, text: "I've been thinking a lot about changing careers lately. I feel like I've hit a ceiling at my current job." },
    { speaker: "Speaker 2", start: 6.3, end: 10.5, text: "That's a big decision. What kind of work are you considering?" },
    { speaker: "Speaker 1", start: 10.8, end: 19.0, text: "I'm really interested in product management. I've been doing some online courses and I think my skills could transfer well. But I'm nervous about starting over." },
    { speaker: "Speaker 2", start: 19.3, end: 24.5, text: "Starting over is always scary. But you already have so much relevant experience. Have you thought about what your first step would be?" },
    { speaker: "Speaker 1", start: 24.8, end: 32.0, text: "I've been networking a bit and reaching out to people in the field. One person suggested I try to get a PM role at my current company first, as a stepping stone." },
    { speaker: "Speaker 2", start: 32.3, end: 37.0, text: "That's a smart approach. It's less risky and you'd already know the company culture." },
    { speaker: "Speaker 1", start: 37.3, end: 44.0, text: "Yeah, I think I'll bring it up with my manager next week. Worst case, they say no, and I can start looking externally." },
    { speaker: "Speaker 2", start: 44.3, end: 48.5, text: "Sounds like a solid plan. I'm rooting for you." },
  ],
  [
    { speaker: "Speaker 1", start: 0.0, end: 4.8, text: "Did you see that documentary last night? The one about ocean conservation?" },
    { speaker: "Speaker 2", start: 5.1, end: 8.5, text: "No, I missed it. Was it good?" },
    { speaker: "Speaker 1", start: 8.8, end: 18.0, text: "It was incredible. They showed how coral reefs are being restored using these new techniques. It really made me think about what we can do individually to help the environment." },
    { speaker: "Speaker 2", start: 18.3, end: 22.0, text: "That sounds fascinating. I've been trying to be more conscious about my carbon footprint lately." },
    { speaker: "Speaker 1", start: 22.3, end: 30.5, text: "Me too. I started composting last month and I've been biking to work when the weather is nice. Small things, but they add up." },
    { speaker: "Speaker 2", start: 30.8, end: 36.0, text: "Every bit helps. I switched to a reusable water bottle and started buying from local farmers markets." },
    { speaker: "Speaker 1", start: 36.3, end: 42.5, text: "That's great. We should start a sustainability group at the office. I bet other people would be interested too." },
    { speaker: "Speaker 2", start: 42.8, end: 47.0, text: "I love that idea. Let's bring it up at the next team meeting and see who wants to join." },
  ],
];

export function getMockAnalysis() {
  const s1Ratio = rand(30, 80);
  const s2Ratio = 100 - s1Ratio;
  const s1Questions = rand(0, 12);
  const s2Questions = rand(0, 12);
  const s1Interruptions = rand(0, 8);
  const s2Interruptions = rand(0, 8);
  const s1Speed = rand(120, 200);
  const s2Speed = rand(120, 200);
  const s1Filler = rand(0, 20);
  const s2Filler = rand(0, 20);

  const balance = 100 - Math.abs(s1Ratio - 50) * 2;
  const questionBonus = Math.min(s1Questions, 5) * 2;
  const interruptionPenalty = s1Interruptions * 3;
  const score = Math.max(20, Math.min(100, Math.round(balance + questionBonus - interruptionPenalty + rand(-5, 5))));

  const personality = pick(personalities);
  const transcript = pick(transcriptSets);
  const duration = rand(300, 3600);

  const tones = ["Enthusiastic", "Friendly", "Warm", "Assertive", "Neutral", "Reserved", "Passionate", "Nuanced"];
  const styles = ["Collaborative", "Inquisitive", "Direct", "Conversational", "Supportive", "Analytical"];
  const sentiments: Array<"positive" | "neutral" | "negative" | "mixed"> = ["positive", "neutral", "negative", "mixed"];
  const energies: Array<"high" | "medium" | "low"> = ["high", "medium", "low"];
  const formalities: Array<"formal" | "casual" | "mixed"> = ["formal", "casual", "mixed"];
  const overallTones = ["Warm & Friendly", "Energetic & Dynamic", "Calm & Measured", "Mixed Energy"];
  const overallStyles = ["Collaborative Discussion", "Interview-Style", "Open Conversation", "Supportive Dialogue", "Direct Exchange"];

  return {
    conversation_score: score,
    personality: personality.name,
    key_insight: personality.insight(s1Ratio, s1Questions),
    duration_seconds: duration,
    talk_ratio: {
      speaker_1_pct: s1Ratio,
      speaker_2_pct: s2Ratio,
    },
    questions: {
      speaker_1: s1Questions,
      speaker_2: s2Questions,
    },
    interruptions: {
      speaker_1: s1Interruptions,
      speaker_2: s2Interruptions,
    },
    speaking_speed_wpm: {
      speaker_1: s1Speed,
      speaker_2: s2Speed,
    },
    filler_words: {
      speaker_1: s1Filler,
      speaker_2: s2Filler,
    },
    tone_style: {
      overall_tone: pick(overallTones),
      overall_style: pick(overallStyles),
      speaker_1: {
        tone: pick(tones),
        style: pick(styles),
        sentiment: pick(sentiments),
        energy: pick(energies),
        formality: pick(formalities),
      },
      speaker_2: {
        tone: pick(tones),
        style: pick(styles),
        sentiment: pick(sentiments),
        energy: pick(energies),
        formality: pick(formalities),
      },
    },
    transcript,
  };
}
