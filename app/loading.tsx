import { Rocket } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-secondary shadow-sm">
          <Rocket className="w-7 h-7 animate-bounce" />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <p className="text-xs font-bold text-muted uppercase tracking-widest">
          Chargement en cours...
        </p>
        <div className="w-40 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-secondary w-1/2 rounded-full animate-shimmer" />
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
