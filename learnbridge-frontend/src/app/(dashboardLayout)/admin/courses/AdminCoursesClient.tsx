"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  CheckCircle2, XCircle, Search, BookOpen,
  Users, DollarSign, User, Tag, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { approveCourseAction, rejectCourseAction } from "@/actions/dashboard.action";
import type { AdminCourse } from "./page";

/* ── Config ─────────────────────────────────────────────────── */
const TABS = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;
type Tab = typeof TABS[number];

const STATUS_CFG: Record<string, { label: string; bg: string; textColor: string; dot: string; bar: string }> = {
  PENDING:  { label: "Pending",  bg: "bg-amber-100 dark:bg-amber-900/30",     textColor: "text-amber-700 dark:text-amber-400",     dot: "bg-amber-500",   bar: "from-amber-500 to-yellow-400"  },
  APPROVED: { label: "Approved", bg: "bg-emerald-100 dark:bg-emerald-900/30", textColor: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500", bar: "from-emerald-500 to-teal-400"  },
  REJECTED: { label: "Rejected", bg: "bg-red-100 dark:bg-red-900/30",         textColor: "text-red-700 dark:text-red-400",         dot: "bg-red-500",     bar: "from-red-500 to-rose-400"      },
};

const TAB_CFG: Record<string, { active: string; count: string }> = {
  ALL:      { active: "bg-primary text-primary-foreground",                                                count: "bg-white/20 text-white" },
  PENDING:  { active: "bg-amber-500 text-white",                                                           count: "bg-white/20 text-white" },
  APPROVED: { active: "bg-emerald-500 text-white",                                                         count: "bg-white/20 text-white" },
  REJECTED: { active: "bg-red-500 text-white",                                                             count: "bg-white/20 text-white" },
};

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
];

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80",
];

function getCourseImg(c: AdminCourse, idx: number) {
  if (c.image) return c.image;
  return FALLBACK_IMGS[idx % FALLBACK_IMGS.length];
}

/* ── Course Card ─────────────────────────────────────────────── */
function CourseCard({
  course, idx, onApprove, onReject, isPending,
}: {
  course: AdminCourse;
  idx: number;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isPending: boolean;
}) {
  const statusKey = (course.status ?? "PENDING").toUpperCase();
  const cfg       = STATUS_CFG[statusKey] ?? STATUS_CFG.PENDING;
  const isReviewable = statusKey === "PENDING";
  const trainerName  = course.trainer?.name ?? "Unknown Tutor";

  return (
    <Card className="overflow-hidden flex flex-col group transition-shadow hover:shadow-md">
      {/* Top color bar by status */}
      <div className={`h-[3px] w-full bg-linear-to-r ${cfg.bar}`} />

      {/* Thumbnail */}
      <div className="relative h-40 bg-muted shrink-0 overflow-hidden">
        <Image
          src={getCourseImg(course, idx)}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

        {/* Status badge */}
        <span className={`absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${cfg.bg} ${cfg.textColor}`}>
          <span className={`size-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>

        {/* Price bottom-left */}
        {course.price != null && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-white">
            <DollarSign className="size-3" />
            {course.price > 0 ? `৳${course.price}` : "Free"}
          </span>
        )}
      </div>

      {/* Body */}
      <CardContent className="flex flex-1 flex-col gap-3 p-4">

        {/* Title + category */}
        <div>
          <h3 className="font-black leading-snug line-clamp-1 text-sm">{course.title}</h3>
          {course.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {course.description}
            </p>
          )}
          {course.category && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              <Tag className="size-3" />
              {course.category}
            </span>
          )}
        </div>

        {/* Tutor row */}
        {course.trainer && (
          <div className="flex items-center gap-2.5 rounded-xl border bg-muted/40 px-3 py-2.5">
            <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
              {trainerName[0]?.toUpperCase() ?? "T"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">{trainerName}</p>
              {course.trainer.email && (
                <p className="truncate text-[10px] text-muted-foreground">{course.trainer.email}</p>
              )}
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {course._count != null && (
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              {course._count.enrollments} enrolled
            </span>
          )}
          {course.createdAt && (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {new Date(course.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          )}
        </div>

        {/* Actions — only for PENDING */}
        {isReviewable && (
          <div className="mt-auto flex gap-2 pt-1">
            <Button
              size="sm"
              className="flex-1 gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isPending}
              onClick={() => onApprove(course.id)}
            >
              <CheckCircle2 className="size-3.5" /> Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-1.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
              disabled={isPending}
              onClick={() => onReject(course.id)}
            >
              <XCircle className="size-3.5" /> Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Main Component ──────────────────────────────────────────── */
export default function AdminCoursesClient({ initialCourses }: { initialCourses: AdminCourse[] }) {
  const [courses, setCourses]   = useState<AdminCourse[]>(initialCourses);
  const [tab, setTab]           = useState<Tab>("PENDING");
  const [search, setSearch]     = useState("");
  const [isPending, startTransition] = useTransition();

  const counts = {
    ALL:      courses.length,
    PENDING:  courses.filter((c) => (c.status ?? "").toUpperCase() === "PENDING").length,
    APPROVED: courses.filter((c) => (c.status ?? "").toUpperCase() === "APPROVED").length,
    REJECTED: courses.filter((c) => (c.status ?? "").toUpperCase() === "REJECTED").length,
  };

  const filtered = courses.filter((c) => {
    const matchTab    = tab === "ALL" || (c.status ?? "").toUpperCase() === tab;
    const q           = search.toLowerCase();
    const matchSearch = !q
      || c.title.toLowerCase().includes(q)
      || (c.trainer?.name ?? "").toLowerCase().includes(q)
      || (c.category ?? "").toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  function updateStatus(id: string, status: string) {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  function handleApprove(id: string) {
    startTransition(async () => {
      const res = await approveCourseAction(id);
      if (res.success) { toast.success("Course approved!"); updateStatus(id, "APPROVED"); }
      else toast.error(res.message);
    });
  }

  function handleReject(id: string) {
    startTransition(async () => {
      const res = await rejectCourseAction(id);
      if (res.success) { toast.success("Course rejected."); updateStatus(id, "REJECTED"); }
      else toast.error(res.message);
    });
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-[3px] w-full bg-linear-to-r from-primary to-amber-500" />
      <CardHeader className="border-b pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Title */}
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Course List</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">{filtered.length} courses shown</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search title, tutor, category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl pl-9 text-sm"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 pt-3">
          {TABS.map((t) => {
            const isActive = tab === t;
            const cfg = TAB_CFG[t];
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? cfg.active
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {t.charAt(0) + t.slice(1).toLowerCase()}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? cfg.count : "bg-background"}`}>
                  {counts[t]}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-muted">
              <BookOpen className="size-8 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold">No courses found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {search ? `No results for "${search}"` : `No ${tab.toLowerCase()} courses`}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((course, idx) => (
              <CourseCard
                key={course.id}
                course={course}
                idx={idx}
                onApprove={handleApprove}
                onReject={handleReject}
                isPending={isPending}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
