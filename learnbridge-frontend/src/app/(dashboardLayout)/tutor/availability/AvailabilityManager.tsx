"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateAvailabilityAction } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2, Calendar, Clock, CheckCircle2 } from "lucide-react";

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface Props {
  initialSlots: Slot[];
}

export default function AvailabilityManager({ initialSlots }: Props) {
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateAvailabilityAction(formData);
      if (res.success) {
        toast.success("Availability slot saved!");
        // Optimistically add to slots list
        const newSlot: Slot = {
          id: Date.now().toString(),
          date: formData.get("date")?.toString() ?? "",
          startTime: formData.get("startTime")?.toString() ?? "",
          endTime: formData.get("endTime")?.toString() ?? "",
          isBooked: false,
        };
        setSlots((prev) => [newSlot, ...prev]);
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(res.message ?? "Failed to save availability");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Add slot form */}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border p-6">
        <h2 className="font-semibold">Add New Slot</h2>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input id="startTime" name="startTime" type="time" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input id="endTime" name="endTime" type="time" required />
          </div>
        </div>
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <PlusCircle className="size-4" />
          )}
          Save Slot
        </Button>
      </form>

      {/* Existing slots */}
      <div>
        <h2 className="mb-3 font-semibold">Your Slots ({slots.length})</h2>
        {slots.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            <Calendar className="mx-auto mb-3 size-8 text-muted-foreground/40" />
            <p>No slots added yet. Add your first slot above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`flex items-center justify-between rounded-xl border p-4 ${
                  slot.isBooked ? "bg-muted/40" : "bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Calendar className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{slot.date}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="size-3" />
                      {slot.startTime} – {slot.endTime}
                    </div>
                  </div>
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    slot.isBooked
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {slot.isBooked ? (
                    "Booked"
                  ) : (
                    <>
                      <CheckCircle2 className="size-3" /> Available
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
