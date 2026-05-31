import Link from "next/link";
import { getMyBookings } from "@/actions/dashboard.action";
import {
  CalendarCheck, CheckCircle2, TrendingUp, XCircle,
  Clock, Plus, Calendar, GraduationCap, DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CancelBookingButton from "@/components/cancel-booking-button";
import ReviewForm from "@/components/review-form";

const text = (v: unknown, fb = "N/A") =>
  typeof v === "string" || typeof v === "number" ? String(v) : fb;

const nestedName = (v: unknown) =>
  v && typeof v === "object" && "name" in v
    ? (v as { name?: unknown }).name : undefined;

const nestedId = (v: unknown) =>
  v && typeof v === "object" && "id" in v
    ? (v as { id?: unknown }).id : undefined;

const STATUS_CFG: Record<string, { label: string; bg: string; textColor: string; dot: string }> = {
  CONFIRMED: { label: "Confirmed", bg: "bg-blue-100 dark:bg-blue-900/30",       textColor: "text-blue-700 dark:text-blue-400",       dot: "bg-blue-500"              },
  COMPLETED: { label: "Completed", bg: "bg-emerald-100 dark:bg-emerald-900/30", textColor: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500 animate-pulse" },
  CANCELLED: { label: "Cancelled", bg: "bg-red-100 dark:bg-red-900/30",         textColor: "text-red-700 dark:text-red-400",         dot: "bg-red-500"               },
  PENDING:   { label: "Pending",   bg: "bg-amber-100 dark:bg-amber-900/30",     textColor: "text-amber-700 dark:text-amber-400",     dot: "bg-amber-500"             },
};

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
];

export default async function StudentBookingsPage() {
  const bookings = await getMyBookings();

  const total     = bookings.length;
  const confirmed = bookings.filter((b) => text(b.status, "").toUpperCase() === "CONFIRMED").length;
  const completed = bookings.filter((b) => text(b.status, "").toUpperCase() === "COMPLETED").length;
  const cancelled = bookings.filter((b) => text(b.status, "").toUpperCase() === "CANCELLED").length;
  const pending   = bookings.filter((b) => text(b.status, "").toUpperCase() === "PENDING").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statCards = [
    { icon: CalendarCheck, label: "Total",     value: total,     sub: "All bookings",          iconBg: "bg-primary/10",                          iconColor: "text-primary",                           bar: "bg-primary",     barW: "100%" },
    { icon: TrendingUp,    label: "Confirmed", value: confirmed, sub: "Upcoming sessions",     iconBg: "bg-blue-100 dark:bg-blue-900/30",         iconColor: "text-blue-600 dark:text-blue-400",       bar: "bg-blue-500",    barW: total > 0 ? `${Math.round((confirmed / total) * 100)}%` : "0%" },
    { icon: CheckCircle2,  label: "Completed", value: completed, sub: `${completionRate}% rate`, iconBg: "bg-emerald-100 dark:bg-emerald-900/30", iconColor: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", barW: total > 0 ? `${completionRate}%` : "0%" },
    { icon: Clock,         label: "Pending",   value: pending,   sub: "Awaiting confirm",      iconBg: "bg-amber-100 dark:bg-amber-900/30",       iconColor: "text-amber-600 dark:text-amber-400",     bar: "bg-amber-500",   barW: total > 0 ? `${Math.round((pending / total) * 100)}%` : "0%" },
    { icon: XCircle,       label: "Cancelled", value: cancelled, sub: "Cancelled sessions",    iconBg: "bg-red-100 dark:bg-red-900/30",           iconColor: "text-red-600 dark:text-red-400",         bar: "bg-red-500",     barW: total > 0 ? `${Math.round((cancelled / total) * 100)}%` : "0%" },
  ];

  return (
    <div className="space-y-6">

      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">My Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track all your upcoming and past tutor sessions
          </p>
        </div>
        <Button asChild className="w-fit gap-2 rounded-xl">
          <Link href="/tutors">
            <Plus className="size-4" /> Book New Session
          </Link>
        </Button>
      </div>

      
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

      
      <Card className="overflow-hidden">
        <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />
        <CardHeader className="border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
              <CalendarCheck className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">All Sessions</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">{total} total booking{total !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-muted">
                <CalendarCheck className="size-8 text-muted-foreground/40" />
              </div>
              <div>
                <p className="font-semibold">No bookings yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse tutors and book your first session
                </p>
              </div>
              <Button asChild className="gap-2 rounded-xl">
                <Link href="/tutors"><Search className="size-4" /> Browse Tutors</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {bookings.map((booking, idx) => {
                const bookingId   = text(booking.id   ?? booking._id, idx.toString());
                const tutorName   = text(booking.tutorName ?? nestedName(booking.tutor), "Tutor session");
                const tutorId     = text(booking.tutorId   ?? nestedId(booking.tutor),   "");
                const subject     = text(booking.subject   ?? booking.category,           "Tutoring");
                const dateStr     = text(booking.date ?? booking.sessionDate ?? booking.createdAt);
                const startTime   = text(booking.startTime);
                const endTime     = text(booking.endTime);
                const price       = booking.price ?? booking.amount;
                const rawStatus   = text(booking.status, "CONFIRMED").toUpperCase();
                const statusCfg   = STATUS_CFG[rawStatus] ?? STATUS_CFG.CONFIRMED;
                const isCompleted = rawStatus === "COMPLETED";
                const isCancelled = rawStatus === "CANCELLED";

                const formattedDate = dateStr !== "N/A"
                  ? new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
                  : null;

                return (
                  <div key={bookingId} className="p-5 transition-colors hover:bg-muted/30">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      {/* Left: avatar + info */}
                      <div className="flex items-start gap-4">
                        <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                          {tutorName[0]?.toUpperCase() ?? "T"}
                        </div>
                        <div className="min-w-0 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-black text-sm">{tutorName}</p>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusCfg.bg} ${statusCfg.textColor}`}>
                              <span className={`size-1.5 rounded-full ${statusCfg.dot}`} />
                              {statusCfg.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {subject && subject !== "N/A" && (
                              <span className="flex items-center gap-1">
                                <GraduationCap className="size-3.5" />
                                {subject}
                              </span>
                            )}
                            {formattedDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3.5" />
                                {formattedDate}
                              </span>
                            )}
                            {startTime !== "N/A" && (
                              <span className="flex items-center gap-1">
                                <Clock className="size-3.5" />
                                {startTime}{endTime !== "N/A" ? ` – ${endTime}` : ""}
                              </span>
                            )}
                            {price != null && (
                              <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                <DollarSign className="size-3.5" />
                                ৳{text(price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: action buttons */}
                      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                        {!isCompleted && !isCancelled && (
                          <CancelBookingButton bookingId={bookingId} />
                        )}
                        {isCompleted && tutorId && tutorId !== "N/A" && (
                          <ReviewForm
                            tutorId={tutorId}
                            tutorName={tutorName}
                            bookingId={bookingId}
                          />
                        )}
                        {isCancelled && (
                          <span className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 dark:border-red-800">
                            Session Cancelled
                          </span>
                        )}
                      </div>
                    </div>
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

function Search({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}
