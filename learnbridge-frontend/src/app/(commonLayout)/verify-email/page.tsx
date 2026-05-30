"use client";

import { useState, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [email,      setEmail]       = useState(searchParams.get("email") ?? "");
  const [otp,        setOtp]         = useState("");
  const [otpSent,    setOtpSent]     = useState(false);
  const [isPending,  startTransition] = useTransition();

  const sendOtp = () => {
    if (!email) { toast.error("Enter your email first"); return; }
    startTransition(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/email-otp/send-verification-otp`, {
          method:      "POST",
          headers:     { "Content-Type": "application/json" },
          body:        JSON.stringify({ email, type: "email-verification" }),
          credentials: "include",
        });
        if (res.ok) {
          setOtpSent(true);
          toast.success("OTP sent!", { description: `Check ${email}` });
        } else {
          const d = await res.json();
          toast.error(d?.message ?? "Failed to send OTP");
        }
      } catch {
        toast.error("Network error — please try again");
      }
    });
  };

  const verifyOtp = () => {
    if (!otp || otp.length < 6) { toast.error("Enter the 6-digit OTP"); return; }
    startTransition(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/email-otp/verify-email`, {
          method:      "POST",
          headers:     { "Content-Type": "application/json" },
          body:        JSON.stringify({ email, otp }),
          credentials: "include",
        });
        if (res.ok) {
          toast.success("Email verified!", { description: "You can now log in." });
          router.push("/login");
        } else {
          const d = await res.json();
          toast.error(d?.message ?? "Invalid or expired OTP");
        }
      } catch {
        toast.error("Network error — please try again");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm overflow-hidden">
        <div className={`h-1 w-full ${otpSent ? "bg-linear-to-r from-emerald-500 to-cyan-500" : "bg-linear-to-r from-primary to-violet-500"}`} />

        <CardHeader className="pb-2 pt-6 text-center">
          <div className={`mx-auto mb-3 flex size-14 items-center justify-center rounded-3xl ${otpSent ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-primary/10"}`}>
            {otpSent
              ? <ShieldCheck className="size-7 text-emerald-600 dark:text-emerald-400" />
              : <Mail        className="size-7 text-primary" />
            }
          </div>
          <h2 className="text-xl font-black tracking-tight">
            {otpSent ? "Enter OTP" : "Verify your email"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {otpSent
              ? `We sent a 6-digit code to ${email}`
              : "Enter your email to receive a verification code"
            }
          </p>
        </CardHeader>

        <CardContent className="space-y-4 pb-6">
          {!otpSent ? (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <Button onClick={sendOtp} disabled={isPending} className="w-full rounded-xl">
                {isPending ? <><Loader2 className="mr-2 size-4 animate-spin" /> Sending…</> : "Send OTP"}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  6-digit OTP
                </label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-2xl font-black tracking-[0.5em]"
                />
              </div>
              <Button
                onClick={verifyOtp}
                disabled={isPending || otp.length < 6}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isPending ? <><Loader2 className="mr-2 size-4 animate-spin" /> Verifying…</> : "Verify Email"}
              </Button>
              <button
                onClick={() => { setOtpSent(false); setOtp(""); }}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
              >
                Resend OTP
              </button>
            </>
          )}

          <button
            onClick={() => router.push("/login")}
            className="flex w-full items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3" /> Back to login
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailInner />
    </Suspense>
  );
}
