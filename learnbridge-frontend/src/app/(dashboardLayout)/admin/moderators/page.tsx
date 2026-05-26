"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { UserPlus, Loader2, Mail, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inviteModeratorAction } from "@/actions/admin.action";

export default function AdminModeratorsPage() {
  const [email, setEmail] = useState("");
  const [name,  setName]  = useState("");
  const [isPending, startTransition] = useTransition();

  const handleInvite = () => {
    const trimmedEmail = email.trim();
    const trimmedName  = name.trim();
    if (!trimmedEmail) { toast.error("Email is required"); return; }

    startTransition(async () => {
      const res = await inviteModeratorAction(trimmedEmail, trimmedName || undefined);
      if (res.success) {
        toast.success(`Invitation sent to ${trimmedEmail}`);
        setEmail("");
        setName("");
      } else {
        toast.error(res.message ?? "Failed to send invitation");
      }
    });
  };

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">Moderators</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Invite and manage content moderators
        </p>
      </div>

      {/* ── Invite Card ────────────────────────────────────────── */}
      <div className="mx-auto max-w-lg">
        <Card className="overflow-hidden">
          <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="size-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Invite a Moderator</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  They&apos;ll receive an email to activate their account
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 p-6">

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="mod-name" className="flex items-center gap-1.5 text-sm font-semibold">
                <User className="size-3.5 text-muted-foreground" />
                Name
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="mod-name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                className="rounded-xl"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="mod-email" className="flex items-center gap-1.5 text-sm font-semibold">
                <Mail className="size-3.5 text-muted-foreground" />
                Email
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mod-email"
                type="email"
                placeholder="moderator@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                disabled={isPending}
                className="rounded-xl"
              />
            </div>

            {/* Submit */}
            <Button
              onClick={handleInvite}
              disabled={isPending || !email.trim()}
              className="w-full gap-2 rounded-xl"
            >
              {isPending
                ? <><Loader2 className="size-4 animate-spin" /> Sending Invitation…</>
                : <><UserPlus className="size-4" /> Send Invitation</>
              }
            </Button>

            {/* Info note */}
            <div className="rounded-xl bg-muted/50 border px-4 py-3 text-xs text-muted-foreground">
              The invited user will receive an email with a link to set their password and activate the moderator account.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
