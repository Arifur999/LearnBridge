import Link from "next/link";
import { getCurrentUserFromServer } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStudentDashboard, getMyBookings } from "@/actions/dashboard.action";
import {
  CalendarDays,
  BookOpen,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashPageHeader from "@/components/layout/DashPageHeader";
import { formatDate, formatTime } from "@/lib/utils";
import StudentBookingChart from "./StudentBookingChart";

export default async function StudentDashboardPage() {
  const user = await getCurrentUserFromServer();
  if (!user) redirect("/login");

  const [stats, bookings] = await Promise.all([
    getStudentDashboard(),
    getMyBookings(),
  ]);

  const allBookings = Array.isArray(bookings) ? bookings : [];
  const recent = allBookings.slice(0, 5);
  const totalBookings = allBookings.length;
  const completed = allBookings.filter(
    (b) => String(b?.status ?? "").toUpperCase() === "COMPLETED"
  ).length;
  const upcoming = allBookings.filter((b) => {
    const s = String(b?.status ?? "").toUpperCase();
    return s === "CONFIRMED" || s === "PENDING";
  }).length;

  const completionRate =
    totalBookings > 0 ? Math.round((completed / totalBookings) * 100) : 0;

  const statItems = [
    {
      icon: CalendarDays,
      label: "Total Bookings",
      value: totalBookings,
      iconBg: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary",
      barColor: "bg-primary",
      barWidth: "100%",
      suffix: "all time",
    },
    {
      icon: BookOpen,
      label: "Completed Sessions",
      value: completed,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      barColor: "bg-emerald-500",
      barWidth: totalBookings > 0 ? `${completionRate}%` : "0%",
      suffix: `${completionRate}% completion`,
    },
    {
      icon: Clock,
      label: "Upcoming Sessions",
      value: upcoming,
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
      barColor: "bg-violet-500",
      barWidth:
        totalBookings > 0
          ? `${Math.round((upcoming / totalBookings) * 100)}%`
          : "0%",
      suffix: "confirmed & pending",
    },
  ];

  return (
    <div className="space-y-8">
      <DashPageHeader
        title={`Welcome back, ${user.name ?? "Student"} `}
        description="Here's an overview of your learning activity."
      />

      {/* ── Combined Stats Card ───────────────────────────────────── */}
      <Card className="overflow-hidden">
        {/* Subtle gradient header strip */}
        <div className="h-1 w-full bg-linear-to-r from-primary via-violet-500 to-emerald-500" />

        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Session Overview
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your complete booking summary
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <TrendingUp className="size-3.5" />
              {completionRate}% rate
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid divide-y sm:divide-x sm:divide-y-0 sm:grid-cols-3">
            {statItems.map(
              ({ icon: Icon, label, value, iconBg, iconColor, barColor, barWidth, suffix }) => (
                <Link
                  key={label}
                  href="/dashboard/bookings"
                  className="group flex flex-col gap-4 p-6 transition-colors hover:bg-muted/40"
                >
                  {/* Top row: icon + value */}
                  <div className="flex items-start justify-between">
                    <div className={`flex size-10 items-center justify-center rounded-2xl ${iconBg}`}>
                      <Icon className={`size-5 ${iconColor}`} />
                    </div>
                    <span className="text-3xl font-black tabular-nums tracking-tight">
                      {value}
                    </span>
                  </div>

                  {/* Label */}
                  <div>
                    <p className="text-sm font-semibold leading-none">
                      {label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{suffix}</p>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: barWidth }}
                    />
                  </div>
                </Link>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Booking Activity Chart ────────────────────────────────── */}
      <StudentBookingChart
        bookings={allBookings.map((b) => ({
          createdAt: String(b?.createdAt ?? ""),
          status: String(b?.status ?? ""),
        }))}
      />

      {/* ── Recent Bookings ───────────────────────────────────────── */}
      <Card className="overflow-hidden">
        {/* accent bar */}
        <div className="h-[3px] w-full bg-linear-to-r from-primary via-violet-500 to-emerald-500" />

        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle className="text-base font-semibold">Recent Bookings</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">Your last {recent.length} sessions</p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
            <Link href="/dashboard/bookings">
              View all <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {recent.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted">
                <CalendarDays className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No bookings yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Start by finding a tutor</p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/tutors">Browse Tutors</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {recent.map((b, i) => {
                const id = String(b?.id ?? b?._id ?? i);
                const tutor = b?.tutor;
                const tutorName =
                  typeof tutor === "object" && tutor
                    ? String(
                        (tutor as Record<string, unknown>)?.user
                          ? ((tutor as Record<string, unknown>).user as Record<string, unknown>)?.name
                          : (tutor as Record<string, unknown>)?.name ?? "Tutor"
                      )
                    : String(b?.tutorName ?? "Tutor");

                const status = String(b?.status ?? "PENDING").toUpperCase();

                const statusCfg =
                  status === "COMPLETED"  ? { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" }
                  : status === "CANCELLED" ? { bg: "bg-red-100 dark:bg-red-900/30",     text: "text-red-600 dark:text-red-400",       dot: "bg-red-500"     }
                  : status === "CONFIRMED" ? { bg: "bg-primary/10",                      text: "text-primary",                          dot: "bg-primary"     }
                  :                          { bg: "bg-amber-100 dark:bg-amber-900/30",  text: "text-amber-700 dark:text-amber-400",    dot: "bg-amber-500"   };

                const avail = b?.availability as Record<string, unknown> | undefined;
                const day   = avail?.day       ? String(avail.day) : "";
                const start = avail?.startTime ? formatTime(String(avail.startTime)) : "";
                const end   = avail?.endTime   ? formatTime(String(avail.endTime))   : "";
                const timeLabel =
                  day && start
                    ? `${day} • ${start}${end ? ` – ${end}` : ""}`
                    : formatDate(String(b?.createdAt ?? ""));

                /* avatar colour cycles through a small palette */
                const avatarColors = [
                  "bg-primary/15 text-primary",
                  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
                  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
                ];
                const avatarColor = avatarColors[i % avatarColors.length];

                return (
                  <div
                    key={id}
                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/40"
                  >
                    {/* Avatar */}
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${avatarColor}`}>
                      {tutorName[0]?.toUpperCase() ?? "T"}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{tutorName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{timeLabel}</p>
                    </div>

                    {/* Status badge */}
                    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                      <span className={`size-1.5 rounded-full ${statusCfg.dot}`} />
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
