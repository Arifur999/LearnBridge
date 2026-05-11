import DashPageHeader from "@/components/layout/DashPageHeader";
import { tutorService } from "@/services/tutor.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatTime, formatDay } from "@/lib/utils";

export default async function TutorBookingsPage() {
  const result = await tutorService.getMyBookings();
  const list = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];

  return (
    <div className="space-y-6">
      <DashPageHeader title="My Bookings" description="View all session bookings from your students." />

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No bookings yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Student</th>
                <th className="px-4 py-3 text-left font-semibold">Day / Time</th>
                <th className="px-4 py-3 text-left font-semibold">Price</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((b: Record<string, unknown>, i: number) => {
                const id = String(b?.id ?? i);
                const student = b?.student as Record<string, unknown> | undefined;
                const avail = b?.availability as Record<string, unknown> | undefined;
                const status = String(b?.status ?? "PENDING").toUpperCase();
                const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
                  CONFIRMED: "default", COMPLETED: "secondary", CANCELLED: "destructive", PENDING: "outline",
                };
                return (
                  <tr key={id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{String(student?.name ?? "Student")}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {avail?.day ? formatDay(String(avail.day)) : "—"}
                      {avail?.startTime ? ` • ${formatTime(String(avail.startTime))}` : ""}
                    </td>
                    <td className="px-4 py-3">${String(b?.price ?? 0)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[status] ?? "outline"}>{status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/tutor/bookings/${id}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
