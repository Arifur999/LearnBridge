import { tutorService } from "@/services/tutor.service";
import { formatTime, formatDay } from "@/lib/utils";
import Link from "next/link";
import {
  Calendar, Clock, DollarSign, ArrowRight,
  CheckCircle2, XCircle, AlertCircle, User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string; icon: React.ElementType }> = {
  CONFIRMED: { label: "Confirmed", bg: "bg-blue-100 dark:bg-blue-900/30",     text: "text-blue-700 dark:text-blue-400",     dot: "bg-blue-500",     icon: AlertCircle   },
  COMPLETED: { label: "Completed", bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500", icon: CheckCircle2  },
  CANCELLED: { label: "Cancelled", bg: "bg-red-100 dark:bg-red-900/30",        text: "text-red-600 dark:text-red-400",         dot: "bg-red-500",     icon: XCircle       },
  PENDING:   { label: "Pending",   bg: "bg-amber-100 dark:bg-amber-900/30",    text: "text-amber-700 dark:text-amber-400",     dot: "bg-amber-500",   icon: AlertCircle   },
};

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
];

export default async function TutorBookingsPage() {
  const result = await tutorService.getMyBookings();
  const list: Record<string, unknown>[] = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];

  const total     = list.length;
  const confirmed = list.filter((b) => String(b.status ?? "").toUpperCase() === "CONFIRMED").length;
  const completed = list.filter((b) => String(b.status ?? "").toUpperCase() === "COMPLETED").length;
  const pending   = list.filter((b) => String(b.status ?? "").toUpperCase() === "PENDING").length;
  const cancelled = list.filter((b) => String(b.status ?? "").toUpperCase() === "CANCELLED").length;

  const statCards = [
    { label: "Total",     value: total,     icon: Calendar,    bg: "bg-primary/10",                          color: "text-primary",                         bar: "bg-primary",     barW: "100%" },
    { label: "Confirmed", value: confirmed, icon: AlertCircle, bg: "bg-blue-100 dark:bg-blue-900/30",         color: "text-blue-600 dark:text-blue-400",     bar: "bg-blue-500",    barW: total > 0 ? `${Math.round((confirmed / total) * 100)}%` : "0%" },
    { label: "Completed", value: completed, icon: CheckCircle2,bg: "bg-emerald-100 dark:bg-emerald-900/30",   color: "text-emerald-600 dark:text-emerald-400",bar: "bg-emerald-500", barW: total > 0 ? `${Math.round((completed / total) * 100)}%` : "0%" },
    { label: "Pending",   value: pending,   icon: Clock,       bg: "bg-amber-100 dark:bg-amber-900/30",       color: "text-amber-600 dark:text-amber-400",   bar: "bg-amber-500",   barW: total > 0 ? `${Math.round((pending / total) * 100)}%` : "0%" },
    { label: "Cancelled", value: cancelled, icon: XCircle,     bg: "bg-red-100 dark:bg-red-900/30",           color: "text-red-600 dark:text-red-400",       bar: "bg-red-500",     barW: total > 0 ? `${Math.round((cancelled / total) * 100)}%` : "0%" },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">My Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage all session bookings from your students
        </p>
      </div>

      {/* ── Stats Card ────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-primary via-blue-500 to-emerald-500" />
        <CardContent className="p-0">
          <div className="grid divide-y sm:divide-x sm:divide-y-0 sm:grid-cols-5">
            {statCards.map(({ label, value, icon: Icon, bg, color, bar, barW }) => (
              <div key={label} className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/40">
                <div className="flex items-start justify-between">
                  <div className={`flex size-8 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`size-4 ${color}`} />
                  </div>
                  <span className="text-2xl font-black tabular-nums">{value}</span>
                </div>
                <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${bar}`} style={{ width: barW }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Bookings List ─────────────────────────────────────── */}
      {list.length === 0 ? (
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-muted">
              <Calendar className="size-8 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold">No bookings yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Students will appear here once they book a session
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">All Sessions</CardTitle>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {total} total
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {list.map((b, idx) => {
                const id      = String(b?.id ?? idx);
                const student = b?.student as Record<string, unknown> | undefined;
                const avail   = b?.availability as Record<string, unknown> | undefined;
                const status  = String(b?.status ?? "PENDING").toUpperCase();
                const cfg     = STATUS_CFG[status] ?? STATUS_CFG.PENDING;
                const StatusIcon = cfg.icon;

                const studentName = String(student?.name ?? "Student");
                const dayLabel = avail?.day ? formatDay(String(avail.day)) : null;
                const timeLabel = avail?.startTime ? formatTime(String(avail.startTime)) : null;
                const price = String(b?.price ?? 0);

                return (
                  <div key={id} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/30">
                    {/* Avatar */}
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                      {studentName[0]?.toUpperCase() ?? "S"}
                    </div>

                    {/* Student Name */}
                    <div className="min-w-0 w-40 shrink-0">
                      <p className="truncate text-sm font-semibold">{studentName}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="size-3" />
                        Student
                      </div>
                    </div>

                    {/* Day / Time */}
                    <div className="hidden min-w-0 flex-1 sm:block">
                      {dayLabel || timeLabel ? (
                        <div className="flex items-center gap-1.5 text-sm">
                          <Calendar className="size-3.5 shrink-0 text-muted-foreground" />
                          <span className="font-medium">{dayLabel ?? ""}</span>
                          {timeLabel && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <Clock className="size-3.5 shrink-0 text-muted-foreground" />
                              <span className="text-muted-foreground">{timeLabel}</span>
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
                      <span className="text-sm font-semibold">${price}</span>
                    </div>

                    {/* Status */}
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                      <span className={`size-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>

                    {/* View button */}
                    <Button asChild size="sm" variant="outline" className="shrink-0 rounded-xl gap-1.5 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                      <Link href={`/tutor/bookings/${id}`}>
                        View <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
