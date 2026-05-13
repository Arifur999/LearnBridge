"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Search, BookOpen, Users, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { approveCourseAction, rejectCourseAction } from "@/actions/dashboard.action";
import type { AdminCourse } from "./page";

const STATUS_STYLE: Record<string, string> = {
  PENDING:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  APPROVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const TABS = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;
type Tab = typeof TABS[number];

const CATEGORY_IMG: Record<string, string> = {
  Programming: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
  Design:      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
  default:     "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80",
};

function getImg(c: AdminCourse) {
  if (c.image) return c.image;
  return CATEGORY_IMG[c.category ?? ""] ?? CATEGORY_IMG.default;
}

export default function AdminCoursesClient({ initialCourses }: { initialCourses: AdminCourse[] }) {
  const [courses, setCourses] = useState<AdminCourse[]>(initialCourses);
  const [tab, setTab] = useState<Tab>("PENDING");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = courses.filter((c) => {
    const matchTab = tab === "ALL" || c.status === tab;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      (c.trainer?.name ?? "").toLowerCase().includes(q) ||
      (c.category ?? "").toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const counts = {
    ALL:      courses.length,
    PENDING:  courses.filter((c) => c.status === "PENDING").length,
    APPROVED: courses.filter((c) => c.status === "APPROVED").length,
    REJECTED: courses.filter((c) => c.status === "REJECTED").length,
  };

  function updateStatus(id: string, status: string) {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  }

  function handleApprove(id: string) {
    startTransition(async () => {
      const res = await approveCourseAction(id);
      if (res.success) {
        toast.success("Course approved!");
        updateStatus(id, "APPROVED");
      } else {
        toast.error(res.message);
      }
    });
  }

  function handleReject(id: string) {
    startTransition(async () => {
      const res = await rejectCourseAction(id);
      if (res.success) {
        toast.success("Course rejected.");
        updateStatus(id, "REJECTED");
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t.charAt(0) + t.slice(1).toLowerCase()}
            <span className={`rounded-full px-1.5 py-0.5 text-xs ${tab === t ? "bg-white/20" : "bg-background"}`}>
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, tutor or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Course list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-16 text-center">
          <BookOpen className="mx-auto mb-3 size-10 text-muted-foreground/30" />
          <p className="font-medium text-muted-foreground">No courses found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => {
            const statusKey = (c.status ?? "PENDING").toUpperCase();
            const statusClass = STATUS_STYLE[statusKey] ?? STATUS_STYLE.PENDING;
            const isPend = statusKey === "PENDING";

            return (
              <div key={c.id} className="rounded-2xl border bg-card overflow-hidden flex flex-col">
                {/* Thumbnail */}
                <div className="relative h-36 bg-muted shrink-0">
                  <Image src={getImg(c)} alt={c.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
                  <span className={`absolute top-2 right-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass}`}>
                    {statusKey.charAt(0) + statusKey.slice(1).toLowerCase()}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-4 gap-3">
                  {/* Title + category */}
                  <div>
                    <h3 className="font-semibold leading-snug line-clamp-1">{c.title}</h3>
                    {c.description != null && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{c.description}</p>
                    )}
                    {c.category != null && (
                      <Badge variant="outline" className="mt-1.5 text-xs">{c.category}</Badge>
                    )}
                  </div>

                  {/* Tutor */}
                  {c.trainer != null && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{c.trainer.name}</span>
                      {" · "}
                      {c.trainer.email}
                    </div>
                  )}

                  {/* Price + enrollments */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      <DollarSign className="size-3.5" />
                      {c.price != null && c.price > 0 ? c.price : "Free"}
                    </span>
                    {c._count != null && (
                      <span className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Users className="size-3" /> {c._count.enrollments} enrolled
                      </span>
                    )}
                  </div>

                  {/* Actions — only for PENDING */}
                  {isPend && (
                    <div className="flex gap-2 mt-auto pt-1">
                      <Button
                        size="sm"
                        className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={isPending}
                        onClick={() => handleApprove(c.id)}
                      >
                        <CheckCircle2 className="size-3.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1.5 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        disabled={isPending}
                        onClick={() => handleReject(c.id)}
                      >
                        <XCircle className="size-3.5" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
