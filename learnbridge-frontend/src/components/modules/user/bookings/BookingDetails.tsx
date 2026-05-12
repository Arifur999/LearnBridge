import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailRow } from "./DetailRow";
import { Booking } from "@/types";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function BookingDetails({ booking }: { booking: Booking & Record<string, unknown> }) {
  const statusStr = String(booking.status ?? "PENDING").toUpperCase();
  const statusClass = statusColors[statusStr] ?? "bg-muted text-muted-foreground";
  const avail = booking.availability as { day?: string; startTime?: string; endTime?: string } | undefined;
  const tutor = booking.tutor as { user?: { name?: string }; hourlyRate?: number } | undefined;
  const student = booking.student as { name?: string; email?: string } | undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Booking Details
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
            {statusStr}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DetailRow label="Booking ID" value={<span className="font-mono text-xs">{booking.id}</span>} />
        <DetailRow label="Tutor" value={tutor?.user?.name ?? "—"} />
        <DetailRow label="Student" value={student?.name ?? "—"} />
        <DetailRow
          label="Schedule"
          value={avail ? `${avail.day} · ${avail.startTime}–${avail.endTime}` : "—"}
        />
        <DetailRow
          label="Price"
          value={booking.price != null
            ? booking.price === 0 ? "Free" : `$${booking.price}`
            : "—"}
        />
        <DetailRow
          label="Booked On"
          value={booking.createdAt ? new Date(String(booking.createdAt)).toLocaleDateString() : "—"}
        />
        {booking.completedAt && (
          <DetailRow
            label="Completed On"
            value={new Date(String(booking.completedAt)).toLocaleDateString()}
          />
        )}
      </CardContent>
    </Card>
  );
}
