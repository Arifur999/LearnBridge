import { getAdminBookings } from "@/actions/dashboard.action";

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

const getStatusConfig = (status: unknown) => {
  const s = text(status, "CONFIRMED").toUpperCase();
  return statusConfig[s] ?? { label: s, className: "bg-muted text-muted-foreground" };
};

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Bookings</h1>
        <p className="text-muted-foreground">Review all platform session activity.</p>
      </div>

      {/* Stats row */}
      <div className="grid gap-3 sm:grid-cols-3">
        {["CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
          <div key={s} className="rounded-2xl border p-4">
            <p className="text-2xl font-bold">
              {bookings.filter((b) => text(b.status, "CONFIRMED").toUpperCase() === s).length}
            </p>
            <p className="text-sm text-muted-foreground">{statusConfig[s]?.label ?? s}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border">
        <div className="hidden grid-cols-5 bg-muted px-5 py-3 text-sm font-semibold md:grid">
          <span>Student</span>
          <span>Tutor</span>
          <span>Date</span>
          <span>Status</span>
          <span>Amount</span>
        </div>

        {bookings.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No bookings found.</p>
        ) : (
          <div className="divide-y">
            {bookings.map((booking, idx) => {
              const { label, className } = getStatusConfig(booking.status);
              return (
                <div
                  key={text(booking.id ?? booking._id, idx.toString())}
                  className="grid grid-cols-2 gap-3 px-5 py-4 text-sm md:grid-cols-5 md:items-center"
                >
                  <span className="font-medium">
                    {text(booking.studentName ?? nestedName(booking.student), "Student")}
                  </span>
                  <span className="text-muted-foreground">
                    {text(booking.tutorName ?? nestedName(booking.tutor), "Tutor")}
                  </span>
                  <span className="text-muted-foreground">
                    {text(booking.date ?? booking.sessionDate)}
                  </span>
                  <span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
                      {label}
                    </span>
                  </span>
                  <span className="font-medium text-primary">
                    {booking.price ?? booking.amount ? `BDT ${text(booking.price ?? booking.amount)}` : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
