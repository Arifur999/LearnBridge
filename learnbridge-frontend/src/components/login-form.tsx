"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/actions/auth.action";

const initialState = {
  success: false,
  message: "",
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [state, formAction] = useFormState(
    loginAction,
    initialState
  );


  useEffect(() => {
    if (state.success) {
      toast.success("Login successful 🎉", {
        description: "Welcome back to LearnBridge",
      });


      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-change"));
      }


      router.refresh();
      router.replace("/");
    }
  }, [state.success, router]);

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
                <Input
                  name="password"
                  type="password"
                  required
                />
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