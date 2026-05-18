"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
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
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (category && category !== "all") params.set("category", category);
      if (minPrice.trim()) params.set("minPrice", minPrice.trim());
      if (maxPrice.trim()) params.set("maxPrice", maxPrice.trim());
      if (sort && sort !== "newest") params.set("sort", sort);

      router.push(`${basePath}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, category, minPrice, maxPrice, sort, router, basePath]);

  return (
    <div className="mb-10 rounded-xl border bg-background p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Sort */}
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="price-asc">Price: Low → High</SelectItem>
              <SelectItem value="price-desc">Price: High → Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Category */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((item) => {
                const label = item.name ?? item.title ?? "Category";
                return (
                  <SelectItem key={item.id ?? item._id ?? label} value={label}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Price range */}
          <Input
            type="number"
            min="0"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full sm:w-28"
          />
          <Input
            type="number"
            min="0"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full sm:w-28"
          />
        </div>
      </div>
    </div>
  );
}
