"use client";

import { useRouter } from "next/navigation";

export default function AnalyticsFilter({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();

  return (
    <select
      value={defaultValue}
      onChange={(e) => router.push(`/dashboard/analytics?days=${e.target.value}`)}
      className="bg-white border border-gray-100 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-secondary/20 shadow-sm cursor-pointer hover:bg-gray-50 transition-all"
    >
      <option value="7">7 derniers jours</option>
      <option value="30">30 derniers jours</option>
      <option value="90">90 derniers jours</option>
      <option value="365">12 derniers mois</option>
    </select>
  );
}
