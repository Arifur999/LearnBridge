"use client";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Booking {
  id: string;
  status: string;
  createdAt?: string;
  price?: number;
  student?: { name?: string; email?: string };
  tutor?: { user?: { name?: string } };
  availability?: { day?: string; startTime?: string; endTime?: string };
}

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
  PENDING: "bg-yellow-100 text-yellow-700",
};

export default function AllBookingsTable({ bookings }: { bookings: Booking[] }) {
  if (!bookings?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
        <p className="text-muted-foreground">No bookings found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Tutor</TableHead>
          <TableHead>Schedule</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => {
          const statusClass = statusColors[booking.status] ?? "bg-muted text-muted-foreground";
          return (
            <TableRow key={booking.id}>
              <TableCell>{booking.student?.name ?? "—"}</TableCell>
              <TableCell>{booking.tutor?.user?.name ?? "—"}</TableCell>
              <TableCell>
                {booking.availability
                  ? `${booking.availability.day} ${booking.availability.startTime}–${booking.availability.endTime}`
                  : "—"}
              </TableCell>
              <TableCell>{booking.price != null ? `$${booking.price}` : "Free"}</TableCell>
              <TableCell>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
                  {booking.status}
                </span>
              </TableCell>
              <TableCell>
                {booking.createdAt
                  ? new Date(booking.createdAt).toLocaleDateString()
                  : "—"}
              </TableCell>
              <TableCell>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/bookings/${booking.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
