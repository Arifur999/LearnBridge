"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription, DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cancelBookingAction } from "@/actions/student.action";
import { createBookingPaymentAction } from "@/actions/payment.action";
import { Booking } from "@/types";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export function StudentBookingsTable({ bookings }: { bookings: Booking[] }) {
  const [loadingPaymentId, setLoadingPaymentId] = useState<string | null>(null);
  const [cancelDialogId, setCancelDialogId] = useState<string | null>(null);

  const handlePayNow = async (bookingId: string) => {
    setLoadingPaymentId(bookingId);
    const toastId = toast.loading("Creating payment session...");
    try {
      const res = await createBookingPaymentAction(bookingId);
      const url = res?.data?.url ?? res?.url;
      if (url) {
        toast.success("Redirecting to checkout...", { id: toastId });
        window.location.href = url;
      } else {
        toast.error("Could not initiate payment", { id: toastId });
      }
    } catch {
      toast.error("Payment failed", { id: toastId });
    } finally {
      setLoadingPaymentId(null);
    }
  };

  const handleCancel = async (bookingId: string) => {
    setCancelDialogId(null);
    const toastId = toast.loading("Cancelling booking...");
    try {
      const res = await cancelBookingAction(bookingId);
      if (res?.error) {
        toast.error(String(res.error), { id: toastId });
      } else {
        toast.success("Booking cancelled", { id: toastId });
      }
    } catch {
      toast.error("Failed to cancel booking", { id: toastId });
    }
  };

  if (!bookings?.length) {
    return (
      <div className="flex flex-col items-center justify-center border-2 py-16 text-center">
        <h3 className="text-lg font-semibold">No bookings yet</h3>
        <p className="text-muted-foreground mt-1">Your bookings will appear here once you book a session</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tutor</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const statusStr = String(booking.status ?? "PENDING").toUpperCase();
            const statusClass = statusColors[statusStr] ?? "bg-muted text-muted-foreground";
            const avail = booking.availability as { day?: string; startTime?: string; endTime?: string } | undefined;

            return (
              <TableRow key={booking.id}>
                <TableCell>
                  {(booking as { tutor?: { user?: { name?: string } } }).tutor?.user?.name ?? "—"}
                </TableCell>
                <TableCell>
                  {avail ? `${avail.day} ${avail.startTime}–${avail.endTime}` : "—"}
                </TableCell>
                <TableCell>
                  {booking.price != null ? (booking.price === 0 ? "Free" : `$${booking.price}`) : "—"}
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
                  <div className="flex items-center gap-1">
                    {statusStr === "PENDING" && (
                      <Button
                        size="sm"
                        disabled={loadingPaymentId === booking.id}
                        onClick={() => handlePayNow(booking.id)}
                      >
                        {loadingPaymentId === booking.id ? "..." : "Pay Now"}
                      </Button>
                    )}
                    {statusStr === "CONFIRMED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500"
                        onClick={() => setCancelDialogId(booking.id)}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/bookings/${booking.id}`}>View</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={!!cancelDialogId} onOpenChange={() => setCancelDialogId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>Are you sure you want to cancel this booking? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">Keep Booking</Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={() => cancelDialogId && handleCancel(cancelDialogId)}
            >
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
