"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAvailabilityAction } from "@/actions/tutor.action";

interface AvailabilitySlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  status: string;
}

export default function AvailabilityCard({ slot }: { slot: AvailabilitySlot }) {
  const handleDelete = async () => {
    const toastId = toast.loading("Deleting slot...");
    try {
      await deleteAvailabilityAction(slot.id);
      toast.success("Slot deleted", { id: toastId });
    } catch {
      toast.error("Failed to delete slot", { id: toastId });
    }
  };

  return (
    <Card className="relative">
      <CardContent className="pt-4 pb-4 px-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold capitalize">{slot.day}</p>
            <p className="text-sm text-muted-foreground">
              {slot.startTime} – {slot.endTime}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={slot.status === "AVAILABLE" ? "default" : "secondary"}>
              {slot.status}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
