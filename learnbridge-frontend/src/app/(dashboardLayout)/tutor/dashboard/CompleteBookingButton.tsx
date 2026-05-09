"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { completeBookingAction } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  bookingId: string;
}

export default function CompleteBookingButton({ bookingId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleComplete = () => {
    startTransition(async () => {
      const res = await completeBookingAction(bookingId);
      if (res.success) {
        toast.success("Session marked as complete");
      } else {
        toast.error(res.message ?? "Failed to complete session");
      }
    });
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleComplete}
      disabled={isPending}
      className="gap-1.5 text-emerald-600 hover:border-emerald-400 hover:text-emerald-700"
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <CheckCircle2 className="size-3.5" />
      )}
      Done
    </Button>
  );
}
