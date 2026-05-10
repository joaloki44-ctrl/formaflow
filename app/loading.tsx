import { Rocket } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center">
      <div className="relative">
        {/* Neon Glow effect */}
        <div className="absolute -inset-8 bg-secondary blur-3xl opacity-20 animate-pulse" />

        <div className="relative w-20 h-20 bg-dark border border-white/10 rounded-3xl flex items-center justify-center text-white shadow-2xl">
          <Rocket className="w-8 h-8 animate-bounce" />
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <p className="text-[10px] font-black text-secondary uppercase tracking-[0.5em] animate-pulse">
          Initialisation du flux Elite
        </p>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-secondary w-1/3 rounded-full animate-shimmer" />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-shimmer {
          animation: shimmer 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
