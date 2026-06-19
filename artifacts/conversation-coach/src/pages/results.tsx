import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, MessageSquare, Gauge, Clock, 
  HelpCircle, AlertCircle, FastForward, Frown, Sparkles, PieChart,
  Volume2, Palette, Zap, BookOpen, Users, User
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { PageLayout } from "@/components/layout/PageLayout";
import { ConversationAnalysis } from "@workspace/api-client-react";

type SpeakerFilter = "all" | "speaker_1" | "speaker_2";

const getScoreDetails = (score: number) => {
  if (score >= 90) return { label: "Excellent Balance", color: "text-secondary", bg: "bg-secondary/10" };
  if (score >= 75) return { label: "Strong Conversation", color: "text-primary", bg: "bg-primary/10" };
  if (score >= 60) return { label: "Room to Improve", color: "text-amber-500", bg: "bg-amber-50" };
  return { label: "Needs More Balance", color: "text-destructive", bg: "bg-destructive/10" };
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

function SpeakerToggle({ value, onChange }: { value: SpeakerFilter; onChange: (v: SpeakerFilter) => void }) {
  const options: { key: SpeakerFilter; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "Both Speakers", icon: <Users className="w-4 h-4" /> },
    { key: "speaker_1", label: "Speaker 1", icon: <User className="w-4 h-4" /> },
    { key: "speaker_2", label: "Speaker 2", icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center bg-white rounded-full shadow-sm border border-slate-200 p-1">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`
            flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${value === opt.key
              ? opt.key === "speaker_1"
                ? "bg-primary text-white shadow-sm"
                : opt.key === "speaker_2"
                ? "bg-secondary text-white shadow-sm"
                : "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }
          `}
        >
          {opt.icon}
          <span className="hidden sm:inline">{opt.label}</span>
          <span className="sm:hidden">{opt.key === "all" ? "All" : opt.key === "speaker_1" ? "S1" : "S2"}</span>
        </button>
      ))}
    </div>
  );
}

function SingleSpeakerMetrics({ 
  data, 
  speakerKey 
}: { 
  data: ConversationAnalysis; 
  speakerKey: "speaker_1" | "speaker_2";
}) {
  const speakerNum = speakerKey === "speaker_1" ? 1 : 2;
  const label = `Speaker ${speakerNum}`;
  const accentClasses = speakerKey === "speaker_1"
    ? { bg: "bg-primary", text: "text-primary", bar: "bg-primary", topBar: "bg-primary" }
    : { bg: "bg-secondary", text: "text-secondary", bar: "bg-secondary", topBar: "bg-secondary" };
  const talkPct = speakerKey === "speaker_1" ? data.talk_ratio.speaker_1_pct : data.talk_ratio.speaker_2_pct;
  const questions = data.questions[speakerKey];
  const interruptions = data.interruptions[speakerKey];
  const speed = data.speaking_speed_wpm[speakerKey];
  const filler = data.filler_words[speakerKey];
  const toneData = data.tone_style ? data.tone_style[speakerKey] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 ${accentClasses.topBar}`} />
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
              <PieChart className={`w-4 h-4 mr-2 ${accentClasses.text}`} /> Talk Time
            </h3>
            <div className="flex items-baseline mb-3">
              <span className="text-5xl font-display font-extrabold text-slate-900">{talkPct}</span>
              <span className="text-xl text-slate-400 ml-1">%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${talkPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${accentClasses.bar}`}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">{label} of total conversation</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:-translate-y-1 transition-transform">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
              <HelpCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Questions Asked</p>
            <p className="text-4xl font-bold text-slate-900">{questions}</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:-translate-y-1 transition-transform">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-4 text-rose-500">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Interruptions</p>
            <p className="text-4xl font-bold text-slate-900">{interruptions}</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:-translate-y-1 transition-transform">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-500">
              <FastForward className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Speed (WPM)</p>
            <p className="text-4xl font-bold text-slate-900">{speed}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mr-3 text-purple-500">
                <Frown className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900">Filler Words</h3>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <p className="text-5xl font-bold text-slate-900">{filler}</p>
              <p className="text-sm text-slate-400 mt-2">filler words detected</p>
            </div>
          </CardContent>
        </Card>

        {toneData && (
          <Card className="bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 text-indigo-500 shadow-sm">
                  <Volume2 className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900">Tone & Style</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 flex items-center">
                    <Palette className="w-3.5 h-3.5 mr-1.5" /> Tone
                  </span>
                  <span className="font-semibold text-slate-800">{toneData.tone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 flex items-center">
                    <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Style
                  </span>
                  <span className="font-semibold text-slate-800">{toneData.style}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 flex items-center">
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Sentiment
                  </span>
                  <span className={`font-semibold capitalize ${
                    toneData.sentiment === "positive" ? "text-green-600" :
                    toneData.sentiment === "negative" ? "text-red-500" :
                    toneData.sentiment === "mixed" ? "text-amber-500" :
                    "text-slate-600"
                  }`}>{toneData.sentiment}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 flex items-center">
                    <Zap className="w-3.5 h-3.5 mr-1.5" /> Energy
                  </span>
                  <span className={`font-semibold capitalize ${
                    toneData.energy === "high" ? "text-orange-500" :
                    toneData.energy === "low" ? "text-blue-400" :
                    "text-slate-600"
                  }`}>{toneData.energy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Formality
                  </span>
                  <span className="font-semibold text-slate-800 capitalize">{toneData.formality}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}

export default function ResultsPage() {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<ConversationAnalysis | null>(null);
  const [speakerFilter, setSpeakerFilter] = useState<SpeakerFilter>("all");
  
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('analysisResult');
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse analysis data", e);
    }
  }, []);

  if (!data) {
    return (
      <PageLayout>
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">No Data Found</h2>
            <p className="text-slate-600 mb-8">
              We couldn't find your recent analysis. Please upload a new audio file to get your insights.
            </p>
            <Link href="/upload">
              <Button>Go to Upload</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const scoreDetails = getScoreDetails(data.conversation_score);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const filteredTranscript = speakerFilter === "all"
    ? data.transcript
    : data.transcript.filter((line) =>
        speakerFilter === "speaker_1" ? line.speaker === "Speaker 1" : line.speaker === "Speaker 2"
      );

  return (
    <PageLayout>
      <div className="bg-slate-50/50 flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8">
            <Link href="/upload">
              <Button variant="ghost" className="px-4 py-2 h-auto text-slate-500">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Analyze Another
              </Button>
            </Link>
            <div className="flex items-center text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
              <Clock className="w-4 h-4 mr-2" />
              Duration: <span className="font-semibold text-slate-900 ml-1">{formatTime(data.duration_seconds)}</span>
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <div className="grid lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants}>
                <Card className="h-full bg-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -z-0"></div>
                  <CardContent className="p-8 flex flex-col h-full justify-between relative z-10">
                    <div>
                      <div className="flex items-center space-x-2 text-slate-500 mb-6">
                        <Gauge className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-sm uppercase tracking-wider">Conversation Score</h3>
                      </div>
                      <div className="flex items-baseline mb-2">
                        <span className="text-7xl font-display font-extrabold text-slate-900 tracking-tighter">
                          {data.conversation_score}
                        </span>
                        <span className="text-2xl font-medium text-slate-400 ml-1">/100</span>
                      </div>
                    </div>
                    <div className={`mt-6 inline-flex items-center px-4 py-2 rounded-full w-fit ${scoreDetails.bg}`}>
                      <span className={`font-semibold text-sm ${scoreDetails.color}`}>
                        {scoreDetails.label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-primary to-accent text-white border-0 shadow-lg shadow-primary/20">
                  <CardContent className="p-8 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-white/80 mb-6">
                        <Sparkles className="w-5 h-5" />
                        <h3 className="font-semibold text-sm uppercase tracking-wider">Your Style</h3>
                      </div>
                      <h4 className="text-3xl font-display font-bold leading-tight mb-4">
                        "{data.personality}"
                      </h4>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="flex items-center space-x-2 text-secondary mb-4">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <h3 className="font-semibold text-sm uppercase tracking-wider">Key Insight</h3>
                    </div>
                    <p className="text-lg text-slate-700 leading-relaxed font-medium mt-auto">
                      {data.key_insight}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-slate-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-slate-400" />
                  Speaker Analysis
                </h3>
                <SpeakerToggle value={speakerFilter} onChange={setSpeakerFilter} />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {speakerFilter === "all" ? (
                <motion.div
                  key="all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-2">
                      <Card className="h-full">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-slate-900 mb-6 flex items-center">
                            <PieChart className="w-4 h-4 mr-2 text-primary" /> Talk Ratio
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-slate-800">Speaker 1</span>
                                <span className="text-slate-500 font-medium">{data.talk_ratio.speaker_1_pct}%</span>
                              </div>
                              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${data.talk_ratio.speaker_1_pct}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className="h-full bg-primary"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-slate-800">Speaker 2</span>
                                <span className="text-slate-500 font-medium">{data.talk_ratio.speaker_2_pct}%</span>
                              </div>
                              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${data.talk_ratio.speaker_2_pct}%` }}
                                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                  className="h-full bg-secondary"
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Card className="h-full text-center hover:-translate-y-1 transition-transform">
                        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
                            <HelpCircle className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-medium text-slate-500 mb-1">Questions Asked</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {data.questions.speaker_1} <span className="text-lg text-slate-400 font-normal">/ {data.questions.speaker_2}</span>
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Card className="h-full text-center hover:-translate-y-1 transition-transform">
                        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-4 text-rose-500">
                            <AlertCircle className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-medium text-slate-500 mb-1">Interruptions</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {data.interruptions.speaker_1} <span className="text-lg text-slate-400 font-normal">/ {data.interruptions.speaker_2}</span>
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Card className="h-full text-center hover:-translate-y-1 transition-transform">
                        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-500">
                            <FastForward className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-medium text-slate-500 mb-1">Speed (WPM)</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {data.speaking_speed_wpm.speaker_1} <span className="text-lg text-slate-400 font-normal">/ {data.speaking_speed_wpm.speaker_2}</span>
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mr-3 text-purple-500">
                            <Frown className="w-5 h-5" />
                          </div>
                          <h3 className="font-semibold text-slate-900">Filler Words</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-slate-50 rounded-xl">
                            <p className="text-sm text-slate-500 mb-1">Speaker 1</p>
                            <p className="text-3xl font-bold text-slate-900">{data.filler_words.speaker_1}</p>
                          </div>
                          <div className="text-center p-4 bg-slate-50 rounded-xl">
                            <p className="text-sm text-slate-500 mb-1">Speaker 2</p>
                            <p className="text-3xl font-bold text-slate-900">{data.filler_words.speaker_2}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {data.tone_style && (
                    <Card className="bg-gradient-to-r from-indigo-50 via-white to-violet-50 border-indigo-100">
                      <CardContent className="p-6 sm:p-8">
                        <h3 className="font-display font-bold text-xl text-slate-900 mb-6 flex items-center">
                          <Volume2 className="w-5 h-5 mr-2 text-indigo-500" />
                          Conversation Tone & Style
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-6 mb-6">
                          <div className="bg-white rounded-xl p-5 shadow-sm border border-indigo-100">
                            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Overall Tone</p>
                            <p className="text-2xl font-display font-bold text-slate-900">{data.tone_style.overall_tone}</p>
                          </div>
                          <div className="bg-white rounded-xl p-5 shadow-sm border border-violet-100">
                            <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">Overall Style</p>
                            <p className="text-2xl font-display font-bold text-slate-900">{data.tone_style.overall_style}</p>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                          {[
                            { label: "Speaker 1", speaker: data.tone_style.speaker_1, accentText: "text-primary" },
                            { label: "Speaker 2", speaker: data.tone_style.speaker_2, accentText: "text-secondary" },
                          ].map(({ label, speaker, accentText }) => (
                            <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                              <h4 className={`font-semibold ${accentText} mb-4 text-sm uppercase tracking-wider`}>{label}</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-500 flex items-center">
                                    <Palette className="w-3.5 h-3.5 mr-1.5" /> Tone
                                  </span>
                                  <span className="font-semibold text-slate-800">{speaker.tone}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-500 flex items-center">
                                    <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Style
                                  </span>
                                  <span className="font-semibold text-slate-800">{speaker.style}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-500 flex items-center">
                                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Sentiment
                                  </span>
                                  <span className={`font-semibold capitalize ${
                                    speaker.sentiment === "positive" ? "text-green-600" :
                                    speaker.sentiment === "negative" ? "text-red-500" :
                                    speaker.sentiment === "mixed" ? "text-amber-500" :
                                    "text-slate-600"
                                  }`}>{speaker.sentiment}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-500 flex items-center">
                                    <Zap className="w-3.5 h-3.5 mr-1.5" /> Energy
                                  </span>
                                  <span className={`font-semibold capitalize ${
                                    speaker.energy === "high" ? "text-orange-500" :
                                    speaker.energy === "low" ? "text-blue-400" :
                                    "text-slate-600"
                                  }`}>{speaker.energy}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-500 flex items-center">
                                    <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Formality
                                  </span>
                                  <span className="font-semibold text-slate-800 capitalize">{speaker.formality}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ) : (
                <SingleSpeakerMetrics
                  key={speakerFilter}
                  data={data}
                  speakerKey={speakerFilter}
                />
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display font-bold text-xl text-slate-900">
                      {speakerFilter === "all" 
                        ? "Conversation Transcript" 
                        : `${speakerFilter === "speaker_1" ? "Speaker 1" : "Speaker 2"}'s Lines`}
                    </h3>
                    {speakerFilter !== "all" && (
                      <span className="text-sm text-slate-400">
                        {filteredTranscript.length} of {data.transcript.length} lines
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={speakerFilter}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        {filteredTranscript.map((line, i) => {
                          const isSpeaker1 = line.speaker === "Speaker 1";
                          return (
                            <div key={`${speakerFilter}-${i}`} className={`flex flex-col ${isSpeaker1 ? 'items-end' : 'items-start'}`}>
                              <div className="flex items-center space-x-2 mb-1.5 px-1">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                  {line.speaker}
                                </span>
                                <span className="text-xs text-slate-400">
                                  {formatTime(line.start)}
                                </span>
                              </div>
                              
                              <div className={`
                                max-w-[85%] md:max-w-[75%] p-4 rounded-2xl
                                ${isSpeaker1 
                                  ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm shadow-primary/10' 
                                  : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                                }
                              `}>
                                <p className="leading-relaxed">{line.text}</p>
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
