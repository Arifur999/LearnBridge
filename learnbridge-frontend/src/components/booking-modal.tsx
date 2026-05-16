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
import { getTrainerSlots } from "@/actions/booking.action";

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
  userRole?: string;
}

export function BookingModal({ trainerId, trainerName, price = 0, userRole }: BookingModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [redirectingSlot, setRedirectingSlot] = useState<string | null>(null);

  const role = (userRole ?? "").toLowerCase();
  const isRestricted = role === "admin" || role === "tutor" || role === "trainer";

  useEffect(() => {
    if (isOpen && trainerId) {
      setLoading(true);
      getTrainerSlots(trainerId).then((data) => {
        setSlots(data);
        setLoading(false);
      });
    }
  }, [isOpen, trainerId]);

  const handleBook = (slot: Slot) => {
    setRedirectingSlot(slot.id);
    toast.info("Redirecting to payment…");

    const params = new URLSearchParams({
      slotId: slot.id,
      tutorName: trainerName,
      price: String(price),
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });

    router.push(`/payments/checkout?${params.toString()}`);
  };

  if (isRestricted) {
    return (
      <div className="group relative w-full mt-2">
        <Button size="lg" className="w-full gap-2 cursor-not-allowed opacity-50" disabled>
          <CreditCard className="size-4" />
          Book Session with {trainerName}
        </Button>
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          Only students can book sessions
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground" />
        </div>
      </div>
    );
  }

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
