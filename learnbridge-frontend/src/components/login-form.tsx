"use client";

import { useActionState, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { loginAction } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function getDashboardForRole(role: string): string {
  switch (role.toUpperCase()) {
    case "ADMIN":   return "/admin/analytics";
    case "TUTOR":
    case "TRAINER": return "/tutor/dashboard";
    default:        return "/student";
  }
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

const initialState = { success: false, message: "" };

function LoginFormInner({ className, ...props }: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/sign-in/social`, {
        method:      "POST",
        headers:     { "Content-Type": "application/json" },
        body:        JSON.stringify({
          provider:    "google",
          callbackURL: `${window.location.origin}/`,
        }),
        credentials: "include",
      });
      const data = await res.json();
      const redirectUrl = data?.url ?? data?.redirectURL ?? data?.redirect;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        toast.error("Google login failed — no redirect URL");
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Google login failed");
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (!state.success) return;
    toast.success("Login successful!", { description: "Welcome back!" });
    const role = state.data?.user?.role ?? "student";
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
      <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-2xl">
        <div className="border-b border-white/10 px-8 py-7">
          <h2 className="text-xl font-black tracking-tight text-white">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-white/55">
            Sign in to your LearnBridge account
          </p>
        </div>

        <form action={formAction} className="space-y-5 px-8 py-7">
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
                Password
              </label>
              <a href="#" className="text-xs text-white/50 transition-colors hover:text-white">
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

          <Button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-xl bg-primary font-semibold tracking-wide hover:bg-primary/90"
          >
            {isPending ? "Signing in…" : "Sign In"}
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/15" />
            <span className="text-xs text-white/35">or</span>
            <div className="h-px flex-1 bg-white/15" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 disabled:opacity-60"
          >
            {googleLoading ? (
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : (
              <svg className="size-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

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
