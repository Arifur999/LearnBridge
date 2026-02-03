
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSlotAction } from "@/actions/slot.action";

export default function AddSlotPage() {
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    
    const date = form.get("date") as string;
    const startTime = form.get("startTime") as string;
    const endTime = form.get("endTime") as string;
    
 
    if (!date || !startTime || !endTime) {
      toast.error("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
   
      const result = await createSlotAction({
        courseId: "COURSE_ID_JODI_LAGBE", 
        date,
        startTime,
        endTime,
      });

      if (result.success) {
        toast.success(result.message);
     
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to create slot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-sm bg-background">
      <h1 className="text-2xl font-bold mb-6">Create Availability Slot</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Input */}
        <div className="space-y-2">
          <Label htmlFor="date">Select Date</Label>
          <Input type="date" name="date" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
      
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input type="time" name="startTime" required />
          </div>

   
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input type="time" name="endTime" required />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Slot"}
        </Button>
      </form>
    </div>
  );
}