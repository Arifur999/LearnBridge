"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";

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

const initialState = {
  success: false,
  message: "",
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success("Login successful", {
        description: "Welcome back to SkillBridge",
      });

      const accessToken = state.data?.accessToken;
      if (accessToken) {
        Cookies.set("accessToken", accessToken, { expires: 7, path: "/" });
      }

      const user = state.data?.user;
      if (user) {
        Cookies.set("authUser", JSON.stringify(user), {
          expires: 7,
          path: "/",
        });
      }

      window.location.href = "/";
    }
  }, [state.data?.accessToken, state.data?.user, state.success]);

  useEffect(() => {
    if (!state.success && state.message) {
      toast.error("Login failed", {
        description: state.message,
      });
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
