"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export default function CourseFilterSidebar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") ?? "");
  const [level, setLevel] = useState(searchParams.get("level") ?? "");

  const apply = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId && categoryId !== "all") params.set("categoryId", categoryId);
    if (level && level !== "all") params.set("level", level);
    router.push(`/courses?${params.toString()}`);
  };

  const reset = () => {
    setSearch(""); setCategoryId(""); setLevel("");
    router.push("/courses");
  };

  return (
    <aside className="space-y-5">
      <div className="space-y-2">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
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
        <Label>Level</Label>
        <Select value={level || "all"} onValueChange={setLevel}>
          <SelectTrigger><SelectValue placeholder="All levels" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="BEGINNER">Beginner</SelectItem>
            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
            <SelectItem value="ADVANCED">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button onClick={apply} className="flex-1">Apply Filters</Button>
        <Button variant="outline" size="icon" onClick={reset}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
