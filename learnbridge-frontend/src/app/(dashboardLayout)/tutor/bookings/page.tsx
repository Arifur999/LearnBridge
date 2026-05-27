import { tutorService } from "@/services/tutor.service";
import {
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TutorBookingsClient from "./TutorBookingsClient";

export default async function TutorBookingsPage() {
  const result = await tutorService.getMyBookings();
  const list: Record<string, unknown>[] =
    Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];

  const total     = list.length;
  const confirmed = list.filter((b) => String(b.status ?? "").toUpperCase() === "CONFIRMED").length;
  const completed = list.filter((b) => String(b.status ?? "").toUpperCase() === "COMPLETED").length;
  const pending   = list.filter((b) => String(b.status ?? "").toUpperCase() === "PENDING").length;
  const cancelled = list.filter((b) => String(b.status ?? "").toUpperCase() === "CANCELLED").length;

  const statCards = [
    { label: "Total",     value: total,     icon: Calendar,     bg: "bg-primary/10",                          color: "text-primary",                           bar: "bg-primary",     barW: "100%"  },
    { label: "Confirmed", value: confirmed, icon: AlertCircle,  bg: "bg-blue-100 dark:bg-blue-900/30",         color: "text-blue-600 dark:text-blue-400",       bar: "bg-blue-500",    barW: total > 0 ? `${Math.round((confirmed / total) * 100)}%` : "0%" },
    { label: "Completed", value: completed, icon: CheckCircle2, bg: "bg-emerald-100 dark:bg-emerald-900/30",   color: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", barW: total > 0 ? `${Math.round((completed / total) * 100)}%` : "0%" },
    { label: "Pending",   value: pending,   icon: Clock,        bg: "bg-amber-100 dark:bg-amber-900/30",       color: "text-amber-600 dark:text-amber-400",     bar: "bg-amber-500",   barW: total > 0 ? `${Math.round((pending / total) * 100)}%` : "0%"   },
    { label: "Cancelled", value: cancelled, icon: XCircle,      bg: "bg-red-100 dark:bg-red-900/30",           color: "text-red-600 dark:text-red-400",         bar: "bg-red-500",     barW: total > 0 ? `${Math.round((cancelled / total) * 100)}%` : "0%" },
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
              <div key={label} className="flex flex-col gap-3 p-5 transition-colors hover:bg-muted/40">
                <div className="flex items-start justify-between">
                  <div className={`flex size-9 items-center justify-center rounded-2xl ${bg}`}>
                    <Icon className={`size-4 ${color}`} />
                  </div>
                  <span className="text-2xl font-black tabular-nums">{value}</span>
                </div>
                <p className="text-sm font-semibold">{label}</p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${bar}`} style={{ width: barW }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Interactive List ──────────────────────────────────── */}
      <TutorBookingsClient bookings={list} />
    </div>
  );
}
