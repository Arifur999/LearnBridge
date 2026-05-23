"use client";

import { useActionState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

import { loginAction } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DecodedToken {
  role?: string;
}

function getDashboardForRole(role: string): string {
  switch (role.toUpperCase()) {
    case "ADMIN":      return "/admin/analytics";
    case "TUTOR":
    case "TRAINER":    return "/tutor/dashboard";
    case "INSTITUTE":  return "/institute/dashboard";
    case "MENTOR":     return "/mentor/dashboard";
    case "MODERATOR":  return "/moderator/dashboard";
    default:           return "/dashboard";
  }
}

const initialState = { success: false, message: "" };

function LoginFormInner({ className, ...props }: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (!state.success) return;
    toast.success("Login successful!", { description: "Welcome back!" });

    let role = "student";
    const token = state.data?.accessToken;
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        role = decoded.role ?? "student";
      } catch {
        role = state.data?.user?.role ?? "student";
      }
    } else {
      role = state.data?.user?.role ?? "student";
    }

    const returnUrl = searchParams.get("returnUrl");
    if (returnUrl && returnUrl.startsWith("/") && !returnUrl.startsWith("//")) {
      window.location.href = returnUrl;
    } else {
      window.location.href = getDashboardForRole(role);
    }
  }, [state.success]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!state.success && state.message) {
      toast.error("Login failed", { description: state.message });
    }
  }, [state.success, state.message]);

  return (
    <div className={cn("w-full max-w-sm", className)} {...props}>
      {/* Glass card */}
      <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-2xl">

        {/* Card header */}
        <div className="border-b border-white/10 px-8 py-7">
          <h2 className="text-xl font-black tracking-tight text-white">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-white/55">
            Sign in to your LearnBridge account
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-5 px-8 py-7">

          {/* Email */}
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

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
                Password
              </label>
              <a
                href="#"
                className="text-xs text-white/50 transition-colors hover:text-white"
              >
                Forgot password?
              </a>
            </div>
            <Input
              name="password"
              type="password"
              placeholder="••••••••••"
              required
              className="border-white/20 bg-white/10 text-white placeholder:text-white/35 focus-visible:border-primary focus-visible:ring-primary/30 backdrop-blur-sm"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-xl bg-primary font-semibold tracking-wide hover:bg-primary/90"
          >
            {isPending ? "Signing in…" : "Sign In"}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/15" />
            <span className="text-xs text-white/35">or</span>
            <div className="h-px flex-1 bg-white/15" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-white/50">
            New to LearnBridge?{" "}
            <Link
              href="/register"
              className="font-semibold text-white underline-offset-4 hover:text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Suspense fallback={null}>
      <LoginFormInner className={className} {...props} />
    </Suspense>
  );
}
