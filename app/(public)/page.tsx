import Hero from "@/components/landing/Hero";
import Mission from "@/components/landing/Mission";
import Comparison from "@/components/landing/Comparison";
import Features from "@/components/landing/Features";
import Enterprise from "@/components/landing/Enterprise";
import CTA from "@/components/landing/CTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream selection:bg-secondary/20 selection:text-secondary">
      <Hero />
      <div className="space-y-0 relative">
        <Mission />
        <Features />
        <Enterprise />
        <Comparison />
        <CTA />
      </div>
    </main>
  );
}
