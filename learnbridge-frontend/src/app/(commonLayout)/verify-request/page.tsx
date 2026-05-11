import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailOpen } from "lucide-react";

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <MailOpen className="size-7 text-primary" />
          </div>
          <CardTitle>Check your inbox</CardTitle>
          <CardDescription>
            A verification link has been sent to your email address. Please
            click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive it? Check your spam folder or try registering again.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/register">Back to Register</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/login">Go to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
