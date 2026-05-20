import Link from "next/link";
import { getMyBookings } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CancelBookingButton from "@/components/cancel-booking-button";
import DashPageHeader from "@/components/layout/DashPageHeader";
import { Badge } from "@/components/ui/badge";
import ReviewForm from "@/components/review-form";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CONFIRMED: "default",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
  PENDING: "outline",
};

export default async function DashboardBookingsPage() {
  const bookings = await getMyBookings();
  const list = Array.isArray(bookings) ? bookings : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <DashPageHeader
          title="My Bookings"
          description="Track upcoming, completed, and cancelled tutor sessions."
          className="mb-0"
        />
        <Button asChild>
          <Link href="/tutors">
            <Plus className="mr-2 size-4" /> Book Session
          </Link>
        </Button>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
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
          {list.map((booking, idx) => {
            const b = booking as Record<string, unknown>;
            const id = String(b?.id ?? b?._id ?? idx);
            const status = String(b?.status ?? "PENDING").toUpperCase();
            const isCancelled = status === "CANCELLED";

            // Backend returns: booking.slot.trainer (not booking.tutor)
            const slot = b?.slot as Record<string, unknown> | undefined;
            const trainer = slot?.trainer as Record<string, unknown> | undefined;
            const tutorId = String(trainer?.id ?? "");
            const tutorName = String(trainer?.name ?? "Tutor");
            const date = slot?.date ? new Date(String(slot.date)).toDateString() : "";
            const startTime = String(slot?.startTime ?? "");
            const endTime = String(slot?.endTime ?? "");

            const hasReview = !!(b?.review);
            const canReview = !isCancelled && tutorId && !hasReview;

            return (
              <div key={id} className="rounded-2xl border bg-background p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{tutorName}</p>
                      <Badge variant={statusVariant[status] ?? "outline"} className="text-xs">
                        {status}
                      </Badge>
                    </div>
                    {date && (
                      <p className="text-sm text-muted-foreground">
                        {date}{startTime ? ` • ${startTime}${endTime ? ` – ${endTime}` : ""}` : ""}
                      </p>
                    )}
                    {b?.price != null && (
                      <p className="text-sm font-medium">BDT {String(b.price)}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/bookings/${id}`}>View Details</Link>
                    </Button>
                    {canReview && (
                      <ReviewForm
                        tutorId={tutorId}
                        tutorName={tutorName}
                        bookingId={id}
                      />
                    )}
                    {!isCancelled && (
                      <CancelBookingButton bookingId={id} />
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
