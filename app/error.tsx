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
    console.error("Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>

      <h1 className="text-2xl font-bold text-primary mb-3">
        Une erreur est survenue
      </h1>

      <p className="text-muted max-w-md mb-10">
        Désolé, quelque chose s'est mal passé.
        {error.digest && (
          <code className="block mt-3 px-3 py-2 bg-gray-100 rounded text-xs text-secondary font-mono">
            ID: {error.digest}
          </code>
        )}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-secondary text-white rounded-lg font-semibold text-sm hover:bg-secondary/90 transition-colors flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Réessayer
        </button>

        <Link
          href="/"
          className="px-6 py-3 bg-white text-primary rounded-lg border border-gray-200 font-medium text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
