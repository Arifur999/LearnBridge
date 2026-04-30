import Link from "next/link";

import { getMyBookings } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";

const label = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const nestedName = (value: unknown) => {
  return value && typeof value === "object" && "name" in value
    ? (value as { name?: unknown }).name
    : undefined;
};

export default async function StudentBookingsPage() {
  const bookings = await getMyBookings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">
            Track upcoming, completed, and cancelled tutor sessions.
          </p>
        </div>
        <Button asChild>
          <Link href="/tutors">Book New Session</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {bookings.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="font-medium">No bookings found.</p>
            <p className="text-sm text-muted-foreground">
              Browse tutors and book your first session.
            </p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={label(booking.id ?? booking._id)}
              className="grid gap-3 rounded-lg border p-4 md:grid-cols-4 md:items-center"
            >
              <div>
                <p className="font-medium">
                  {label(booking.tutorName ?? nestedName(booking.tutor), "Tutor session")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {label(booking.subject ?? booking.category, "Tutoring")}
                </p>
              </div>
              <p className="text-sm">{label(booking.date ?? booking.sessionDate)}</p>
              <p className="text-sm">
                {label(booking.startTime)} - {label(booking.endTime)}
              </p>
              <p className="text-sm font-medium">{label(booking.status, "CONFIRMED")}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
