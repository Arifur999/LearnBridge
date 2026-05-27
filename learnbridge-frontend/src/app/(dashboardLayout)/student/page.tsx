import Link from "next/link";
import {
  CalendarCheck, Search, CheckCircle2, TrendingUp,
  ArrowRight, Clock, XCircle, BookOpen, Sparkles,
} from "lucide-react";
import { getMyBookings } from "@/actions/dashboard.action";
import { getCurrentUserFromServer } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const text = (v: unknown, fb = "N/A") =>
  typeof v === "string" || typeof v === "number" ? String(v) : fb;

const nestedName = (v: unknown) =>
  v && typeof v === "object" && "name" in v
    ? (v as { name?: unknown }).name
    : undefined;

const STATUS_CFG: Record<string, { label: string; bg: string; textColor: string; dot: string }> = {
  CONFIRMED: { label: "Confirmed", bg: "bg-blue-100 dark:bg-blue-900/30",       textColor: "text-blue-700 dark:text-blue-400",       dot: "bg-blue-500"             },
  COMPLETED: { label: "Completed", bg: "bg-emerald-100 dark:bg-emerald-900/30", textColor: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500 animate-pulse" },
  CANCELLED: { label: "Cancelled", bg: "bg-red-100 dark:bg-red-900/30",         textColor: "text-red-700 dark:text-red-400",         dot: "bg-red-500"              },
  PENDING:   { label: "Pending",   bg: "bg-amber-100 dark:bg-amber-900/30",     textColor: "text-amber-700 dark:text-amber-400",     dot: "bg-amber-500"            },
};

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
];

export default async function StudentDashboardPage() {
  const [user, bookings] = await Promise.all([
    getCurrentUserFromServer(),
    getMyBookings(),
  ]);

  const total     = bookings.length;
  const confirmed = bookings.filter((b) => text(b.status, "").toUpperCase() === "CONFIRMED").length;
  const completed = bookings.filter((b) => text(b.status, "").toUpperCase() === "COMPLETED").length;
  const cancelled = bookings.filter((b) => text(b.status, "").toUpperCase() === "CANCELLED").length;
  const pending   = bookings.filter((b) => text(b.status, "").toUpperCase() === "PENDING").length;

  const statCards = [
    { icon: CalendarCheck, label: "Total Bookings", value: total,     sub: "All sessions",           iconBg: "bg-primary/10",                          iconColor: "text-primary",                           bar: "bg-primary",     barW: "100%" },
    { icon: TrendingUp,    label: "Confirmed",      value: confirmed, sub: "Upcoming sessions",      iconBg: "bg-blue-100 dark:bg-blue-900/30",         iconColor: "text-blue-600 dark:text-blue-400",       bar: "bg-blue-500",    barW: total > 0 ? `${Math.round((confirmed / total) * 100)}%` : "0%" },
    { icon: CheckCircle2,  label: "Completed",      value: completed, sub: "Finished sessions",      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",   iconColor: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", barW: total > 0 ? `${Math.round((completed / total) * 100)}%` : "0%" },
    { icon: Clock,         label: "Pending",        value: pending,   sub: "Awaiting confirmation",  iconBg: "bg-amber-100 dark:bg-amber-900/30",       iconColor: "text-amber-600 dark:text-amber-400",     bar: "bg-amber-500",   barW: total > 0 ? `${Math.round((pending / total) * 100)}%` : "0%" },
    { icon: XCircle,       label: "Cancelled",      value: cancelled, sub: "Cancelled sessions",     iconBg: "bg-red-100 dark:bg-red-900/30",           iconColor: "text-red-600 dark:text-red-400",         bar: "bg-red-500",     barW: total > 0 ? `${Math.round((cancelled / total) * 100)}%` : "0%" },
  ];

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-6">

      {/* ── Welcome Banner ─────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="relative bg-linear-to-br from-primary via-violet-600 to-indigo-700 p-6 text-white">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 size-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-4 right-16 size-20 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="size-4 text-white/70" />
                <p className="text-sm font-medium text-white/70">Welcome back</p>
              </div>
              <h1 className="text-2xl font-black tracking-tight">
                {user?.name ?? "Student"} 👋
              </h1>
              <p className="mt-1 text-sm text-white/70">
                {total > 0
                  ? `You have ${confirmed} upcoming session${confirmed !== 1 ? "s" : ""} — keep it up!`
                  : "Ready to start learning? Book your first session today."
                }
              </p>
            </div>
            <Button asChild variant="secondary" className="w-fit gap-2 rounded-xl font-semibold">
              <Link href="/tutors">
                <Search className="size-4" /> Browse Tutors
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Stats Card ─────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-primary via-violet-500 to-emerald-500" />
        <CardContent className="p-0">
          <div className="grid divide-y sm:divide-x sm:divide-y-0 sm:grid-cols-5">
            {statCards.map(({ icon: Icon, label, value, sub, iconBg, iconColor, bar, barW }) => (
              <div key={label} className="flex flex-col gap-3 p-5 transition-colors hover:bg-muted/40">
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
                  <div className={`h-full rounded-full ${bar}`} style={{ width: barW }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Bottom Grid ────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">

        {/* Recent Bookings */}
        <Card className="overflow-hidden">
          <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
                  <CalendarCheck className="size-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Recent Bookings</CardTitle>
                  <p className="mt-0.5 text-xs text-muted-foreground">Your latest sessions</p>
                </div>
              </div>
              <Link href="/student/bookings" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="size-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentBookings.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex size-14 items-center justify-center rounded-3xl bg-muted">
                  <CalendarCheck className="size-7 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="font-semibold text-sm">No bookings yet</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Browse tutors to book your first session</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentBookings.map((b, idx) => {
                  const bookingId  = text(b.id ?? b._id, idx.toString());
                  const tutorName  = text(b.tutorName ?? nestedName(b.tutor), "Tutor session");
                  const rawStatus  = text(b.status, "CONFIRMED").toUpperCase();
                  const statusCfg  = STATUS_CFG[rawStatus] ?? STATUS_CFG.CONFIRMED;
                  const dateStr    = text(b.date ?? b.sessionDate ?? b.createdAt);
                  const dateLabel  = dateStr !== "N/A"
                    ? new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : "—";

                  return (
                    <div key={bookingId} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/30">
                      <div className={`flex size-9 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                        {tutorName[0]?.toUpperCase() ?? "T"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{tutorName}</p>
                        <p className="text-xs text-muted-foreground">{dateLabel}</p>
                      </div>
                      <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusCfg.bg} ${statusCfg.textColor}`}>
                        <span className={`size-1.5 rounded-full ${statusCfg.dot}`} />
                        {statusCfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="overflow-hidden">
          <div className="h-[3px] w-full bg-linear-to-r from-emerald-500 to-cyan-500" />
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">Jump to what you need</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 p-5">
            {[
              { href: "/tutors",           label: "Browse Tutors",   icon: Search,        desc: "Find the perfect tutor",          bg: "bg-primary/10",                        color: "text-primary"                          },
              { href: "/student/bookings", label: "My Bookings",     icon: CalendarCheck, desc: "View all your sessions",          bg: "bg-blue-100 dark:bg-blue-900/30",      color: "text-blue-600 dark:text-blue-400"      },
              { href: "/student/courses",  label: "My Sessions",     icon: BookOpen,      desc: "Track tutors you've booked",      bg: "bg-violet-100 dark:bg-violet-900/30",  color: "text-violet-600 dark:text-violet-400"  },
              { href: "/student/profile",  label: "My Profile",      icon: CheckCircle2,  desc: "Update your account info",        bg: "bg-emerald-100 dark:bg-emerald-900/30",color: "text-emerald-600 dark:text-emerald-400"},
            ].map(({ href, label, icon: Icon, desc, bg, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-2xl border p-3.5 transition-all hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm group"
              >
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`size-4 ${color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary shrink-0" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
