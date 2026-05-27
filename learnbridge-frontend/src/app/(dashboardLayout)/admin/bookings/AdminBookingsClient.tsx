"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpenCheck, CheckCircle2, TrendingUp, XCircle,
  Clock, Calendar, GraduationCap, Search, ArrowRight, DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/* ── Types ── */
type Booking = Record<string, unknown>;

const text = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const nestedName = (value: unknown) =>
  value && typeof value === "object" && "name" in value
    ? (value as { name?: unknown }).name
    : undefined;

/* ── Config ── */
const STATUS_CFG: Record<string, { label: string; bg: string; textColor: string; dot: string }> = {
  CONFIRMED: { label: "Confirmed", bg: "bg-blue-100 dark:bg-blue-900/30",       textColor: "text-blue-700 dark:text-blue-400",       dot: "bg-blue-500"             },
  COMPLETED: { label: "Completed", bg: "bg-emerald-100 dark:bg-emerald-900/30", textColor: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500 animate-pulse" },
  CANCELLED: { label: "Cancelled", bg: "bg-red-100 dark:bg-red-900/30",         textColor: "text-red-700 dark:text-red-400",         dot: "bg-red-500"              },
  PENDING:   { label: "Pending",   bg: "bg-amber-100 dark:bg-amber-900/30",     textColor: "text-amber-700 dark:text-amber-400",     dot: "bg-amber-500"            },
};

const TAB_CFG: Record<string, { icon: React.ElementType; active: string; countBg: string }> = {
  ALL:       { icon: BookOpenCheck, active: "bg-primary text-primary-foreground",                  countBg: "bg-white/20 text-white"   },
  CONFIRMED: { icon: TrendingUp,    active: "bg-blue-500 text-white",                              countBg: "bg-white/20 text-white"   },
  COMPLETED: { icon: CheckCircle2,  active: "bg-emerald-500 text-white",                           countBg: "bg-white/20 text-white"   },
  PENDING:   { icon: Clock,         active: "bg-amber-500 text-white",                             countBg: "bg-white/20 text-white"   },
  CANCELLED: { icon: XCircle,       active: "bg-red-500 text-white",                               countBg: "bg-white/20 text-white"   },
};

const TABS = ["ALL", "CONFIRMED", "COMPLETED", "PENDING", "CANCELLED"] as const;
type Tab = typeof TABS[number];

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
];

const TUTOR_AVATAR_COLORS = [
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400",
  "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
];

export default function AdminBookingsClient({ bookings }: { bookings: Booking[] }) {
  const [tab, setTab]       = useState<Tab>("ALL");
  const [search, setSearch] = useState("");

  const counts = {
    ALL:       bookings.length,
    CONFIRMED: bookings.filter((b) => text(b.status, "").toUpperCase() === "CONFIRMED").length,
    COMPLETED: bookings.filter((b) => text(b.status, "").toUpperCase() === "COMPLETED").length,
    PENDING:   bookings.filter((b) => text(b.status, "").toUpperCase() === "PENDING").length,
    CANCELLED: bookings.filter((b) => text(b.status, "").toUpperCase() === "CANCELLED").length,
  };

  const filtered = bookings.filter((b) => {
    const rawStatus = text(b.status, "").toUpperCase();
    const matchTab  = tab === "ALL" || rawStatus === tab;
    const q         = search.toLowerCase();
    const student   = text(b.studentName ?? nestedName(b.student), "").toLowerCase();
    const tutor     = text(b.tutorName   ?? nestedName(b.tutor),   "").toLowerCase();
    const matchSearch = !q || student.includes(q) || tutor.includes(q);
    return matchTab && matchSearch;
  });

  return (
    <Card className="overflow-hidden">
      <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />

      <CardHeader className="border-b pb-4">
        <div className="flex flex-col gap-4">

          {/* Title + search row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
                <BookOpenCheck className="size-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">All Sessions</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {filtered.length} of {bookings.length} bookings
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search student or tutor…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl pl-9 text-sm h-9"
              />
            </div>
          </div>

          {/* Tab filters */}
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => {
              const isActive = tab === t;
              const cfg      = TAB_CFG[t];
              const Icon     = cfg.icon;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive ? cfg.active : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? cfg.countBg : "bg-background"}`}>
                    {counts[t]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-muted">
              <BookOpenCheck className="size-8 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold">No bookings found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {search ? `No results for "${search}"` : `No ${tab.toLowerCase()} bookings`}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div className="hidden border-b bg-muted/40 sm:grid sm:grid-cols-[2.2fr_2fr_1.5fr_1.2fr_0.9fr_auto] gap-4 px-5 py-3">
              {["Student", "Tutor", "Date", "Status", "Amount", ""].map((h) => (
                <p key={h} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</p>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-border/60">
              {filtered.map((booking, idx) => {
                const bookingId   = text(booking.id ?? booking._id, idx.toString());
                const studentName = text(booking.studentName ?? nestedName(booking.student), "Student");
                const tutorName   = text(booking.tutorName   ?? nestedName(booking.tutor),   "Tutor");
                const rawStatus   = text(booking.status, "CONFIRMED").toUpperCase();
                const statusCfg   = STATUS_CFG[rawStatus] ?? STATUS_CFG.CONFIRMED;
                const dateStr     = text(booking.date ?? booking.sessionDate ?? booking.createdAt);
                const formattedDate = dateStr !== "N/A"
                  ? new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "—";
                const amount = booking.price ?? booking.amount;

                return (
                  <div
                    key={bookingId}
                    className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-muted/30 sm:grid-cols-[2.2fr_2fr_1.5fr_1.2fr_0.9fr_auto] sm:items-center sm:gap-4"
                  >
                    {/* Student */}
                    <div className="flex items-center gap-3">
                      <div className={`flex size-9 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                        {studentName[0]?.toUpperCase() ?? "S"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{studentName}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Student</p>
                      </div>
                    </div>

                    {/* Tutor */}
                    <div className="flex items-center gap-2.5">
                      <div className={`flex size-7 shrink-0 items-center justify-center rounded-xl text-xs font-black ${TUTOR_AVATAR_COLORS[idx % TUTOR_AVATAR_COLORS.length]}`}>
                        {tutorName[0]?.toUpperCase() ?? "T"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-muted-foreground">{tutorName}</p>
                        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wide font-medium">Tutor</p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3.5 shrink-0 text-muted-foreground/60" />
                      <p className="text-xs text-muted-foreground">{formattedDate}</p>
                    </div>

                    {/* Status */}
                    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusCfg.bg} ${statusCfg.textColor}`}>
                      <span className={`size-1.5 rounded-full ${statusCfg.dot}`} />
                      {statusCfg.label}
                    </span>

                    {/* Amount */}
                    <div className="flex items-center gap-1">
                      <DollarSign className="size-3.5 text-emerald-500 shrink-0" />
                      <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {amount != null ? `৳${text(amount)}` : "—"}
                      </p>
                    </div>

                    {/* View */}
                    <Link
                      href={`/admin/bookings/${bookingId}`}
                      className="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    >
                      View <ArrowRight className="size-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
