import Link from "next/link";
import { XCircle, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-muted/20 px-4 py-16">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Cancel icon */}
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-red-100">
          <XCircle className="size-10 text-red-500" />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Payment Cancelled</h1>
          <p className="mt-2 text-muted-foreground">
            Your payment was cancelled and no booking was made. You can try again any time.
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-5 shadow-sm text-sm text-muted-foreground">
          No charge has been made to your card. The selected slot is still available — go back and try again if you&apos;d like to book it.
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild size="lg" className="gap-2">
            <Link href="/tutors">
              <Search className="size-4" /> Browse Tutors
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/">
              <ArrowLeft className="size-4" /> Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
