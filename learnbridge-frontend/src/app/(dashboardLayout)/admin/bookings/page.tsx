import { getAdminBookings } from "@/actions/dashboard.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenCheck, CheckCircle2, TrendingUp, XCircle, Clock, Calendar, User } from "lucide-react";

const text = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const nestedName = (value: unknown) =>
  value && typeof value === "object" && "name" in value
    ? (value as { name?: unknown }).name
    : undefined;

const STATUS_CFG: Record<string, { label: string; bg: string; textColor: string; dot: string }> = {
  CONFIRMED: { label: "Confirmed", bg: "bg-blue-100 dark:bg-blue-900/30",       textColor: "text-blue-700 dark:text-blue-400",       dot: "bg-blue-500"    },
  COMPLETED: { label: "Completed", bg: "bg-emerald-100 dark:bg-emerald-900/30", textColor: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  CANCELLED: { label: "Cancelled", bg: "bg-red-100 dark:bg-red-900/30",         textColor: "text-red-700 dark:text-red-400",         dot: "bg-red-500"     },
  PENDING:   { label: "Pending",   bg: "bg-amber-100 dark:bg-amber-900/30",     textColor: "text-amber-700 dark:text-amber-400",     dot: "bg-amber-500"   },
};

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
];

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings();

  const total     = bookings.length;
  const confirmed = bookings.filter((b) => text(b.status, "").toUpperCase() === "CONFIRMED").length;
  const completed = bookings.filter((b) => text(b.status, "").toUpperCase() === "COMPLETED").length;
  const cancelled = bookings.filter((b) => text(b.status, "").toUpperCase() === "CANCELLED").length;
  const pending   = bookings.filter((b) => text(b.status, "").toUpperCase() === "PENDING").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statCards = [
    { icon: BookOpenCheck, label: "Total",     value: total,     sub: "All bookings",           iconBg: "bg-primary/10",                          iconColor: "text-primary",                         bar: "bg-primary",     barW: "100%" },
    { icon: TrendingUp,    label: "Confirmed", value: confirmed, sub: "Awaiting session",        iconBg: "bg-blue-100 dark:bg-blue-900/30",         iconColor: "text-blue-600 dark:text-blue-400",     bar: "bg-blue-500",    barW: total > 0 ? `${Math.round((confirmed / total) * 100)}%` : "0%" },
    { icon: CheckCircle2,  label: "Completed", value: completed, sub: `${completionRate}% rate`, iconBg: "bg-emerald-100 dark:bg-emerald-900/30",   iconColor: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", barW: total > 0 ? `${completionRate}%` : "0%" },
    { icon: Clock,         label: "Pending",   value: pending,   sub: "Awaiting confirmation",   iconBg: "bg-amber-100 dark:bg-amber-900/30",       iconColor: "text-amber-600 dark:text-amber-400",   bar: "bg-amber-500",   barW: total > 0 ? `${Math.round((pending / total) * 100)}%` : "0%" },
    { icon: XCircle,       label: "Cancelled", value: cancelled, sub: "Sessions cancelled",      iconBg: "bg-red-100 dark:bg-red-900/30",           iconColor: "text-red-600 dark:text-red-400",       bar: "bg-red-500",     barW: total > 0 ? `${Math.round((cancelled / total) * 100)}%` : "0%" },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">All Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review all platform session activity
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

      {/* ── Bookings Table ─────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
                <BookOpenCheck className="size-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">All Sessions</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">{total} bookings total</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-muted">
                <BookOpenCheck className="size-8 text-muted-foreground/40" />
              </div>
              <p className="font-semibold">No bookings found</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="hidden border-b bg-muted/40 sm:grid sm:grid-cols-[2fr_2fr_2fr_1.2fr_1fr] gap-4 px-5 py-3">
                {["Student", "Tutor", "Date / Time", "Status", "Amount"].map((h) => (
                  <p key={h} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</p>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-border/60">
                {bookings.map((booking, idx) => {
                  const bookingId   = text(booking.id ?? booking._id, idx.toString());
                  const studentName = text(booking.studentName ?? nestedName(booking.student), "Student");
                  const tutorName   = text(booking.tutorName ?? nestedName(booking.tutor), "Tutor");
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
                      className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-muted/30 sm:grid-cols-[2fr_2fr_2fr_1.2fr_1fr] sm:items-center sm:gap-4"
                    >
                      {/* Student */}
                      <div className="flex items-center gap-3">
                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                          {studentName[0]?.toUpperCase() ?? "S"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{studentName}</p>
                          <p className="text-xs text-muted-foreground">Student</p>
                        </div>
                      </div>

                      {/* Tutor */}
                      <div className="flex items-center gap-2">
                        <User className="size-3.5 shrink-0 text-muted-foreground" />
                        <p className="truncate text-sm text-muted-foreground">{tutorName}</p>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3.5 shrink-0 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{formattedDate}</p>
                      </div>

                      {/* Status */}
                      <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusCfg.bg} ${statusCfg.textColor}`}>
                        <span className={`size-1.5 rounded-full ${statusCfg.dot}`} />
                        {statusCfg.label}
                      </span>

                      {/* Amount */}
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {amount != null ? `৳${text(amount)}` : "—"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
