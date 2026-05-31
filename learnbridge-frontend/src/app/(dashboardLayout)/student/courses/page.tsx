import Link from "next/link";
import {
  BookOpen, Calendar, Clock, CheckCircle2,
  Search, GraduationCap, Users, ArrowRight, TrendingUp,
} from "lucide-react";
import { getMyBookings } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const text = (v: unknown, fb = "N/A") =>
  typeof v === "string" || typeof v === "number" ? String(v) : fb;

const nestedName = (v: unknown) =>
  v && typeof v === "object" && "name" in v
    ? (v as { name?: unknown }).name : undefined;

const nestedId = (v: unknown) =>
  v && typeof v === "object" && "id" in v
    ? (v as { id?: unknown }).id : undefined;

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
];

export default async function StudentCoursesPage() {
  const bookings = await getMyBookings();

  
  const seenTutorIds = new Set<string>();
  const tutorSessions: Array<{
    tutorId: string; tutorName: string;
    totalSessions: number; completedSessions: number;
    pendingSessions: number; lastDate: string; subject: string;
  }> = [];

  for (const b of bookings) {
    const tutorId = text(b.tutorId ?? nestedId(b.tutor) ?? undefined, "");
    if (!tutorId || tutorId === "N/A" || seenTutorIds.has(tutorId)) continue;
    seenTutorIds.add(tutorId);

    const tutorBookings    = bookings.filter((x) => text(x.tutorId ?? nestedId(x.tutor) ?? undefined, "") === tutorId);
    const completedCount   = tutorBookings.filter((x) => text(x.status, "").toUpperCase() === "COMPLETED").length;
    const pendingCount     = tutorBookings.filter((x) => ["CONFIRMED", "PENDING"].includes(text(x.status, "").toUpperCase())).length;

    tutorSessions.push({
      tutorId,
      tutorName:        text(b.tutorName ?? nestedName(b.tutor) ?? undefined, "Tutor"),
      totalSessions:    tutorBookings.length,
      completedSessions: completedCount,
      pendingSessions:  pendingCount,
      lastDate:         text(b.date ?? b.sessionDate, ""),
      subject:          text(b.subject ?? b.category, "Tutoring"),
    });
  }

  const totalTutors    = tutorSessions.length;
  const totalSessions  = bookings.length;
  const totalCompleted = bookings.filter((b) => text(b.status, "").toUpperCase() === "COMPLETED").length;
  const totalUpcoming  = bookings.filter((b) => ["CONFIRMED", "PENDING"].includes(text(b.status, "").toUpperCase())).length;

  const statCards = [
    { icon: Users,        label: "Tutors Booked",     value: totalTutors,   sub: "Unique tutors",       iconBg: "bg-primary/10",                          iconColor: "text-primary",                           bar: "bg-primary",     barW: "100%"  },
    { icon: BookOpen,     label: "Total Sessions",     value: totalSessions, sub: "All time bookings",   iconBg: "bg-violet-100 dark:bg-violet-900/30",     iconColor: "text-violet-600 dark:text-violet-400",   bar: "bg-violet-500",  barW: "100%"  },
    { icon: CheckCircle2, label: "Completed",          value: totalCompleted,sub: "Finished sessions",   iconBg: "bg-emerald-100 dark:bg-emerald-900/30",   iconColor: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", barW: totalSessions > 0 ? `${Math.round((totalCompleted / totalSessions) * 100)}%` : "0%" },
    { icon: TrendingUp,   label: "Upcoming",           value: totalUpcoming, sub: "Confirmed & pending", iconBg: "bg-blue-100 dark:bg-blue-900/30",         iconColor: "text-blue-600 dark:text-blue-400",       bar: "bg-blue-500",    barW: totalSessions > 0 ? `${Math.round((totalUpcoming / totalSessions) * 100)}%` : "0%" },
  ];

  return (
    <div className="space-y-6">

      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">My Sessions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tutors you have booked sessions with
          </p>
        </div>
        <Button asChild className="w-fit gap-2 rounded-xl">
          <Link href="/tutors">
            <Search className="size-4" /> Find a Tutor
          </Link>
        </Button>
      </div>

      
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-primary via-violet-500 to-emerald-500" />
        <CardContent className="p-0">
          <div className="grid divide-y sm:divide-x sm:divide-y-0 sm:grid-cols-4">
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
              <GraduationCap className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Booked Tutors</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {totalTutors} tutor{totalTutors !== 1 ? "s" : ""} booked
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          {tutorSessions.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-muted">
                <BookOpen className="size-8 text-muted-foreground/40" />
              </div>
              <div>
                <p className="font-semibold">No sessions booked yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse our tutors and book your first session today
                </p>
              </div>
              <Button asChild className="gap-2 rounded-xl">
                <Link href="/tutors"><Search className="size-4" /> Browse Tutors</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {tutorSessions.map((t, idx) => {
                const completionPct = t.totalSessions > 0
                  ? Math.round((t.completedSessions / t.totalSessions) * 100)
                  : 0;

                return (
                  <Card key={t.tutorId} className="group overflow-hidden transition-shadow hover:shadow-md">
                    <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />
                    <CardContent className="p-5">

                      {/* Avatar + Name */}
                      <div className="mb-4 flex items-center gap-3">
                        <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl text-base font-black ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                          {t.tutorName[0]?.toUpperCase() ?? "T"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-sm leading-tight">{t.tutorName}</p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">{t.subject}</p>
                        </div>
                      </div>

                      {/* Session stats */}
                      <div className="mb-4 grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-muted/50 p-3 text-center">
                          <p className="text-lg font-black tabular-nums">{t.totalSessions}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Total</p>
                        </div>
                        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3 text-center">
                          <p className="text-lg font-black tabular-nums text-emerald-700 dark:text-emerald-400">{t.completedSessions}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Done</p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-4 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Completion</span>
                          <span className="font-semibold">{completionPct}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                            style={{ width: `${completionPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Last session */}
                      {t.lastDate && t.lastDate !== "N/A" && (
                        <p className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="size-3.5" />
                          Last: {new Date(t.lastDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      )}

                      {/* Upcoming indicator */}
                      {t.pendingSessions > 0 && (
                        <div className="mb-4 flex items-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 px-3 py-2">
                          <Calendar className="size-3.5 text-blue-500" />
                          <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                            {t.pendingSessions} upcoming session{t.pendingSessions !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}

                      {/* View Profile */}
                      <Link
                        href={`/tutors/${t.tutorId}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border py-2 text-xs font-semibold text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                      >
                        View Profile <ArrowRight className="size-3.5" />
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
