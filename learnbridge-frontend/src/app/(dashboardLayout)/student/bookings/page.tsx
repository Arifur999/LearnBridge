import Link from "next/link";
import { getMyBookings } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CancelBookingButton from "@/components/cancel-booking-button";
import ReviewForm from "@/components/review-form";

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

const statusConfig: Record<string, { label: string; className: string }> = {
  CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Completed", className: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

const getStatus = (status: unknown) => {
  const s = text(status, "CONFIRMED").toUpperCase();
  return statusConfig[s] ?? { label: s, className: "bg-muted text-muted-foreground" };
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
        <Button asChild className="gap-2">
          <Link href="/tutors">
            <Plus className="size-4" /> Book Session
          </Link>
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="font-medium">No bookings yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse tutors and book your first session.
          </p>
          <Button asChild className="mt-4">
            <Link href="/tutors">Browse Tutors</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking, idx) => {
            const bookingId = text(booking.id ?? booking._id, idx.toString());
            const tutorName = text(booking.tutorName ?? nestedName(booking.tutor), "Tutor session");
            const tutorId = text(booking.tutorId ?? nestedId(booking.tutor), "");
            const subject = text(booking.subject ?? booking.category, "Tutoring");
            const dateVal = text(booking.date ?? booking.sessionDate);
            const startTime = text(booking.startTime);
            const endTime = text(booking.endTime);
            const { label, className } = getStatus(booking.status);
            const statusStr = text(booking.status, "CONFIRMED").toUpperCase();
            const isCompleted = statusStr === "COMPLETED";
            const isCancelled = statusStr === "CANCELLED";

            return (
              <div
                key={bookingId}
                className="rounded-2xl border bg-background p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{tutorName}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
                        {label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {dateVal !== "N/A" ? dateVal : ""}
                      {startTime !== "N/A" && endTime !== "N/A"
                        ? ` • ${startTime} – ${endTime}`
                        : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Cancel — only for confirmed bookings */}
                    {!isCompleted && !isCancelled && (
                      <CancelBookingButton bookingId={bookingId} />
                    )}

                    {/* Review — only after completed */}
                    {isCompleted && tutorId && tutorId !== "N/A" && (
                      <ReviewForm
                        tutorId={tutorId}
                        tutorName={tutorName}
                        bookingId={bookingId}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
