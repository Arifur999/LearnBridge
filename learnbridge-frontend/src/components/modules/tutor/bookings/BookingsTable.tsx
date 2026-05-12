"use client";

import Link from "next/link";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function BookingsTable({ bookings }: { bookings: Booking[] }) {
  if (!bookings?.length) {
    return (
      <div className="flex flex-col items-center justify-center border-2 py-16 text-center">
        <h3 className="text-lg font-semibold">No bookings yet</h3>
        <p className="text-muted-foreground mt-1">
          Your bookings will appear here once students book sessions with you
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Schedule</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => {
          const statusStr = String(booking.status ?? "PENDING").toUpperCase();
          const statusClass = statusColors[statusStr] ?? "bg-muted text-muted-foreground";
          const avail = booking.availability as { day?: string; startTime?: string; endTime?: string } | undefined;
          const student = (booking as { student?: { name?: string } }).student;

          return (
            <TableRow key={booking.id}>
              <TableCell>{student?.name ?? "—"}</TableCell>
              <TableCell>
                {avail ? `${avail.day} ${avail.startTime}–${avail.endTime}` : "—"}
              </TableCell>
              <TableCell>
                {booking.price != null
                  ? booking.price === 0 ? "Free" : `$${booking.price}`
                  : "—"}
              </TableCell>
              <TableCell>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
                  {statusStr}
                </span>
              </TableCell>
              <TableCell>
                {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "—"}
              </TableCell>
              <TableCell>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/tutor/bookings/${booking.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
