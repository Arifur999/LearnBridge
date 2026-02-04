"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";

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
import { signupAction } from "@/actions/auth.action";

const initialState = {
  success: false,
  message: "",
};

export function SignupForm(props: React.ComponentProps<typeof Card>) {
  const [state, formAction] = useActionState(
    signupAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Account created successfully 🎉", {
        description: "You can now login with your credentials",
      });

      const accessToken = state.data?.accessToken;
      if (accessToken) {
        Cookies.set("accessToken", accessToken, { expires: 7, path: "/" });
      }

      const user =
        state.data?.user ??
        state.data?.data?.user ??
        state.data?.data?.data?.user;
      if (user) {
        Cookies.set("authUser", JSON.stringify(user), {
          expires: 7,
          path: "/",
        });
      }

      window.location.href = "/";
    }
  }, [state.success]);

  useEffect(() => {
    if (!state.success && state.message) {
      toast.error("Signup failed", {
        description: state.message,
      });
    }
  }, [state.success, state.message]);

  return (
    <Card className="w-full" {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel>Full Name</FieldLabel>
              <Input name="name" type="text" required />
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input name="email" type="email" required />
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input name="password" type="password" required />
            </Field>

            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input
                name="confirmPassword"
                type="password"
                required
              />
            </Field>

            <Field>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <a href="/login" className="underline">
                  Sign in
                </a>
              </p>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
