"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const router = useRouter();

  const [state, formAction] = useFormState(
    signupAction,
    initialState
  );


  useEffect(() => {
    if (state.success) {
      toast.success("Account created successfully 🎉", {
        description: "You can now login with your credentials",
      });

      router.replace("/");
    }
  }, [state.success, router]);

 
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

              <Button
                variant="outline"
                type="button"
                disabled
                className="w-full"
              >
                Sign up with Google
              </Button>

              <p className="text-center text-sm text-muted-foreground">
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
