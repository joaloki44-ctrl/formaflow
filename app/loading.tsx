import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      <p className="mt-6 text-sm text-muted font-medium">
        Chargement...
      </p>
    </div>
  );
}
