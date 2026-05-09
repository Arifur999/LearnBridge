import { getTutorSlotsAction } from "@/actions/dashboard.action";
import AvailabilityManager from "./AvailabilityManager";

export default async function TutorAvailabilityPage() {
  const rawSlots = await getTutorSlotsAction();

  const slots = rawSlots.map((slot) => ({
    id: String(slot.id ?? slot._id ?? ""),
    date: String(slot.date ?? ""),
    startTime: String(slot.startTime ?? ""),
    endTime: String(slot.endTime ?? ""),
    isBooked: Boolean(slot.isBooked),
  }));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Availability</h1>
        <p className="text-muted-foreground">
          Add time slots that students can book instantly.
        </p>
      </div>
      <AvailabilityManager initialSlots={slots} />
    </div>
  );
}
