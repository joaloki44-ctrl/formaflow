import Hero from "@/components/landing/Hero";
import Mission from "@/components/landing/Mission";
import Comparison from "@/components/landing/Comparison";
import Features from "@/components/landing/Features";
import CTA from "@/components/landing/CTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Hero />
      <Mission />
      <Comparison />
      <Features />
      <CTA />
    </main>
  );
}