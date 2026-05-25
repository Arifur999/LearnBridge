import Link from "next/link";
import {
  Calendar, UserRoundCheck, CheckCircle2,
  PlusCircle, ArrowRight, Clock, Star,
  TrendingUp, Zap, BookOpen,
} from "lucide-react";
import { getTutorBookings, getTutorSlotsAction } from "@/actions/dashboard.action";
import CompleteBookingButton from "./CompleteBookingButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUserFromServer } from "@/lib/auth";
import TutorChart from "./TutorChart";

const text = (v: unknown, fallback = "N/A") =>
  typeof v === "string" || typeof v === "number" ? String(v) : fallback;

const nestedName = (v: unknown) =>
  v && typeof v === "object" && "name" in v
    ? (v as { name?: unknown }).name
    : undefined;

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  CONFIRMED: { label: "Confirmed", bg: "bg-primary/10",                      text: "text-primary",                          dot: "bg-primary"     },
  COMPLETED: { label: "Completed", bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  CANCELLED: { label: "Cancelled", bg: "bg-red-100 dark:bg-red-900/30",       text: "text-red-600 dark:text-red-400",         dot: "bg-red-500"     },
  PENDING:   { label: "Pending",   bg: "bg-amber-100 dark:bg-amber-900/30",   text: "text-amber-700 dark:text-amber-400",     dot: "bg-amber-500"   },
};

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
];

export default async function TutorDashboardPage() {
  const [user, bookings, slots] = await Promise.all([
    getCurrentUserFromServer(),
    getTutorBookings(),
    getTutorSlotsAction(),
  ]);

  const confirmed     = bookings.filter((b) => String(b.status ?? "").toUpperCase() === "CONFIRMED").length;
  const completed     = bookings.filter((b) => String(b.status ?? "").toUpperCase() === "COMPLETED").length;
  const cancelled     = bookings.filter((b) => String(b.status ?? "").toUpperCase() === "CANCELLED").length;
  const availableSlots = (slots as Array<{ isBooked?: boolean }>).filter((s) => !s.isBooked).length;
  const completionRate = bookings.length > 0 ? Math.round((completed / bookings.length) * 100) : 0;

  const statCards = [
    {
      icon: Calendar,
      label: "Total Sessions",
      value: bookings.length,
      sub: "All bookings",
      iconBg: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary",
      bar: "bg-primary",
      barW: "100%",
    },
    {
      icon: UserRoundCheck,
      label: "Confirmed",
      value: confirmed,
      sub: "Awaiting session",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      bar: "bg-blue-500",
      barW: bookings.length > 0 ? `${Math.round((confirmed / bookings.length) * 100)}%` : "0%",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: completed,
      sub: `${completionRate}% completion rate`,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bar: "bg-emerald-500",
      barW: bookings.length > 0 ? `${completionRate}%` : "0%",
    },
    {
      icon: TrendingUp,
      label: "Open Slots",
      value: availableSlots,
      sub: "Open for booking",
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
      bar: "bg-violet-500",
      barW: (slots as unknown[]).length > 0 ? `${Math.round((availableSlots / (slots as unknown[]).length) * 100)}%` : "0%",
    },
  ];

  const chartBookings = bookings.map((b) => ({
    createdAt: String(b.createdAt ?? b.date ?? ""),
    status: String(b.status ?? ""),
  }));

  return (
    <div className="space-y-8">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Tutor Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back, <span className="font-bold text-foreground">{user?.name ?? "Tutor"}</span>. Here's your teaching overview.
          </p>
        </div>
        <Button asChild className="hidden gap-2 rounded-xl sm:flex">
          <Link href="/tutor/availability">
            <PlusCircle className="size-4" /> Add Slot
          </Link>
        </Button>
      </div>

      {/* ── Combined Stats Card ─────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-primary via-blue-500 to-emerald-500" />
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Session Overview</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">Your complete teaching summary</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Star className="size-3.5" />
              {completionRate}% rate
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid divide-y sm:divide-x sm:divide-y-0 sm:grid-cols-4">
            {statCards.map(({ icon: Icon, label, value, sub, iconBg, iconColor, bar, barW }) => (
              <div key={label} className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/40">
                <div className="flex items-start justify-between">
                  <div className={`flex size-9 items-center justify-center rounded-2xl ${iconBg}`}>
                    <Icon className={`size-4 ${iconColor}`} />
                  </div>
                  <span className="text-2xl font-black tabular-nums">{value}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full transition-all duration-700 ${bar}`} style={{ width: barW }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Chart ───────────────────────────────────────────────── */}
      <TutorChart bookings={chartBookings} />

      {/* ── Bottom grid ─────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">

        {/* Quick Actions */}
        <Card className="overflow-hidden">
          <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
                <Zap className="size-4 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-5">
            <Link
              href="/tutor/availability"
              className="flex items-center justify-between rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <span className="flex items-center gap-2">
                <PlusCircle className="size-4" /> Add Availability
              </span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/tutor/profile"
              className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <UserRoundCheck className="size-4 text-violet-500" /> Edit Profile
              </span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>

            <Link
              href="/tutor/bookings"
              className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="size-4 text-emerald-500" /> View All Bookings
              </span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>

            {/* Slot availability status */}
            <div className="mt-2 flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
              <div className={`size-2.5 rounded-full ${availableSlots > 0 ? "bg-emerald-500" : "bg-amber-500"}`} />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{availableSlots}</span>{" "}
                slot{availableSlots !== 1 ? "s" : ""} open for booking
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card className="overflow-hidden">
          <div className="h-[3px] w-full bg-linear-to-r from-emerald-500 to-cyan-500" />
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <Clock className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Recent Sessions</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">Latest {Math.min(bookings.length, 5)} bookings</p>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="rounded-xl text-xs">
              <Link href="/tutor/bookings">View all <ArrowRight className="ml-1 size-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
                  <Calendar className="size-6 text-muted-foreground/50" />
                </div>
                <div>
                  <p className="text-sm font-medium">No sessions yet</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Add availability so students can book</p>
                </div>
                <Button asChild size="sm" className="mt-1 rounded-xl">
                  <Link href="/tutor/availability"><PlusCircle className="mr-1.5 size-3.5" /> Add Slots</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {bookings.slice(0, 5).map((b, idx) => {
                  const bookingId  = text(b.id ?? b._id, idx.toString());
                  const studentName = text(b.studentName ?? nestedName(b.student), "Student");
                  const statusStr  = text(b.status, "CONFIRMED").toUpperCase();
                  const cfg = STATUS_CFG[statusStr] ?? { label: statusStr, bg: "bg-muted", text: "text-muted-foreground", dot: "bg-border" };
                  const isConfirmed = statusStr === "CONFIRMED";
                  const timeLabel = text(b.date ?? b.sessionDate) !== "N/A"
                    ? text(b.date ?? b.sessionDate) + (text(b.startTime) !== "N/A" ? ` • ${text(b.startTime)}` : "")
                    : "N/A";

                  return (
                    <div key={bookingId} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/40">
                      {/* Avatar */}
                      <div className={`flex size-9 shrink-0 items-center justify-center rounded-2xl text-xs font-black ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                        {studentName[0]?.toUpperCase() ?? "S"}
                      </div>
                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{studentName}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          {timeLabel}
                        </div>
                      </div>
                      {/* Status + action */}
                      <div className="flex shrink-0 items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                          <span className={`size-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                        {isConfirmed && <CompleteBookingButton bookingId={bookingId} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
