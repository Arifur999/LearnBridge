"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar, Clock, DollarSign, ArrowRight, Search,
  CheckCircle2, XCircle, AlertCircle, User, Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime, formatDay } from "@/lib/utils";

interface Booking {
  id: string;
  studentName: string;
  dayLabel: string | null;
  timeLabel: string | null;
  price: string;
  status: string;
}

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string; icon: React.ElementType }> = {
  CONFIRMED: { label: "Confirmed", bg: "bg-blue-100 dark:bg-blue-900/30",       text: "text-blue-700 dark:text-blue-400",       dot: "bg-blue-500",     icon: AlertCircle  },
  COMPLETED: { label: "Completed", bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500",  icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", bg: "bg-red-100 dark:bg-red-900/30",         text: "text-red-600 dark:text-red-400",         dot: "bg-red-500",      icon: XCircle      },
  PENDING:   { label: "Pending",   bg: "bg-amber-100 dark:bg-amber-900/30",     text: "text-amber-700 dark:text-amber-400",     dot: "bg-amber-500",    icon: AlertCircle  },
};

const TAB_CFG: Record<string, { label: string; active: string; count: string }> = {
  ALL:       { label: "All",       active: "bg-primary text-primary-foreground",                                         count: "bg-white/20"                          },
  CONFIRMED: { label: "Confirmed", active: "bg-blue-600 text-white",                                                     count: "bg-white/20"                          },
  COMPLETED: { label: "Completed", active: "bg-emerald-600 text-white",                                                  count: "bg-white/20"                          },
  PENDING:   { label: "Pending",   active: "bg-amber-500 text-white",                                                    count: "bg-white/20"                          },
  CANCELLED: { label: "Cancelled", active: "bg-red-600 text-white",                                                      count: "bg-white/20"                          },
};

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
];

export default function TutorBookingsClient({ bookings: raw }: { bookings: Record<string, unknown>[] }) {
  const [tab, setTab]       = useState("ALL");
  const [search, setSearch] = useState("");

  /* Normalise raw list once */
  const bookings: Booking[] = raw.map((b, i) => {
    const avail       = b?.availability as Record<string, unknown> | undefined;
    const student     = b?.student     as Record<string, unknown> | undefined;
    const studentName = String(student?.name ?? "Student");
    return {
      id:          String(b?.id ?? i),
      studentName,
      dayLabel:    avail?.day       ? formatDay(String(avail.day))             : null,
      timeLabel:   avail?.startTime ? formatTime(String(avail.startTime))      : null,
      price:       String(b?.price ?? 0),
      status:      String(b?.status ?? "PENDING").toUpperCase(),
    };
  });

  const counts: Record<string, number> = { ALL: bookings.length };
  for (const k of Object.keys(STATUS_CFG)) {
    counts[k] = bookings.filter((b) => b.status === k).length;
  }

  const filtered = bookings.filter((b) => {
    const matchTab    = tab === "ALL" || b.status === tab;
    const q           = search.toLowerCase().trim();
    const matchSearch = !q || b.studentName.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  return (
    <Card className="overflow-hidden">
      <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />

      <CardHeader className="border-b pb-4">
        <div className="flex flex-col gap-4">

          {/* Title + search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
                <Calendar className="size-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">All Sessions</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {filtered.length} of {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl pl-9 text-sm h-9"
              />
            </div>
          </div>

          {/* Tab pills */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(TAB_CFG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  tab === key
                    ? cfg.active
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {key !== "ALL" && (
                  <span className={`size-1.5 rounded-full ${tab === key ? "bg-white/70" : STATUS_CFG[key]?.dot}`} />
                )}
                {key === "ALL" && <Filter className="size-3" />}
                {cfg.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === key ? cfg.count : "bg-background"}`}>
                  {counts[key] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-muted">
              <Calendar className="size-8 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold">
                {search ? `No results for "${search}"` : tab === "ALL" ? "No bookings yet" : `No ${TAB_CFG[tab]?.label} bookings`}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {search ? "Try a different name" : "Students will appear here once they book"}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filtered.map((b, idx) => {
              const cfg        = STATUS_CFG[b.status] ?? STATUS_CFG.PENDING;

              return (
                <div key={b.id} className="flex flex-wrap items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/30 sm:flex-nowrap">

                  {/* Avatar */}
                  <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                    {b.studentName[0]?.toUpperCase() ?? "S"}
                  </div>

                  {/* Student name */}
                  <div className="min-w-0 w-36 shrink-0">
                    <p className="truncate text-sm font-semibold">{b.studentName}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="size-3" /> Student
                    </div>
                  </div>

                  {/* Day / Time */}
                  <div className="hidden min-w-0 flex-1 sm:block">
                    {b.dayLabel || b.timeLabel ? (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="font-medium">{b.dayLabel ?? ""}</span>
                        {b.timeLabel && (
                          <>
                            <span className="text-muted-foreground">·</span>
                            <Clock className="size-3.5 shrink-0 text-muted-foreground" />
                            <span className="text-muted-foreground">{b.timeLabel}</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="hidden items-center gap-1.5 sm:flex">
                    <div className="flex size-7 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                      <DollarSign className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">৳{b.price}</span>
                  </div>

                  {/* Status badge */}
                  <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                    <span className={`size-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>

                  {/* View button */}
                  <Button asChild size="sm" variant="outline" className="ml-auto shrink-0 rounded-xl gap-1.5 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                    <Link href={`/tutor/bookings/${b.id}`}>
                      View <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
