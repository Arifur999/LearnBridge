"use client";

import { useActionState, useEffect, useState, Suspense } from "react";
import { toast } from "sonner";
import Link from "next/link";

import { signupAction } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const initialState = { success: false, message: "" };

function SignupFormInner({ className, ...props }: React.ComponentProps<"div">) {
  const [state, formAction, isPending] = useActionState(signupAction, initialState);
  const [role, setRole] = useState<"student" | "tutor">("student");

  useEffect(() => {
    if (!state.success) return;
    toast.success("Account created!", {
      description: "Please log in with your credentials.",
    });
    window.location.href = "/login";
  }, [state.success]);

  useEffect(() => {
    if (!state.success && state.message) {
      toast.error("Signup failed", { description: state.message });
    }
  }, [state.success, state.message]);

  return (
    <div className={cn("w-full max-w-md", className)} {...props}>
      {/* Glass card */}
      <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-2xl">

        {/* Card header */}
        <div className="border-b border-white/10 px-8 py-5">
          <h2 className="text-xl font-black tracking-tight text-white">
            Create account
          </h2>
          <p className="mt-0.5 text-sm text-white/55">
            Join LearnBridge and start learning today
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="px-8 py-5">

          {/* Name + Email row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
                Full Name
              </label>
              <Input
                name="name"
                type="text"
                placeholder="Your name"
                required
                className="border-white/20 bg-white/10 text-white placeholder:text-white/35 focus-visible:border-primary focus-visible:ring-primary/30 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
                Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="border-white/20 bg-white/10 text-white placeholder:text-white/35 focus-visible:border-primary focus-visible:ring-primary/30 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Role */}
          <div className="mt-3 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
              I am a
            </label>
            <input type="hidden" name="role" value={role} />
            <Select
              value={role}
              onValueChange={(v) => setRole(v as "student" | "tutor")}
            >
              <SelectTrigger className="w-full border-white/20 bg-white/10 text-white focus:border-primary focus:ring-primary/30 backdrop-blur-sm [&>span]:text-white/90 [&_svg]:text-white/60">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="tutor">Tutor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password + Confirm row */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••••"
                required
                className="border-white/20 bg-white/10 text-white placeholder:text-white/35 focus-visible:border-primary focus-visible:ring-primary/30 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
                Confirm
              </label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="••••••••••"
                required
                className="border-white/20 bg-white/10 text-white placeholder:text-white/35 focus-visible:border-primary focus-visible:ring-primary/30 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="mt-5 w-full rounded-xl bg-primary font-semibold tracking-wide hover:bg-primary/90"
          >
            {isPending ? "Creating account…" : "Create Account"}
          </Button>

          {/* Divider */}
          <div className="mt-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/15" />
            <span className="text-xs text-white/35">or</span>
            <div className="h-px flex-1 bg-white/15" />
          </div>

          {/* Login link */}
          <p className="mt-4 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-white underline-offset-4 hover:text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Suspense fallback={null}>
      <SignupFormInner className={className} {...props} />
    </Suspense>
  );
}
