import { Link } from "wouter";
import { Waves } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Waves className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-slate-900">Conversation Coach</span>
          </div>
          
          <div className="flex space-x-6 text-sm text-slate-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/upload" className="hover:text-primary transition-colors">Upload</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-slate-400">
          <p>For self-awareness and communication coaching. Please record responsibly.</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} Conversation Coach. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
