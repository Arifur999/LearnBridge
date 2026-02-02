"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { bookSlotAction, getTrainerSlots } from "@/actions/booking.action";

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
}

export function BookingModal({ trainerId, trainerName }: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

  // Modal open hole slots fetch korbe
  useEffect(() => {
    if (isOpen) {
      const fetchSlots = async () => {
        setLoading(true);
        const data = await getTrainerSlots(trainerId);
        setSlots(data);
        setLoading(false);
      };
      fetchSlots();
    }
  }, [isOpen, trainerId]);

  // Slot Book korar function
  const handleBook = async (slotId: string) => {
    setBookingLoading(slotId);
    
    const result = await bookSlotAction(slotId);

    if (result.success) {
      toast.success(result.message);
      setIsOpen(false); // Modal bondho korbe
    } else {
      toast.error(result.message);
    }
    
    setBookingLoading(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Book Session with {trainerName}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Available Slots for {trainerName}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          ) : slots.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              No available slots found.
            </p>
          ) : (
            <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent"
                >
                  <div className="text-sm">
                    <p className="font-medium">{slot.date}</p>
                    <p className="text-muted-foreground">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={() => handleBook(slot.id)}
                    disabled={!!bookingLoading}
                  >
                    {bookingLoading === slot.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Book"
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