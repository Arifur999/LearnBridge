"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createAvailabilityAction } from "@/actions/tutor.action";
import { DAYS } from "@/constants";

export default function CreateAvailabilityDialog() {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!day || !startTime || !endTime) { toast.error("All fields are required"); return; }
    setLoading(true);
    const toastId = toast.loading("Creating slot...");
    try {
      const res = await createAvailabilityAction({ day, startTime, endTime });
      if (res.success) {
        toast.success("Availability slot created", { id: toastId });
        setDay(""); setStartTime(""); setEndTime("");
        setOpen(false);
      } else {
        toast.error(res.message ?? "Failed", { id: toastId });
      }
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" /> Add Slot</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Availability Slot</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Day</Label>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
              <SelectContent>
                {DAYS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Start Time</Label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>End Time</Label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Slot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
