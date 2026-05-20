"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Lock, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { chargeCardAction, bookAndPayAction } from "@/actions/booking.action";

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

function CheckoutInner() {
  const router = useRouter();
  const params = useSearchParams();

  const slotId = params.get("slotId") ?? "";
  const tutorName = params.get("tutorName") ?? "Tutor";
  const price = params.get("price") ?? "0";
  const date = params.get("date") ?? "";
  const startTime = params.get("startTime") ?? "";
  const endTime = params.get("endTime") ?? "";

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isStripeLoading, setIsStripeLoading] = useState(false);

  const priceNum = parseFloat(price);

  if (!slotId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-semibold">Invalid payment session.</p>
        <Button asChild variant="outline">
          <Link href="/tutors">Back to Tutors</Link>
        </Button>
      </div>
    );
  }

  if (priceNum <= 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-semibold text-destructive">Session price not set</p>
        <p className="text-sm text-muted-foreground">
          This tutor has not set their hourly rate yet. Please contact them or choose another tutor.
        </p>
        <Button asChild variant="outline">
          <Link href="/tutors">Back to Tutors</Link>
        </Button>
      </div>
    );
  }

  const handleStripePay = async () => {
    setIsStripeLoading(true);
    const result = await bookAndPayAction(slotId);
    if (!result.success) {
      toast.error(result.message ?? "Payment setup failed.");
      setIsStripeLoading(false);
      return;
    }
    window.location.href = result.stripeUrl;
  };

  const handlePay = () => {
    const rawCard = cardNumber.replace(/\s/g, "");

    if (!name.trim()) {
      toast.error("Please enter the name on card.");
      return;
    }
    if (rawCard.length < 16) {
      toast.error("Card number must be 16 digits.");
      return;
    }
    if (expiry.length < 5) {
      toast.error("Please enter a valid expiry date (MM/YY).");
      return;
    }

    // Parse and validate expiry MM/YY
    const [expMonthStr, expYearStr] = expiry.split("/");
    const expMonth = Number(expMonthStr);
    const expYear = 2000 + Number(expYearStr);

    if (expMonth < 1 || expMonth > 12) {
      toast.error("Invalid expiry month.");
      return;
    }
    const now = new Date();
    const cardExpiry = new Date(expYear, expMonth - 1 + 1, 0); // last day of expiry month
    if (cardExpiry < now) {
      toast.error("Your card has expired. Please use a card with a future expiry date.");
      return;
    }

    if (cvv.length < 3) {
      toast.error("CVV must be at least 3 digits.");
      return;
    }

    startTransition(async () => {
      const result = await chargeCardAction({
        slotId,
        cardNumber: rawCard,
        expMonth,
        expYear,
        cvc: cvv,
      });

      if (result.success) {
        router.push(
          `/payments/success?tutorName=${encodeURIComponent(tutorName)}&price=${price}&date=${encodeURIComponent(date)}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`
        );
      } else {
        toast.error(result.message ?? "Payment failed. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Link
          href="/tutors"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to Tutors
        </Link>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Payment Form — 3 cols */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <CreditCard className="size-5 text-primary" />
                <h2 className="text-lg font-bold">Payment Details</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name on Card</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="card">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="card"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      disabled={isPending}
                      className="pr-12"
                    />
                    <CreditCard className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      disabled={isPending}
                    />
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handlePay}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" />
                      Pay BDT {price}
                    </>
                  )}
                </Button>

                <Button size="lg" variant="ghost" className="w-full" asChild disabled={isPending}>
                  <Link href="/payments/cancel">Cancel</Link>
                </Button>

                <div className="relative flex items-center gap-3 py-1">
                  <div className="flex-1 border-t" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="flex-1 border-t" />
                </div>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 border-[#635bff] text-[#635bff] hover:bg-[#635bff]/5"
                  onClick={handleStripePay}
                  disabled={isPending || isStripeLoading}
                  type="button"
                >
                  {isStripeLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <svg className="size-4" viewBox="0 0 28 28" fill="none">
                      <path d="M13.986 0C6.262 0 0 6.262 0 13.986c0 7.725 6.262 13.987 13.986 13.987 7.725 0 13.987-6.262 13.987-13.987C27.973 6.262 21.711 0 13.986 0z" fill="#635bff"/>
                      <path d="M12.508 11.26c0-.682.56-1.036 1.398-1.036.73 0 1.42.17 2.07.456V8.37a7.87 7.87 0 00-2.07-.271c-2.134 0-3.554 1.116-3.554 2.98 0 2.91 4.004 2.444 4.004 3.696 0 .806-.7 1.064-1.584 1.064-.9 0-1.756-.234-2.538-.62v2.36c.838.362 1.684.51 2.538.51 2.194 0 3.698-1.084 3.698-2.974 0-3.138-4.018-2.58-4.018-3.856h.056z" fill="#fff"/>
                    </svg>
                  )}
                  Pay with Stripe
                </Button>
              </div>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3" /> Payments are secured with 256-bit SSL encryption.
            </p>
          </div>

          {/* Order Summary — 2 cols */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <h3 className="mb-4 font-semibold">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="rounded-xl bg-primary/5 p-4">
                  <p className="font-medium text-primary">{tutorName}</p>
                  <p className="mt-1 text-muted-foreground">1-on-1 Tutoring Session</p>
                  {date && (
                    <p className="mt-1 text-muted-foreground">{new Date(date).toDateString()}</p>
                  )}
                  {startTime && endTime && (
                    <p className="text-muted-foreground">{startTime} – {endTime}</p>
                  )}
                </div>

                <div className="space-y-2 border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session fee</span>
                    <span>BDT {price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform fee</span>
                    <span className="text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">BDT {price}</span>
                  </div>
                </div>

                <div className="space-y-1.5 border-t pt-3">
                  {[
                    "Instant booking confirmation",
                    "Manage from your dashboard",
                    "Leave a review after session",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="size-3.5 shrink-0 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutContent() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <CheckoutInner />
    </Suspense>
  );
}
