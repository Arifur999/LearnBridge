import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashPageHeader from "@/components/layout/DashPageHeader";
import { formatTime, formatDay, formatDate } from "@/lib/utils";
import { getAuthHeaders } from "@/services/auth.server";
import { API_V1_URL } from "@/lib/config";

async function getBooking(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/bookings/${id}`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data ?? data ?? null;
  } catch {
    return null;
  }
}

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBooking(id) as Record<string, unknown> | null;
  if (!booking) notFound();

  const avail = booking?.availability as Record<string, unknown> | undefined;
  const tutor = booking?.tutor as Record<string, unknown> | undefined;
  const tutorUser = tutor?.user as Record<string, unknown> | undefined;
  const student = booking?.student as Record<string, unknown> | undefined;
  const status = String(booking?.status ?? "").toUpperCase();

  const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    CONFIRMED: "default", COMPLETED: "secondary", CANCELLED: "destructive", PENDING: "outline",
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/admin/bookings"><ArrowLeft className="mr-2 size-4" /> Back</Link>
      </Button>
      <DashPageHeader title="Booking Details" description={`Booking ID: ${id}`} />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Session</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant={statusVariant[status] ?? "outline"}>{status}</Badge></div>
            {avail?.day != null && <div className="flex justify-between"><span className="text-muted-foreground">Day</span><span>{formatDay(String(avail.day))}</span></div>}
            {avail?.startTime != null && <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span>{formatTime(String(avail.startTime))}{avail.endTime != null ? ` – ${formatTime(String(avail.endTime))}` : ""}</span></div>}
            {booking?.price != null && <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span className="font-semibold">${String(booking.price)}</span></div>}
            {booking?.completedAt != null && <div className="flex justify-between"><span className="text-muted-foreground">Completed</span><span>{formatDate(String(booking.completedAt))}</span></div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Student</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {student?.name != null && <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{String(student.name)}</span></div>}
            {student?.email != null && <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{String(student.email)}</span></div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tutor</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {tutorUser?.name != null && <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{String(tutorUser.name)}</span></div>}
            {tutorUser?.email != null && <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{String(tutorUser.email)}</span></div>}
            {tutor?.hourlyRate != null && <div className="flex justify-between"><span className="text-muted-foreground">Rate</span><span>${String(tutor.hourlyRate)}/hr</span></div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
