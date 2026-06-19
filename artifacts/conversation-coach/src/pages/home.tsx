import { Link } from "wouter";
import { motion } from "framer-motion";
import { Mic, UploadCloud, PieChart, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageLayout } from "@/components/layout/PageLayout";

export default function Home() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-[-1] opacity-60 mix-blend-multiply pointer-events-none">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Abstract gentle blue background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                Enhance your self-awareness
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-slate-900 leading-[1.1] mb-6">
                Most People Talk <span className="text-gradient">More Than They Think.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                Upload a recorded conversation and see exactly who talked more, how many questions were asked, and how balanced your communication really is.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/upload" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto rounded-full group">
                    Analyze a Conversation
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/privacy" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full">
                    <ShieldCheck className="mr-2 w-5 h-5 text-slate-500" />
                    Read Privacy Policy
                  </Button>
                </Link>
              </div>
              
              <p className="mt-6 text-sm text-slate-500 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-secondary" />
                100% private. Audio is deleted immediately after analysis.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative lg:ml-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white p-8 rounded-3xl premium-shadow border border-white/60">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Conversation Score</p>
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-display font-bold text-primary">82</span>
                      <span className="text-lg font-medium text-slate-400 mb-1.5">/100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500 mb-1">Personality</p>
                    <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-semibold text-sm">
                      The Storyteller
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span className="text-slate-700">You (Speaker 1)</span>
                      <span className="text-slate-500">65%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                      <div className="h-full bg-secondary" style={{ width: '35%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm mt-2 font-medium">
                      <span className="text-slate-700">Them (Speaker 2)</span>
                      <span className="text-slate-500">35%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs text-slate-500 mb-1">Questions Asked</p>
                      <p className="text-2xl font-bold text-slate-800">You: 3 <span className="text-sm font-normal text-slate-400">/ Them: 12</span></p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs text-slate-500 mb-1">Interruptions</p>
                      <p className="text-2xl font-bold text-slate-800">You: 4 <span className="text-sm font-normal text-slate-400">/ Them: 1</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              How Conversation Coach Works
            </h2>
            <p className="text-lg text-slate-600">
              Three simple steps to gain powerful insights into your communication style.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20"></div>

            <div className="relative pt-6 text-center">
              <div className="w-16 h-16 mx-auto bg-white border-4 border-slate-50 rounded-2xl shadow-lg flex items-center justify-center relative z-10 mb-6 group hover:-translate-y-1 transition-transform">
                <Mic className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">1. Record</h3>
              <p className="text-slate-600">Use your phone's voice memo app to record a meeting, 1-on-1, or casual conversation.</p>
            </div>

            <div className="relative pt-6 text-center">
              <div className="w-16 h-16 mx-auto bg-white border-4 border-slate-50 rounded-2xl shadow-lg flex items-center justify-center relative z-10 mb-6 group hover:-translate-y-1 transition-transform">
                <UploadCloud className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">2. Upload</h3>
              <p className="text-slate-600">Securely upload the audio file here. We support .mp3, .m4a, and .wav formats.</p>
            </div>

            <div className="relative pt-6 text-center">
              <div className="w-16 h-16 mx-auto bg-white border-4 border-slate-50 rounded-2xl shadow-lg flex items-center justify-center relative z-10 mb-6 group hover:-translate-y-1 transition-transform">
                <PieChart className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">3. Analyze</h3>
              <p className="text-slate-600">Get a beautiful, easy-to-read report showing your talk ratio, questions, and insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-slate-50 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldCheck className="w-12 h-12 text-secondary mx-auto mb-6 opacity-80" />
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
            Private & Secure Coaching
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            You choose what to upload. By uploading a recording, you confirm that all participants consent to analysis. We never store your audio—it is processed and immediately discarded.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-left">
            <div className="flex items-center text-slate-700 bg-white px-4 py-3 rounded-xl shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-secondary mr-3" />
              <span>No background recording</span>
            </div>
            <div className="flex items-center text-slate-700 bg-white px-4 py-3 rounded-xl shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-secondary mr-3" />
              <span>Audio deleted instantly</span>
            </div>
            <div className="flex items-center text-slate-700 bg-white px-4 py-3 rounded-xl shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-secondary mr-3" />
              <span>Coaching focus, not surveillance</span>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
