"use client";

import { useState, useTransition } from "react";
import DashPageHeader from "@/components/layout/DashPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UserPlus, Loader2 } from "lucide-react";
import { inviteModeratorAction } from "@/actions/admin.action";

export default function AdminModeratorsPage() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleInvite = () => {
    const trimmed = email.trim();
    if (!trimmed) return;
    startTransition(async () => {
      const res = await inviteModeratorAction(trimmed);
      if (res.success) {
        toast.success(`Invitation sent to ${trimmed}`);
        setEmail("");
      } else {
        toast.error(res.message ?? "Failed to send invitation");
      }
    });
  };

  return (
    <div className="space-y-6">
      <DashPageHeader title="Moderators" description="Invite and manage content moderators." />

      <div className="max-w-lg rounded-2xl border bg-background p-6 shadow-sm">
        <h3 className="mb-4 font-semibold">Invite a Moderator</h3>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="moderator@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInvite()}
          />
          <Button onClick={handleInvite} disabled={isPending || !email.trim()}>
            {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <UserPlus className="mr-2 size-4" />}
            Invite
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          The invited user will receive an email with instructions to accept the moderator role.
        </p>
      </div>
    </div>
  );
}
