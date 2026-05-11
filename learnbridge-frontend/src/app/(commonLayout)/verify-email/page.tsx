"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MailCheck, XCircle } from "lucide-react";
import { API_V1_URL } from "@/lib/config";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API_V1_URL}/auth/verify-email?token=${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Verification failed.");
        setStatus("success");
        setMessage("Your email has been verified! You can now log in.");
      } catch (err) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Verification failed.");
      }
    })();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-muted">
            {status === "loading" && <Loader2 className="size-7 animate-spin text-muted-foreground" />}
            {status === "success" && <MailCheck className="size-7 text-emerald-500" />}
            {status === "error"   && <XCircle className="size-7 text-destructive" />}
          </div>
          <CardTitle>
            {status === "loading" && "Verifying your email…"}
            {status === "success" && "Email Verified!"}
            {status === "error"   && "Verification Failed"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        {status !== "loading" && (
          <CardContent>
            <Button className="w-full" onClick={() => router.push("/login")}>
              Go to Login
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
