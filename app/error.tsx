"use client";

import { useEffect } from "react";
import { RefreshCcw, AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Vercel Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>

      <h1 className="text-4xl font-black text-white tracking-tighter mb-4">
        Exception du Système
      </h1>

      <p className="text-slate-500 max-w-md mb-12 font-medium">
        Une erreur serveur est survenue lors de l'initialisation du protocole.
        {error.digest && (
          <code className="block mt-4 p-2 bg-white/5 rounded text-[10px] text-secondary font-mono">
            ID: {error.digest}
          </code>
        )}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="btn-saas-primary flex items-center gap-2 px-8"
        >
          <RefreshCcw className="w-4 h-4" />
          Réinitialiser la session
        </button>

        <Link
          href="/"
          className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 font-bold text-sm transition-all flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Retour à la base
        </Link>
      </div>
    </div>
  );
}
