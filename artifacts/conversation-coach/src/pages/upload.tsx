import { useState, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileAudio, X, Loader2, ShieldAlert } from "lucide-react";
import { useAnalyzeConversation } from "@workspace/api-client-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageLayout } from "@/components/layout/PageLayout";
import { useToast } from "@/hooks/use-toast";

export default function UploadPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeMutation = useAnalyzeConversation();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/x-m4a'];
    // More relaxed validation for generic audio types since mime types can be tricky
    if (selectedFile.type.startsWith('audio/') || selectedFile.name.match(/\.(mp3|wav|m4a)$/i)) {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an .mp3, .wav, or .m4a file.",
        variant: "destructive"
      });
    }
  };

  const [loadingMessage, setLoadingMessage] = useState("Uploading audio...");

  const handleAnalyze = async () => {
    if (!file) return;
    
    setLoadingMessage("Uploading audio...");
    
    const messageTimer1 = setTimeout(() => setLoadingMessage("Transcribing conversation..."), 3000);
    const messageTimer2 = setTimeout(() => setLoadingMessage("Identifying speakers..."), 10000);
    const messageTimer3 = setTimeout(() => setLoadingMessage("Analyzing communication patterns..."), 20000);
    const messageTimer4 = setTimeout(() => setLoadingMessage("Almost done..."), 40000);
    
    try {
      const response = await analyzeMutation.mutateAsync({
        data: { audio: file }
      });
      
      sessionStorage.setItem('analysisResult', JSON.stringify(response));
      setLocation('/results');
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Analysis Failed",
        description: "We couldn't analyze that file. Please try again with a different audio recording.",
        variant: "destructive"
      });
    } finally {
      clearTimeout(messageTimer1);
      clearTimeout(messageTimer2);
      clearTimeout(messageTimer3);
      clearTimeout(messageTimer4);
    }
  };

  return (
    <PageLayout>
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="overflow-hidden border-0 premium-shadow">
            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-3">
                  Upload Conversation
                </h1>
                <p className="text-slate-500 text-lg">
                  Supported formats: .mp3, .m4a, .wav
                </p>
              </div>

              {/* Upload Zone */}
              <div 
                className={`
                  relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 ease-out
                  ${isDragging ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'}
                  ${file ? 'border-secondary/50 bg-secondary/5' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  accept=".mp3,.wav,.m4a,audio/*"
                  className="hidden" 
                />

                <AnimatePresence mode="wait">
                  {!file ? (
                    <motion.div 
                      key="upload-prompt"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                        <UploadCloud className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-xl font-medium text-slate-700 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-slate-400 text-sm">
                        Maximum file size: 50MB
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="file-selected"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 relative group">
                        <FileAudio className="w-10 h-10 text-secondary" />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                          }}
                          className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-full p-1.5 shadow-md transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-lg font-medium text-slate-800 break-all max-w-xs truncate">
                        {file.name}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Consent & Submit */}
              <div className="mt-10 space-y-8">
                <label className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-slate-900 mb-1 flex items-center">
                      <ShieldAlert className="w-4 h-4 mr-1.5 text-slate-500" />
                      Consent Confirmation
                    </p>
                    <p className="text-sm text-slate-600">
                      By uploading this recording, I confirm that all participants have consented to being recorded and having this audio analyzed for coaching purposes.
                    </p>
                  </div>
                </label>

                <Button 
                  size="lg" 
                  className="w-full text-lg shadow-xl shadow-primary/20"
                  disabled={!file || !consent || analyzeMutation.isPending}
                  onClick={handleAnalyze}
                >
                  {analyzeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {loadingMessage}
                    </>
                  ) : (
                    'Analyze Conversation'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </PageLayout>
  );
}
