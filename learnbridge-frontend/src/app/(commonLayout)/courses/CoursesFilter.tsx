"use client";

import { useRouter, useSearchParams } from "next/navigation";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function CoursesFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);

    router.push(`/courses?${params.toString()}`);
  };

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row">
      <Input
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Button onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
}
