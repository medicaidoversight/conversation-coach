import { Header } from "./Header";
import { Footer } from "./Footer";
import { ReactNode } from "react";

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Header />
      <main className="flex-grow flex flex-col relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
