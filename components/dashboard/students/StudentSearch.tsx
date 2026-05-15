"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export default function StudentSearch({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    const url = debouncedValue ? `/dashboard/students?q=${debouncedValue}` : "/dashboard/students";
    router.push(url);
  }, [debouncedValue, router]);

  return (
    <div className="relative w-full md:w-80">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Rechercher par nom ou email..."
        className="pl-12 pr-4 py-3 border border-gray-100 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all w-full shadow-sm text-sm"
      />
    </div>
  );
}
