"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { verifyEmailOTPAction, sendVerificationOTPAction } from "@/actions/auth.action";
import { MailCheck, RefreshCw, ArrowRight } from "lucide-react";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get("email") ?? "";

  const [email, setEmail]       = useState(prefillEmail);
  const [otp, setOtp]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess]   = useState(false);

  useEffect(() => {
    if (prefillEmail) setEmail(prefillEmail);
  }, [prefillEmail]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || otp.length < 6) return;
    setLoading(true);
    const res = await verifyEmailOTPAction(email.trim(), otp.trim());
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      toast.success("Email verified!", { description: "Redirecting to your dashboard…" });
      window.location.href = "/student";
    } else {
      toast.error("Verification failed", { description: res.message });
    }
  };

  const handleResend = async () => {
    if (!email) { toast.error("Enter your email first"); return; }
    setResending(true);
    const res = await sendVerificationOTPAction(email.trim());
    setResending(false);
    if (res.success) {
      toast.success("OTP sent!", { description: "Check your email for a new code." });
    } else {
      toast.error("Failed to resend", { description: res.message });
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-2xl">
        <div className="border-b border-white/10 px-8 py-7">
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/20">
            <MailCheck className="size-6 text-primary" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">Verify your email</h2>
          <p className="mt-1 text-sm text-white/55">
            Enter the 6-digit code sent to your email address
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5 px-8 py-7">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="border-white/20 bg-white/10 text-white placeholder:text-white/35 focus-visible:border-primary focus-visible:ring-primary/30 backdrop-blur-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
              Verification Code
            </label>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              required
              className="border-white/20 bg-white/10 text-center text-2xl font-black tracking-[0.4em] text-white placeholder:text-white/35 placeholder:tracking-normal focus-visible:border-primary focus-visible:ring-primary/30 backdrop-blur-sm"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || success || otp.length < 6}
            className="mt-2 w-full rounded-xl bg-primary font-semibold tracking-wide hover:bg-primary/90 gap-2"
          >
            {loading ? "Verifying…" : success ? "Verified!" : (
              <>Verify Email <ArrowRight className="size-4" /></>
            )}
          </Button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="flex w-full items-center justify-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80 disabled:opacity-40"
          >
            <RefreshCw className={`size-3.5 ${resending ? "animate-spin" : ""}`} />
            {resending ? "Sending…" : "Resend verification code"}
          </button>

          <p className="text-center text-sm text-white/50">
            Already verified?{" "}
            <Link href="/login" className="font-semibold text-white underline-offset-4 hover:text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      <Image
        src="/front-view-stacked-books-earth-globe-with-graduation-cap-education-day_742418-47637.jpg"
        alt="Learning environment"
        fill sizes="100vw"
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-zinc-950/55" />
      <div className="absolute inset-0 bg-linear-to-r from-zinc-950/80 via-zinc-950/40 to-zinc-950/70" />

      <div className="relative flex min-h-screen flex-col lg:flex-row">
        <div className="flex flex-col justify-between p-8 sm:p-12 lg:w-[55%] lg:p-16 lg:pb-20">
          <Link href="/" className="inline-flex">
            <Image src="/logo.png" alt="LearnBridge" width={120} height={48} className="object-contain drop-shadow-lg" />
          </Link>
          <div className="hidden lg:block">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-primary/80">One step away</p>
            <h1 className="mb-5 text-6xl font-black uppercase leading-[0.92] tracking-tight text-white xl:text-7xl">
              CONFIRM<br />YOUR<br />EMAIL
            </h1>
            <p className="max-w-xs text-base leading-relaxed text-white/65">
              We sent a 6-digit code to your email. Enter it to activate your account and start learning.
            </p>
          </div>
          <p className="hidden text-xs text-white/30 lg:block">© {new Date().getFullYear()} LearnBridge. All rights reserved.</p>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10 lg:w-[45%] lg:shrink-0">
          <Suspense fallback={null}>
            <VerifyEmailForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
