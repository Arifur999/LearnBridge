"use client";

import { useActionState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

import { loginAction } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
  const [state, formAction] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (!state.success) return;

    toast.success("Login successful!", { description: "Welcome back!" });

    // Decode role directly from JWT — most reliable source
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

    // Redirect to returnUrl if safe, otherwise to role dashboard
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
    <div
      className={cn(
        "flex min-h-[calc(100vh-120px)] items-center justify-center",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel>Password</FieldLabel>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input name="password" type="password" required />
              </Field>

              <Field>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Don&apos;t have an account?{" "}
                  <a href="/register" className="underline">
                    Sign up
                  </a>
                </p>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
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
