"use client";

import { useState, useTransition } from "react";
import {
  Star, Search, XCircle, GraduationCap,
  Tag, DollarSign, Loader2, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateFeaturedTutorAction } from "@/actions/admin.action";

interface Tutor {
  id: string;
  name: string;
  category?: string;
  hourlyRate?: number;
  avgRating?: number;
  profileImage?: string;
  isFeatured: boolean;
}

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
];

function TutorCard({
  tutor, idx, onToggle, isPending,
}: {
  tutor: Tutor;
  idx: number;
  onToggle: (id: string, val: boolean) => void;
  isPending: boolean;
}) {
  const rating = tutor.avgRating != null ? Number(tutor.avgRating).toFixed(1) : null;

  return (
    <Card className={`group overflow-hidden transition-all hover:shadow-md ${
      tutor.isFeatured
        ? "ring-2 ring-primary/30 border-primary/30"
        : "border-border/60"
    }`}>
      {/* Top bar */}
      <div className={`h-[3px] w-full ${
        tutor.isFeatured
          ? "bg-linear-to-r from-primary to-violet-500"
          : "bg-muted"
      }`} />

      <CardContent className="p-5">

        {/* Avatar + Featured badge row */}
        <div className="mb-4 flex items-start justify-between gap-3">
          {/* Avatar */}
          <div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black overflow-hidden ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
            {tutor.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tutor.profileImage} alt={tutor.name} className="size-14 object-cover" />
            ) : (
              tutor.name[0]?.toUpperCase() ?? "T"
            )}
          </div>

          {/* Featured badge */}
          {tutor.isFeatured ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              <Star className="size-3 fill-primary" />
              Featured
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              <span className="size-1.5 rounded-full bg-muted-foreground/40" />
              Standard
            </span>
          )}
        </div>

        {/* Name */}
        <p className="font-black text-base leading-snug">{tutor.name}</p>

        {/* Category */}
        {tutor.category && (
          <div className="mt-1 flex items-center gap-1.5">
            <Tag className="size-3 text-muted-foreground shrink-0" />
            <p className="text-xs font-medium text-muted-foreground truncate">{tutor.category}</p>
          </div>
        )}

        {/* Rating + Price */}
        <div className="mt-3 flex items-center gap-3">
          {rating && (
            <div className="flex items-center gap-1 rounded-lg bg-muted/60 px-2.5 py-1">
              <Star className="size-3.5 fill-primary text-primary" />
              <span className="text-xs font-bold">{rating}</span>
            </div>
          )}
          {tutor.hourlyRate != null && (
            <div className="flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1">
              <DollarSign className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                ৳{tutor.hourlyRate}/hr
              </span>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="mt-4">
          {tutor.isFeatured ? (
            <Button
              size="sm"
              variant="outline"
              className="w-full gap-2 rounded-xl border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
              disabled={isPending}
              onClick={() => onToggle(tutor.id, false)}
            >
              <XCircle className="size-4" />
              Remove from Featured
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-full gap-2 rounded-xl"
              disabled={isPending}
              onClick={() => onToggle(tutor.id, true)}
            >
              <Sparkles className="size-4" />
              Add to Featured
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function FeaturedTutorsClient({ tutors: initial }: { tutors: Tutor[] }) {
  const [tutors, setTutors]       = useState(initial);
  const [search, setSearch]       = useState("");
  const [tab, setTab]             = useState<"all" | "featured">("all");
  const [isPending, startTransition] = useTransition();

  const featuredCount = tutors.filter((t) => t.isFeatured).length;

  const filtered = tutors.filter((t) => {
    const matchTab    = tab === "all" || t.isFeatured;
    const q           = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || (t.category ?? "").toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  function handleToggle(id: string, newVal: boolean) {
    startTransition(async () => {
      const res = await updateFeaturedTutorAction(newVal, id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(newVal ? "Tutor added to Featured!" : "Removed from Featured.");
        setTutors((prev) => prev.map((t) => (t.id === id ? { ...t, isFeatured: newVal } : t)));
      }
    });
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />

      <CardHeader className="border-b pb-4">
        <div className="flex flex-col gap-4">

          {/* Title + counts */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="size-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Tutor List</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {filtered.length} shown · {featuredCount} featured
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search name or category…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl pl-9 text-sm h-9"
              />
            </div>
          </div>

          {/* Tab pills */}
          <div className="flex gap-2">
            <button
              onClick={() => setTab("all")}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                tab === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <GraduationCap className="size-3.5" />
              All Tutors
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === "all" ? "bg-white/20" : "bg-background"}`}>
                {tutors.length}
              </span>
            </button>

            <button
              onClick={() => setTab("featured")}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                tab === "featured"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Star className="size-3.5" />
              Featured Only
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === "featured" ? "bg-white/20" : "bg-background"}`}>
                {featuredCount}
              </span>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-muted">
              {tab === "featured"
                ? <Star className="size-8 text-muted-foreground/40" />
                : <GraduationCap className="size-8 text-muted-foreground/40" />
              }
            </div>
            <div>
              <p className="font-semibold">
                {tab === "featured" ? "No featured tutors yet" : "No tutors found"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {tab === "featured"
                  ? "Switch to All Tutors and click Add to Featured"
                  : search ? `No results for "${search}"` : "No tutors on the platform yet"
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((tutor, idx) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
                idx={idx}
                onToggle={handleToggle}
                isPending={isPending}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
