import { Link, useLocation } from "wouter";
import { Waves } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Header() {
  const [location] = useLocation();

  return (
    <header className="fixed top-0 w-full z-50 glass-card border-b-0 border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-300">
              <Waves className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              Conversation<span className="text-primary">Coach</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-slate-600'}`}
            >
              Home
            </Link>
            <Link 
              href="/privacy" 
              className={`text-sm font-medium transition-colors hover:text-primary ${location === '/privacy' ? 'text-primary' : 'text-slate-600'}`}
            >
              Privacy
            </Link>
          </nav>

          <div className="flex items-center">
            {location !== '/upload' && (
              <Link href="/upload" className="w-full">
                <Button variant="default" size="sm" className="hidden md:flex rounded-full px-6">
                  Analyze Recording
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
