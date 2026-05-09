"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { cancelBookingAction } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { XCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  bookingId: string;
  onCancelled?: () => void;
}

export default function CancelBookingButton({ bookingId, onCancelled }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    startTransition(async () => {
      const res = await cancelBookingAction(bookingId);
      if (res.success) {
        toast.success("Booking cancelled successfully");
        setOpen(false);
        onCancelled?.();
      } else {
        toast.error(res.message ?? "Failed to cancel booking");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 text-destructive hover:border-destructive hover:text-destructive">
          <XCircle className="size-3.5" />
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Cancel Booking</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Keep Booking
          </Button>
          <Button
            variant="destructive"
            className="flex-1 gap-1.5"
            onClick={handleCancel}
            disabled={isPending}
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Yes, Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
