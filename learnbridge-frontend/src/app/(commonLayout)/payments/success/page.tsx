import Link from "next/link";
import { CheckCircle2, Calendar, Clock, User, LayoutDashboard, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ tutorName?: string; price?: string; date?: string; startTime?: string; endTime?: string }>;
}) {
  const params = await searchParams;
  const tutorName = params.tutorName ?? "your tutor";
  const price = params.price ?? "0";
  const date = params.date ?? "";
  const startTime = params.startTime ?? "";
  const endTime = params.endTime ?? "";

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-muted/20 px-4 py-16">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Success icon */}
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="size-10 text-emerald-600" />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Payment Successful!</h1>
          <p className="mt-2 text-muted-foreground">
            Your session with <span className="font-semibold text-foreground">{tutorName}</span> has been booked and confirmed.
          </p>
        </div>

        {/* Booking details card */}
        <div className="rounded-2xl border bg-background p-5 shadow-sm text-left space-y-3">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Booking Details</p>

          <div className="flex items-center gap-3 text-sm">
            <User className="size-4 shrink-0 text-primary" />
            <span className="text-muted-foreground">Tutor:</span>
            <span className="font-medium">{tutorName}</span>
          </div>

          {date && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="size-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{new Date(date).toDateString()}</span>
            </div>
          )}

          {startTime && endTime && (
            <div className="flex items-center gap-3 text-sm">
              <Clock className="size-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">{startTime} – {endTime}</span>
            </div>
          )}

          <div className="border-t pt-3 flex justify-between text-sm font-bold">
            <span>Amount Paid</span>
            <span className="text-primary">BDT {price}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button asChild size="lg" className="gap-2">
            <Link href="/student/bookings">
              <BookOpen className="size-4" /> View My Bookings
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/student">
              <LayoutDashboard className="size-4" /> Go to Dashboard
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          A confirmation has been recorded in your dashboard. You can manage or cancel from your bookings page.
        </p>
      </div>
    </div>
  );
}
