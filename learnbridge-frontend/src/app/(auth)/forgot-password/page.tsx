"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { forgotPasswordAction, resetPasswordAction } from "@/actions/auth.action";
import { KeyRound, ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep]             = useState<"email" | "reset">("email");
  const [email, setEmail]           = useState("");
  const [otp, setOtp]               = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPwd, setShowPwd]       = useState(false);
  const [loading, setLoading]       = useState(false);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const res = await forgotPasswordAction(email.trim());
    setLoading(false);
    if (res.success) {
      toast.success("Reset code sent!", { description: "Check your email for the 6-digit code." });
      setStep("reset");
    } else {
      toast.error("Failed", { description: res.message });
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    if (otp.length < 6) { toast.error("Enter the 6-digit code from your email"); return; }
    setLoading(true);
    const res = await resetPasswordAction(otp.trim(), password);
    setLoading(false);
    if (res.success) {
      toast.success("Password updated!", { description: "You can now sign in with your new password." });
      window.location.href = "/login";
    } else {
      toast.error("Reset failed", { description: res.message });
    }
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
      <div className="absolute inset-0 bg-zinc-950/55" />
      <div className="absolute inset-0 bg-linear-to-r from-zinc-950/80 via-zinc-950/40 to-zinc-950/70" />

      <div className="relative flex min-h-screen flex-col lg:flex-row">
        {/* Left panel */}
        <div className="flex flex-col justify-between p-8 sm:p-12 lg:w-[55%] lg:p-16 lg:pb-20">
          <Link href="/" className="inline-flex">
            <Image src="/logo.png" alt="LearnBridge" width={120} height={48} className="object-contain drop-shadow-lg" />
          </Link>
          <div className="hidden lg:block">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-primary/80">Account recovery</p>
            <h1 className="mb-5 text-6xl font-black uppercase leading-[0.92] tracking-tight text-white xl:text-7xl">
              RESET<br />YOUR<br />PASSWORD
            </h1>
            <p className="max-w-xs text-base leading-relaxed text-white/65">
              Enter your email to receive a reset code. Then set a new password to regain access to your account.
            </p>
          </div>
          <p className="hidden text-xs text-white/30 lg:block">© {new Date().getFullYear()} LearnBridge. All rights reserved.</p>
        </div>

        {/* Right panel — form */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:w-[45%] lg:shrink-0">
          <div className="w-full max-w-sm">
            <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-2xl">
              <div className="border-b border-white/10 px-8 py-7">
                <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/20">
                  <KeyRound className="size-6 text-primary" />
                </div>
                <h2 className="text-xl font-black tracking-tight text-white">
                  {step === "email" ? "Forgot password?" : "Set new password"}
                </h2>
                <p className="mt-1 text-sm text-white/55">
                  {step === "email"
                    ? "Enter your email and we'll send a reset code"
                    : `Enter the code sent to ${email} and choose a new password`}
                </p>
              </div>

              {step === "email" ? (
                <form onSubmit={handleRequestOTP} className="space-y-5 px-8 py-7">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="border-white/20 bg-white/10 text-white placeholder:text-white/35 focus-visible:border-primary focus-visible:ring-primary/30 backdrop-blur-sm"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full rounded-xl bg-primary font-semibold tracking-wide hover:bg-primary/90 gap-2"
                  >
                    {loading ? "Sending…" : <><span>Send reset code</span><ArrowRight className="size-4" /></>}
                  </Button>
                  <p className="text-center text-sm text-white/50">
                    Remember your password?{" "}
                    <Link href="/login" className="font-semibold text-white underline-offset-4 hover:text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleReset} className="space-y-4 px-8 py-7">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Reset Code</label>
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

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">New Password</label>
                    <div className="relative">
                      <Input
                        type={showPwd ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••"
                        required
                        className="border-white/20 bg-white/10 pr-10 text-white placeholder:text-white/35 focus-visible:border-primary focus-visible:ring-primary/30 backdrop-blur-sm"
                      />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                        {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Confirm Password</label>
                    <Input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••••"
                      required
                      className="border-white/20 bg-white/10 text-white placeholder:text-white/35 focus-visible:border-primary focus-visible:ring-primary/30 backdrop-blur-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-primary font-semibold tracking-wide hover:bg-primary/90 gap-2"
                  >
                    {loading ? "Resetting…" : <><span>Reset password</span><ArrowRight className="size-4" /></>}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="flex w-full items-center justify-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
                  >
                    <ArrowLeft className="size-3.5" /> Use a different email
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
