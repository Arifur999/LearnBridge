import { getAdminBookings } from "@/actions/dashboard.action";

const text = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const nestedName = (value: unknown) => {
  return value && typeof value === "object" && "name" in value
    ? (value as { name?: unknown }).name
    : undefined;
};

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Bookings</h1>
        <p className="text-muted-foreground">Review platform session activity.</p>
      </div>

      <div className="space-y-3">
        {bookings.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No bookings found.
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={text(booking.id ?? booking._id)}
              className="grid gap-3 rounded-lg border p-4 md:grid-cols-5"
            >
              <span>{text(booking.studentName ?? nestedName(booking.student), "Student")}</span>
              <span>{text(booking.tutorName ?? nestedName(booking.tutor), "Tutor")}</span>
              <span>{text(booking.date ?? booking.sessionDate)}</span>
              <span>{text(booking.status, "CONFIRMED")}</span>
              <span>{text(booking.price ?? booking.amount, "0")}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
