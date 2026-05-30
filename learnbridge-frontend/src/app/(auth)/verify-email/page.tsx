"use client";

import { useState, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [email,       setEmail]       = useState(searchParams.get("email") ?? "");
  const [otp,         setOtp]         = useState("");
  const [otpSent,     setOtpSent]     = useState(false);
  const [isPending,   startTransition] = useTransition();

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
          toast.error(d?.message ?? "Invalid OTP");
        }
      } catch {
        toast.error("Network error — please try again");
      }
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      <Image
        src="/front-view-stacked-books-earth-globe-with-graduation-cap-education-day_742418-47637.jpg"
        alt="Learning environment"
        fill sizes="100vw"
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-zinc-950/60" />
      <div className="absolute inset-0 bg-linear-to-r from-zinc-950/80 via-zinc-950/40 to-zinc-950/70" />

      <div className="relative flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-2xl">

            {/* Header */}
            <div className="border-b border-white/10 px-8 py-7">
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/20">
                {otpSent
                  ? <ShieldCheck className="size-6 text-primary" />
                  : <Mail className="size-6 text-primary" />
                }
              </div>
              <h2 className="text-xl font-black tracking-tight text-white">
                {otpSent ? "Enter OTP" : "Verify your email"}
              </h2>
              <p className="mt-1 text-sm text-white/55">
                {otpSent
                  ? `We sent a 6-digit code to ${email}`
                  : "Enter your email to receive a verification code"
                }
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4 px-8 py-7">
              {!otpSent ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="border-white/20 bg-white/10 text-white placeholder:text-white/35 focus-visible:border-primary backdrop-blur-sm"
                    />
                  </div>
                  <Button
                    onClick={sendOtp}
                    disabled={isPending}
                    className="w-full rounded-xl bg-primary font-semibold"
                  >
                    {isPending ? <><Loader2 className="mr-2 size-4 animate-spin" /> Sending…</> : "Send OTP"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
                      6-digit OTP
                    </label>
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="123456"
                      maxLength={6}
                      className="border-white/20 bg-white/10 text-center text-2xl font-black tracking-[0.5em] text-white placeholder:text-white/35 focus-visible:border-primary backdrop-blur-sm"
                    />
                  </div>
                  <Button
                    onClick={verifyOtp}
                    disabled={isPending || otp.length < 6}
                    className="w-full rounded-xl bg-primary font-semibold"
                  >
                    {isPending ? <><Loader2 className="mr-2 size-4 animate-spin" /> Verifying…</> : "Verify Email"}
                  </Button>
                  <button
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs text-white/50 hover:text-white"
                  >
                    Resend OTP
                  </button>
                </>
              )}

              <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 text-xs text-white/50 hover:text-white"
              >
                <ArrowLeft className="size-3" /> Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
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
