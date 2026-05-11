"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { signupAction } from "@/actions/auth.action";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState = { success: false, message: "" };

export function SignupForm(props: React.ComponentProps<typeof Card>) {
  const [state, formAction] = useActionState(signupAction, initialState);
  // Track role in state so we can pass it via hidden input (Radix Select
  // doesn't reliably populate FormData with Next.js server actions)
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
              <FieldLabel>Role</FieldLabel>
              {/* hidden input carries the actual value to FormData */}
              <input type="hidden" name="role" value={role} />
              <Select
                value={role}
                onValueChange={(v) => setRole(v as "student" | "tutor")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="tutor">Tutor</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input name="password" type="password" required />
            </Field>

            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input name="confirmPassword" type="password" required />
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
