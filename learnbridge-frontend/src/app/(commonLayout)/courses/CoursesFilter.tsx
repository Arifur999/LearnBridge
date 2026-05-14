"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
}

export default function CoursesFilter({
  categories = [],
  basePath = "/courses",
}: {
  categories?: Category[];
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }

      if (category && category !== "all") {
        params.set("category", category);
      } else {
        params.delete("category");
      }

      if (minPrice.trim()) {
        params.set("minPrice", minPrice.trim());
      } else {
        params.delete("minPrice");
      }

      if (maxPrice.trim()) {
        params.set("maxPrice", maxPrice.trim());
      } else {
        params.delete("maxPrice");
      }

      params.delete("page");
      router.push(`${basePath}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, category, minPrice, maxPrice, router, searchParams, basePath]);

  return (
    <div className="mb-10 rounded-xl border bg-background p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tutors or subjects..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ArrowUpDown className="hidden h-4 w-4 text-muted-foreground sm:block" />

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((item) => {
                const label = item.name ?? item.title ?? "Category";
                const value = item.id ?? item._id ?? label;
                return (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Input
            type="number"
            min="0"
            placeholder="Min price"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            className="w-full sm:w-28"
          />

          <Input
            type="number"
            min="0"
            placeholder="Max price"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="w-full sm:w-28"
          />
        </div>
      </div>
    </div>
  );
}
