import Link from "next/link";
import { Calendar, UserRoundCheck, CheckCircle2, PlusCircle, ArrowRight, Clock } from "lucide-react";
import { getTutorBookings } from "@/actions/dashboard.action";
import { getTutorSlotsAction } from "@/actions/dashboard.action";
import CompleteBookingButton from "./CompleteBookingButton";
import { Button } from "@/components/ui/button";
import { getCurrentUserFromServer } from "@/lib/auth";

const text = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const nestedName = (value: unknown) =>
  value && typeof value === "object" && "name" in value
    ? (value as { name?: unknown }).name
    : undefined;

const statusConfig: Record<string, { label: string; className: string }> = {
  CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Completed", className: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

export default async function TutorDashboardPage() {
  const [user, bookings, slots] = await Promise.all([
    getCurrentUserFromServer(),
    getTutorBookings(),
    getTutorSlotsAction(),
  ]);

  const confirmed = bookings.filter(
    (b) => String(b.status ?? "").toUpperCase() === "CONFIRMED"
  ).length;
  const completed = bookings.filter(
    (b) => String(b.status ?? "").toUpperCase() === "COMPLETED"
  ).length;
  const availableSlots = (slots as Array<{ isBooked?: boolean }>).filter((s) => !s.isBooked).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, <span className="font-semibold text-foreground">{user?.name ?? "tutor"}</span>. Manage your teaching sessions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-background p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-xl bg-indigo-50 p-3">
            <Calendar className="size-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold">{bookings.length}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Total Sessions</p>
        </div>
        <div className="rounded-2xl border bg-background p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-xl bg-blue-50 p-3">
            <UserRoundCheck className="size-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold">{confirmed}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Confirmed</p>
        </div>
        <div className="rounded-2xl border bg-background p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-xl bg-emerald-50 p-3">
            <CheckCircle2 className="size-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold">{completed}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Completed</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick actions */}
        <div className="rounded-2xl border p-5">
          <h3 className="mb-3 font-semibold">Quick Actions</h3>
          <div className="space-y-2">
            <Button asChild className="w-full justify-between">
              <Link href="/tutor/availability">
                <span className="flex items-center gap-2">
                  <PlusCircle className="size-4" /> Add Availability
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild className="w-full justify-between" variant="outline">
              <Link href="/tutor/profile">
                <span className="flex items-center gap-2">
                  <UserRoundCheck className="size-4" /> Edit Profile
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 rounded-xl bg-muted/40 p-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{availableSlots}</span> available slot{availableSlots !== 1 ? "s" : ""} currently open for booking.
          </div>
        </div>

        {/* Sessions list */}
        <div className="rounded-2xl border p-5">
          <h3 className="mb-3 font-semibold">Recent Sessions</h3>
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No sessions yet. Add availability slots so students can book.
            </p>
          ) : (
            <div className="space-y-2">
              {bookings.slice(0, 5).map((b, idx) => {
                const bookingId = text(b.id ?? b._id, idx.toString());
                const studentName = text(b.studentName ?? nestedName(b.student), "Student");
                const statusStr = text(b.status, "CONFIRMED").toUpperCase();
                const { label, className } = statusConfig[statusStr] ?? {
                  label: statusStr,
                  className: "bg-muted text-muted-foreground",
                };
                const isConfirmed = statusStr === "CONFIRMED";

                return (
                  <div
                    key={bookingId}
                    className="flex items-center justify-between rounded-xl border p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{studentName}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {text(b.date ?? b.sessionDate)}
                        {text(b.startTime) !== "N/A" ? ` • ${text(b.startTime)}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
                        {label}
                      </span>
                      {isConfirmed && (
                        <CompleteBookingButton bookingId={bookingId} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
