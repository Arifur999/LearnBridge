"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getTrainerSlots, bookAndPayAction } from "@/actions/booking.action";

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface BookingModalProps {
  trainerId: string;
  trainerName: string;
  price?: number;
}

export function BookingModal({ trainerId, trainerName, price = 0 }: BookingModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [redirectingSlot, setRedirectingSlot] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && trainerId) {
      setLoading(true);
      getTrainerSlots(trainerId).then((data) => {
        setSlots(data);
        setLoading(false);
      });
    }
  }, [isOpen, trainerId]);

  const handleBook = async (slot: Slot) => {
    setRedirectingSlot(slot.id);
    toast.info("Setting up secure payment…");

    const result = await bookAndPayAction(slot.id);

    if (!result.success) {
      toast.error(result.message ?? "Payment setup failed.");
      setRedirectingSlot(null);
      return;
    }

    // Redirect to Stripe's hosted payment page
    window.location.href = result.stripeUrl;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full mt-2 gap-2">
          <CreditCard className="size-4" />
          Book Session with {trainerName}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Available Slots — {trainerName}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          ) : slots.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No available slots found for this tutor.
            </p>
          ) : (
            <div className="grid gap-2 max-h-[320px] overflow-y-auto pr-1">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between rounded-xl border bg-muted/30 p-3"
                >
                  <div className="text-sm">
                    <p className="font-medium">
                      {new Date(slot.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-muted-foreground">
                      {slot.startTime} – {slot.endTime}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => handleBook(slot)}
                    disabled={!!redirectingSlot}
                  >
                    {redirectingSlot === slot.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="size-3.5" />
                        {price > 0 ? `BDT ${price}` : "Book"}
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
