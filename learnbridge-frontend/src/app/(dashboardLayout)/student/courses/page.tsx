import Link from "next/link";
import { BookOpen, Calendar, Clock, Star, Search } from "lucide-react";
import { getMyBookings } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";

const text = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const nestedName = (value: unknown) =>
  value && typeof value === "object" && "name" in value
    ? (value as { name?: unknown }).name
    : undefined;

const nestedId = (value: unknown) =>
  value && typeof value === "object" && "id" in value
    ? (value as { id?: unknown }).id
    : undefined;

export default async function StudentCoursesPage() {
  const bookings = await getMyBookings();

  // Derive unique tutors from bookings to show as "courses"
  const seenTutorIds = new Set<string>();
  const tutorSessions: Array<{
    tutorId: string;
    tutorName: string;
    totalSessions: number;
    completedSessions: number;
    lastDate: string;
    subject: string;
  }> = [];

  for (const b of bookings) {
    const tutorId = text(
      b.tutorId ?? nestedId(b.tutor) ?? undefined,
      ""
    );
    if (!tutorId || tutorId === "N/A" || seenTutorIds.has(tutorId)) continue;
    seenTutorIds.add(tutorId);

    const tutorBookings = bookings.filter(
      (x) =>
        text(x.tutorId ?? nestedId(x.tutor) ?? undefined, "") ===
        tutorId
    );

    tutorSessions.push({
      tutorId,
      tutorName: text(b.tutorName ?? nestedName(b.tutor) ?? undefined, "Tutor"),
      totalSessions: tutorBookings.length,
      completedSessions: tutorBookings.filter(
        (x) => String(x.status ?? "").toUpperCase() === "COMPLETED"
      ).length,
      lastDate: text(b.date ?? b.sessionDate, ""),
      subject: text(b.subject ?? b.category, "Tutoring"),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">My Sessions</h1>
          <p className="text-muted-foreground">
            Tutors you have booked sessions with.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/tutors">
            <Search className="size-4" /> Find a Tutor
          </Link>
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border bg-background p-4 shadow-sm">
          <div className="mb-2 inline-flex rounded-xl bg-indigo-50 p-2">
            <BookOpen className="size-4 text-indigo-600" />
          </div>
          <p className="text-xl font-bold">{tutorSessions.length}</p>
          <p className="text-xs text-muted-foreground">Tutors Booked</p>
        </div>
        <div className="rounded-2xl border bg-background p-4 shadow-sm">
          <div className="mb-2 inline-flex rounded-xl bg-blue-50 p-2">
            <Calendar className="size-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold">{bookings.length}</p>
          <p className="text-xs text-muted-foreground">Total Sessions</p>
        </div>
        <div className="rounded-2xl border bg-background p-4 shadow-sm">
          <div className="mb-2 inline-flex rounded-xl bg-emerald-50 p-2">
            <Star className="size-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold">
            {bookings.filter((b) => String(b.status ?? "").toUpperCase() === "COMPLETED").length}
          </p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
      </div>

      {tutorSessions.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <BookOpen className="mx-auto mb-3 size-10 text-muted-foreground/40" />
          <p className="font-medium">No sessions booked yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse our tutors and book your first session today.
          </p>
          <Button asChild className="mt-4">
            <Link href="/tutors">Browse Tutors</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tutorSessions.map((t) => (
            <div
              key={t.tutorId}
              className="rounded-2xl border bg-background p-5 shadow-sm"
            >
              {/* Avatar */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                  {t.tutorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{t.tutorName}</p>
                  <p className="text-xs text-muted-foreground">{t.subject}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg bg-muted/40 p-2">
                  <p className="text-lg font-bold">{t.totalSessions}</p>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-2">
                  <p className="text-lg font-bold text-emerald-700">{t.completedSessions}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>

              {t.lastDate && t.lastDate !== "N/A" && (
                <p className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  Last session: {t.lastDate}
                </p>
              )}

              <Button asChild size="sm" className="w-full" variant="outline">
                <Link href={`/tutors/${t.tutorId}`}>View Profile</Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
