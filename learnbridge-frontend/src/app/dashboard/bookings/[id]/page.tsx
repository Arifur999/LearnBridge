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

export default async function BookingDetailPage({
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
  const subject = booking?.subject as Record<string, unknown> | undefined;
  const review = booking?.review as Record<string, unknown> | undefined;
  const status = String(booking?.status ?? "").toUpperCase();

  const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    CONFIRMED: "default", COMPLETED: "secondary", CANCELLED: "destructive", PENDING: "outline",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/bookings">
            <ArrowLeft className="mr-2 size-4" /> Back
          </Link>
        </Button>
      </div>
      <DashPageHeader title="Booking Details" description="Details about your tutor session." />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Session Info</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={statusVariant[status] ?? "outline"}>{status}</Badge>
            </div>
            {avail?.day != null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Day</span>
                <span className="font-medium">{formatDay(String(avail.day))}</span>
              </div>
            )}
            {avail?.startTime != null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">
                  {formatTime(String(avail.startTime))}
                  {avail?.endTime != null ? ` – ${formatTime(String(avail.endTime))}` : ""}
                </span>
              </div>
            )}
            {booking?.price != null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-semibold">${String(booking.price)}</span>
              </div>
            )}
            {booking?.completedAt != null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed</span>
                <span>{formatDate(String(booking.completedAt))}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tutor</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {tutorUser?.name != null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{String(tutorUser.name)}</span>
              </div>
            )}
            {tutorUser?.email != null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span>{String(tutorUser.email)}</span>
              </div>
            )}
            {subject?.name != null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subject</span>
                <span className="font-medium">{String(subject.name)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {review && (
          <Card className="md:col-span-2">
            <CardHeader><CardTitle>Your Review</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p className="font-medium">Rating: {String(review.rating)}/5</p>
              <p className="mt-1 text-muted-foreground">{String(review.review ?? review.comment ?? "")}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
