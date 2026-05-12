"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export default function FilterSidebar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") ?? "");
  const [maxRate, setMaxRate] = useState(Number(searchParams.get("maxRate") ?? 200));

  const apply = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId && categoryId !== "all") params.set("categoryId", categoryId);
    if (maxRate < 200) params.set("maxRate", String(maxRate));
    router.push(`/tutors?${params.toString()}`);
  };

  const reset = () => {
    setSearch(""); setCategoryId(""); setMaxRate(200);
    router.push("/tutors");
  };

  return (
    <aside className="space-y-5">
      <div className="space-y-2">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tutors..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={categoryId || "all"} onValueChange={setCategoryId}>
          <SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Max Rate: ${maxRate}/hr</Label>
        <Slider
          min={10}
          max={200}
          step={5}
          value={[maxRate]}
          onValueChange={([val]) => setMaxRate(val)}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={apply} className="flex-1">Apply</Button>
        <Button variant="outline" size="icon" onClick={reset}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
