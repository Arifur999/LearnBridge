import { getAdminBookings } from "@/actions/dashboard.action";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpenCheck, CheckCircle2, TrendingUp, XCircle, Clock } from "lucide-react";
import AdminBookingsClient from "./AdminBookingsClient";

const text = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings();

  const total          = bookings.length;
  const confirmed      = bookings.filter((b) => text(b.status).toUpperCase() === "CONFIRMED").length;
  const completed      = bookings.filter((b) => text(b.status).toUpperCase() === "COMPLETED").length;
  const cancelled      = bookings.filter((b) => text(b.status).toUpperCase() === "CANCELLED").length;
  const pending        = bookings.filter((b) => text(b.status).toUpperCase() === "PENDING").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const totalRevenue   = bookings.reduce((s, b) => s + Number(b.price ?? b.amount ?? 0), 0);

  const statCards = [
    {
      icon: BookOpenCheck, label: "Total",      value: total,
      sub: `৳${totalRevenue.toFixed(0)} revenue`,
      iconBg: "bg-primary/10",                         iconColor: "text-primary",
      bar: "bg-primary",     barW: "100%",
    },
    {
      icon: TrendingUp,    label: "Confirmed",  value: confirmed,
      sub: "Awaiting session",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",        iconColor: "text-blue-600 dark:text-blue-400",
      bar: "bg-blue-500",    barW: total > 0 ? `${Math.round((confirmed / total) * 100)}%` : "0%",
    },
    {
      icon: CheckCircle2,  label: "Completed",  value: completed,
      sub: `${completionRate}% completion rate`,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",  iconColor: "text-emerald-600 dark:text-emerald-400",
      bar: "bg-emerald-500", barW: total > 0 ? `${completionRate}%` : "0%",
    },
    {
      icon: Clock,         label: "Pending",    value: pending,
      sub: "Awaiting confirmation",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",      iconColor: "text-amber-600 dark:text-amber-400",
      bar: "bg-amber-500",   barW: total > 0 ? `${Math.round((pending / total) * 100)}%` : "0%",
    },
    {
      icon: XCircle,       label: "Cancelled",  value: cancelled,
      sub: "Sessions cancelled",
      iconBg: "bg-red-100 dark:bg-red-900/30",          iconColor: "text-red-600 dark:text-red-400",
      bar: "bg-red-500",     barW: total > 0 ? `${Math.round((cancelled / total) * 100)}%` : "0%",
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">All Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and filter all platform session activity
        </p>
      </div>

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

      {/* ── Bookings List ──────────────────────────────────────── */}
      <AdminBookingsClient bookings={bookings as Record<string, unknown>[]} />
    </div>
  );
}
