"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createBookingAction } from "@/actions/student.action";
import { createBookingPaymentAction } from "@/actions/payment.action";

interface Availability {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface Subject {
  id: string;
  name: string;
}

interface TutorData {
  id: string;
  user?: { name?: string; image?: string | null };
  hourlyRate?: number;
  avgRating?: number;
  category?: { name: string };
  subjects?: Subject[];
  availability?: Availability[];
}

export default function CreateBookingDialog({ tutor }: { tutor: TutorData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("book") === "true";

  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState("");
  const [loading, setLoading] = useState(false);

  const availableSlots = tutor.availability?.filter((s) => s.status === "AVAILABLE") ?? [];
  const subjects = tutor.subjects ?? [];

  useEffect(() => {
    if (subjects.length === 1) setSelectedSubjectId(subjects[0].id);
  }, [subjects]);

  const handleClose = () => router.back();

  const handleSubmit = async () => {
    if (!selectedAvailabilityId) { toast.error("Please select a time slot"); return; }
    setLoading(true);
    const toastId = toast.loading("Creating booking...");
    try {
      const bookingRes = await createBookingAction({
        availabilityId: selectedAvailabilityId,
        tutorId: tutor.id,
        subjectId: selectedSubjectId || undefined,
      });

      if (bookingRes?.error) {
        toast.error("Booking failed", { id: toastId });
        return;
      }

      const bookingId = bookingRes?.data?.data?.id ?? bookingRes?.data?.id;
      if (!bookingId) {
        toast.error("Booking created but ID missing", { id: toastId });
        return;
      }

      toast.loading("Initiating payment...", { id: toastId });
      const payRes = await createBookingPaymentAction(bookingId);
      const url = payRes?.data?.url ?? payRes?.url;
      if (url) {
        toast.success("Redirecting to checkout...", { id: toastId });
        window.location.href = url;
      } else {
        toast.success("Booking confirmed!", { id: toastId });
        router.push("/dashboard/bookings");
      }
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book a Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Tutor info */}
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
            <Avatar className="h-12 w-12">
              <AvatarImage src={tutor.user?.image ?? undefined} />
              <AvatarFallback>{tutor.user?.name?.charAt(0) ?? "T"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{tutor.user?.name ?? "Tutor"}</p>
              <p className="text-sm text-muted-foreground">{tutor.category?.name ?? ""}</p>
              {tutor.hourlyRate != null && (
                <Badge variant="secondary">${tutor.hourlyRate}/hr</Badge>
              )}
            </div>
          </div>

          {/* Subject selection */}
          {subjects.length > 1 && (
            <div className="space-y-1">
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Time slot selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Available Time Slots</label>
            {availableSlots.length === 0 ? (
              <p className="text-sm text-muted-foreground">No available slots</p>
            ) : (
              <div className="space-y-2">
                {availableSlots.map((slot) => (
                  <label
                    key={slot.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedAvailabilityId === slot.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={slot.id}
                      checked={selectedAvailabilityId === slot.id}
                      onChange={() => setSelectedAvailabilityId(slot.id)}
                      className="accent-primary"
                    />
                    <span className="text-sm">
                      <span className="font-medium">{slot.day}</span>
                      {" · "}
                      {slot.startTime}–{slot.endTime}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !selectedAvailabilityId}
          >
            {loading ? "Processing..." : "Confirm & Pay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
