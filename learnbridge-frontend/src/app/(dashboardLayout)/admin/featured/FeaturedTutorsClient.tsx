"use client";

import { useState, useTransition } from "react";
import { Star, Search, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

export default function FeaturedTutorsClient({ tutors: initial }: { tutors: Tutor[] }) {
  const [tutors, setTutors] = useState(initial);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "featured">("all");
  const [isPending, startTransition] = useTransition();

  const filtered = tutors.filter((t) => {
    const matchTab = tab === "all" || t.isFeatured;
    const q = search.toLowerCase();
    return matchTab && (!q || t.name.toLowerCase().includes(q) || (t.category ?? "").toLowerCase().includes(q));
  });

  function toggle(id: string, newVal: boolean) {
    startTransition(async () => {
      const res = await updateFeaturedTutorAction(newVal, id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(newVal ? "Tutor featured!" : "Removed from featured.");
        setTutors((prev) => prev.map((t) => (t.id === id ? { ...t, isFeatured: newVal } : t)));
      }
    });
  }

  const featuredCount = tutors.filter((t) => t.isFeatured).length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <Star className="size-3.5 fill-current" /> {featuredCount} featured
        </span>
        <span>{tutors.length} total tutors</span>
      </div>

      {/* Tabs + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(["all", "featured"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t === "all" ? "All Tutors" : "Featured Only"}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tutor grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-14 text-center">
          <p className="text-sm text-muted-foreground">No tutors found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <div
              key={t.id}
              className={`rounded-2xl border bg-background p-5 shadow-sm transition-all ${
                t.isFeatured ? "border-amber-400/60 ring-1 ring-amber-400/30" : ""
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary shrink-0">
                  {t.profileImage ? (
                    <img src={t.profileImage} alt={t.name} className="size-12 rounded-full object-cover" />
                  ) : (
                    t.name.charAt(0).toUpperCase()
                  )}
                </div>
                {t.isFeatured && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <Star className="size-3 fill-current" /> Featured
                  </span>
                )}
              </div>

              <h3 className="font-semibold leading-snug">{t.name}</h3>
              {t.category && <p className="mt-0.5 text-xs font-medium text-primary">{t.category}</p>}

              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                {t.avgRating != null && <span>★ {Number(t.avgRating).toFixed(1)}</span>}
                {t.hourlyRate != null && <span>BDT {t.hourlyRate}/hr</span>}
              </div>

              <div className="mt-4">
                {t.isFeatured ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-1.5 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    disabled={isPending}
                    onClick={() => toggle(t.id, false)}
                  >
                    <XCircle className="size-3.5" /> Remove from Featured
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full gap-1.5 bg-amber-500 hover:bg-amber-600 text-white"
                    disabled={isPending}
                    onClick={() => toggle(t.id, true)}
                  >
                    <CheckCircle2 className="size-3.5" /> Add to Featured
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
