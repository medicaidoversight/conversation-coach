import { Shield, Lock, Trash2, EyeOff } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/Card";

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div className="flex-grow bg-slate-50/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-primary border border-slate-100">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Privacy & Security</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Your conversations are deeply personal. Here is our unwavering commitment to how we handle your audio and data.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <Card className="bg-white">
              <CardContent className="p-6">
                <Trash2 className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Deletion</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Audio files are processed strictly in memory and are deleted immediately after the analysis report is generated. We never persist your raw audio files.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <EyeOff className="w-8 h-8 text-secondary mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Background Recording</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Conversation Coach never listens to your microphone in the background. You must actively and intentionally upload a file to receive coaching insights.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <Lock className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Strict Consent Protocol</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our tool is designed for mutual growth and self-awareness, not surveillance. We mandate that all users obtain clear consent from all participants before analyzing any recording.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <Shield className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Your Data Stays Yours</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We don't sell your data to third parties or use your personal conversations to train public AI models. The insights generated are yours alone.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 bg-white p-8 rounded-2xl border border-slate-100 premium-shadow">
            <h3>Our Coaching Philosophy</h3>
            <p>
              Conversation Coach was built on the belief that communication can always improve. Often, we simply aren't aware of our own conversational habits—how much we speak, how often we interrupt, or if we are actively asking questions to understand the other person.
            </p>
            <p>
              This tool is meant as a mirror, not a microphone. We strongly discourage the use of this app for secretly recording individuals, employee surveillance, or any activity that violates trust. Communication coaching works best when all parties are aware and engaged in the process of building better relationships.
            </p>
          </div>
          
        </div>
      </div>
    </PageLayout>
  );
}
