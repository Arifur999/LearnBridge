import { updateAvailabilityAction } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TutorAvailabilityPage() {
  async function saveAvailability(formData: FormData) {
    "use server";
    await updateAvailabilityAction(formData);
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Availability</h1>
        <p className="text-muted-foreground">
          Add time slots students can book instantly.
        </p>
      </div>

      <form action={saveAvailability} className="space-y-4 rounded-lg border p-6">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start time</Label>
            <Input id="startTime" name="startTime" type="time" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End time</Label>
            <Input id="endTime" name="endTime" type="time" required />
          </div>
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          Save Availability
        </Button>
      </form>
    </div>
  );
}
