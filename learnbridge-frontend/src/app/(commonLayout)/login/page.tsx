"use client";

import { useFormState } from "react-dom";
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
  FieldDescription,
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
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password to login
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input name="email" type="email" required />
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input name="password" type="password" required />
              </Field>

              {state?.message && (
                <FieldDescription
                  className={cn(
                    "text-center",
                    state.success ? "text-green-600" : "text-red-500"
                  )}
                >
                  {state.message}
                </FieldDescription>
              )}

              <Field>
                <Button type="submit">Login</Button>

                <Button variant="outline" type="button" disabled>
                  Login with Google
                </Button>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <a href="/register" className="underline">
                    Sign up
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
