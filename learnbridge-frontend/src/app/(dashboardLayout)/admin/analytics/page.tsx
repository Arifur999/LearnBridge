import { getAdminBookings, getAdminUsers, getCategories } from "@/actions/dashboard.action";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users, BookOpen, CheckCircle2,
  TrendingUp, XCircle, Clock, LayoutGrid,
} from "lucide-react";
import AdminAnalyticsCharts from "./AdminAnalyticsCharts";

export default async function AdminAnalyticsPage() {
  const [users, bookings, categories] = await Promise.all([
    getAdminUsers(),
    getAdminBookings(),
    getCategories(),
  ]);

  const completed = bookings.filter((b) => String(b?.status ?? "").toUpperCase() === "COMPLETED").length;
  const confirmed = bookings.filter((b) => String(b?.status ?? "").toUpperCase() === "CONFIRMED").length;
  const cancelled = bookings.filter((b) => String(b?.status ?? "").toUpperCase() === "CANCELLED").length;
  const pending   = bookings.filter((b) => String(b?.status ?? "").toUpperCase() === "PENDING").length;

  const students = users.filter((u) => String(u?.role ?? "").toLowerCase() === "student").length;
  const tutors   = users.filter((u) => { const r = String(u?.role ?? "").toLowerCase(); return r === "tutor" || r === "trainer"; }).length;
  const others   = users.length - students - tutors;

  const completionRate = bookings.length > 0 ? Math.round((completed / bookings.length) * 100) : 0;

  const statCards = [
    {
      icon: Users,
      label: "Total Users",
      value: users.length,
      sub: `${students} students · ${tutors} tutors`,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      bar: "bg-primary",
      barW: "100%",
    },
    {
      icon: BookOpen,
      label: "Total Bookings",
      value: bookings.length,
      sub: "All time",
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
      bar: "bg-violet-500",
      barW: "100%",
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
      label: "Confirmed",
      value: confirmed,
      sub: "Awaiting session",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      bar: "bg-blue-500",
      barW: bookings.length > 0 ? `${Math.round((confirmed / bookings.length) * 100)}%` : "0%",
    },
    {
      icon: XCircle,
      label: "Cancelled",
      value: cancelled,
      sub: "Sessions cancelled",
      iconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      bar: "bg-red-500",
      barW: bookings.length > 0 ? `${Math.round((cancelled / bookings.length) * 100)}%` : "0%",
    },
    {
      icon: Clock,
      label: "Pending",
      value: pending,
      sub: "Awaiting confirmation",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      bar: "bg-amber-500",
      barW: bookings.length > 0 ? `${Math.round((pending / bookings.length) * 100)}%` : "0%",
    },
    {
      icon: LayoutGrid,
      label: "Categories",
      value: categories.length,
      sub: "Subject categories",
      iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      bar: "bg-cyan-500",
      barW: "100%",
    },
    {
      icon: Users,
      label: "Tutors",
      value: tutors,
      sub: `${users.length > 0 ? Math.round((tutors / users.length) * 100) : 0}% of users`,
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      bar: "bg-indigo-500",
      barW: users.length > 0 ? `${Math.round((tutors / users.length) * 100)}%` : "0%",
    },
  ];

  const chartBookings = bookings.map((b) => ({
    createdAt: String(b.createdAt ?? b.date ?? ""),
    status:    String(b.status ?? ""),
  }));

  const chartUsers = users.map((u) => ({ role: String(u.role ?? "") }));

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide statistics and insights
        </p>
      </div>

      {/* ── Stats Card ─────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-primary via-violet-500 to-emerald-500" />
        <CardContent className="p-0">
          <div className="grid divide-y sm:divide-x sm:divide-y-0 sm:grid-cols-4 lg:grid-cols-8">
            {statCards.map(({ icon: Icon, label, value, sub, iconBg, iconColor, bar, barW }) => (
              <div key={label} className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/40">
                <div className="flex items-start justify-between">
                  <div className={`flex size-9 items-center justify-center rounded-2xl ${iconBg}`}>
                    <Icon className={`size-4 ${iconColor}`} />
                  </div>
                  <span className="text-2xl font-black tabular-nums">{value}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{sub}</p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${bar}`} style={{ width: barW }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Charts ─────────────────────────────────────────────── */}
      <AdminAnalyticsCharts
        bookings={chartBookings}
        users={chartUsers}
        completed={completed}
        confirmed={confirmed}
        cancelled={cancelled}
        pending={pending}
        students={students}
        tutors={tutors}
        others={others}
      />
    </div>
  );
}
