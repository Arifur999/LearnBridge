"use client";

import { useFormState } from "react-dom";
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
  FieldDescription,
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
  const [state, formAction] = useFormState(
    signupAction,
    initialState
  );

  return (
    <Card {...props}>
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
              <Input name="confirmPassword" type="password" required />
            </Field>

            {state.message && (
              <FieldDescription
                className={
                  state.success
                    ? "text-green-600 text-center"
                    : "text-red-500 text-center"
                }
              >
                {state.message}
              </FieldDescription>
            )}

            <Field>
              <Button type="submit">Create Account</Button>
              <Button variant="outline" type="button" disabled>
                Sign up with Google
              </Button>

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <a href="/login" className="underline">
                  Sign in
                </a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
