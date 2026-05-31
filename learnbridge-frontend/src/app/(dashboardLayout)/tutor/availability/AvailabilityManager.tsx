"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateAvailabilityAction } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlusCircle, Loader2, Calendar, Clock,
  CheckCircle2, Sparkles, CalendarOff,
} from "lucide-react";

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

function formatDisplayDate(dateStr: string) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short", year: "numeric", month: "short", day: "numeric",
    });
  } catch { return dateStr; }
}

function formatDisplayTime(timeStr: string) {
  if (!timeStr) return "";
  try {
    const [h, m] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
  } catch { return timeStr; }
}

const SLOT_COLORS = [
  "bg-primary/10 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
];

export default function AvailabilityManager({ initialSlots }: Props) {
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateAvailabilityAction(formData);
      if (res.success) {
        toast.success("Slot saved successfully!");
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
        toast.error(res.message ?? "Failed to save slot");
      }
    });
  };

  const available = slots.filter((s) => !s.isBooked).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">

      
      <Card className="overflow-hidden self-start">
        <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />
        <CardHeader className="border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="size-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">Add New Slot</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="size-3.5 text-muted-foreground" />
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                className="rounded-xl border-border/60 bg-muted/30 focus:bg-background"
              />
            </div>

            {/* Start / End Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="size-3.5 text-muted-foreground" />
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  required
                  className="rounded-xl border-border/60 bg-muted/30 focus:bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime" className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="size-3.5 text-muted-foreground" />
                  End Time
                </Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  required
                  className="rounded-xl border-border/60 bg-muted/30 focus:bg-background"
                />
              </div>
            </div>

            {/* Hint */}
            <div className="flex items-start gap-2.5 rounded-2xl bg-primary/5 border border-primary/15 px-4 py-3">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Students can book any available slot. Booked slots are locked automatically.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full gap-2 rounded-xl font-semibold"
            >
              {isPending ? (
                <><Loader2 className="size-4 animate-spin" /> Saving…</>
              ) : (
                <><PlusCircle className="size-4" /> Save Slot</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      
      <Card className="overflow-hidden self-start">
        <div className="h-[3px] w-full bg-linear-to-r from-emerald-500 to-cyan-500" />
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <Calendar className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Your Slots</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">{slots.length} total</p>
              </div>
            </div>
            {available > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {available} open
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {slots.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-14 text-center">
              <div className="flex size-14 items-center justify-center rounded-3xl bg-muted">
                <CalendarOff className="size-7 text-muted-foreground/40" />
              </div>
              <div>
                <p className="font-semibold">No slots yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add your first slot using the form
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {slots.map((slot, idx) => {
                const colorClass = SLOT_COLORS[idx % SLOT_COLORS.length];
                return (
                  <div
                    key={slot.id}
                    className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/30 ${
                      slot.isBooked ? "opacity-70" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${colorClass}`}>
                      <Calendar className="size-4" />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {formatDisplayDate(slot.date)}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3 shrink-0" />
                        {formatDisplayTime(slot.startTime)}
                        {slot.endTime && (
                          <> <span>–</span> {formatDisplayTime(slot.endTime)}</>
                        )}
                      </div>
                    </div>

                    {/* Status badge */}
                    {slot.isBooked ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                        <span className="size-1.5 rounded-full bg-amber-500" />
                        Booked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Available
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
