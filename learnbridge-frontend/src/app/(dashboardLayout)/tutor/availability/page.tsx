import { getTutorSlotsAction } from "@/actions/dashboard.action";
import AvailabilityManager from "./AvailabilityManager";
import { Calendar, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function TutorAvailabilityPage() {
  const rawSlots = await getTutorSlotsAction();

  const slots = rawSlots.map((slot) => ({
    id: String(slot.id ?? slot._id ?? ""),
    date: String(slot.date ?? ""),
    startTime: String(slot.startTime ?? ""),
    endTime: String(slot.endTime ?? ""),
    isBooked: Boolean(slot.isBooked),
  }));

  const total     = slots.length;
  const available = slots.filter((s) => !s.isBooked).length;
  const booked    = slots.filter((s) => s.isBooked).length;

  const stats = [
    { label: "Total Slots",  value: total,     icon: Calendar,     bg: "bg-primary/10",                          color: "text-primary",                          bar: "bg-primary",     barW: "100%" },
    { label: "Available",    value: available, icon: CheckCircle2, bg: "bg-emerald-100 dark:bg-emerald-900/30",  color: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", barW: total > 0 ? `${Math.round((available / total) * 100)}%` : "0%" },
    { label: "Booked",       value: booked,    icon: Clock,        bg: "bg-amber-100 dark:bg-amber-900/30",      color: "text-amber-600 dark:text-amber-400",    bar: "bg-amber-500",   barW: total > 0 ? `${Math.round((booked / total) * 100)}%` : "0%" },
  ];

  return (
    <div className="space-y-6">

      
      <div>
        <h1 className="text-2xl font-black tracking-tight">Availability</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add time slots that students can book instantly
        </p>
      </div>

      
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-primary via-emerald-500 to-amber-500" />
        <CardContent className="p-0">
          <div className="grid divide-y sm:divide-x sm:divide-y-0 sm:grid-cols-3">
            {stats.map(({ label, value, icon: Icon, bg, color, bar, barW }) => (
              <div key={label} className="flex flex-col gap-3 p-5 transition-colors hover:bg-muted/40">
                <div className="flex items-start justify-between">
                  <div className={`flex size-9 items-center justify-center rounded-2xl ${bg}`}>
                    <Icon className={`size-4 ${color}`} />
                  </div>
                  <span className="text-2xl font-black tabular-nums">{value}</span>
                </div>
                <p className="text-sm font-semibold">{label}</p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${bar}`} style={{ width: barW }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AvailabilityManager initialSlots={slots} />
    </div>
  );
}
