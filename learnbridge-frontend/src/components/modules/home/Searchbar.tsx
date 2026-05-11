"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function Searchbar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/tutors?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/tutors");
    }
  };

  return (
    <div className="flex w-full max-w-xl overflow-hidden rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm">
      <input
        type="text"
        placeholder="Search tutors by subject or name…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-white/60 outline-none text-sm"
      />
      <button
        onClick={handleSearch}
        className="flex items-center gap-2 bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
      >
        <Search className="size-4" />
        Search
      </button>
    </div>
  );
}
