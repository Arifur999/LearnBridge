"use client";

import { useState, useTransition } from "react";
import DashPageHeader from "@/components/layout/DashPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserPlus, Loader2, Mail, User } from "lucide-react";
import { inviteModeratorAction } from "@/actions/admin.action";

export default function AdminModeratorsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleInvite = () => {
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    if (!trimmedEmail) {
      toast.error("Email is required");
      return;
    }
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
      <DashPageHeader title="Moderators" description="Invite and manage content moderators." />

      <div className="max-w-lg rounded-2xl border bg-background p-6 shadow-sm space-y-4">
        <h3 className="font-semibold">Invite a Moderator</h3>

        <div className="space-y-1.5">
          <Label htmlFor="mod-name" className="flex items-center gap-1.5">
            <User className="size-3.5" /> Name <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="mod-name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="mod-email" className="flex items-center gap-1.5">
            <Mail className="size-3.5" /> Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="mod-email"
            type="email"
            placeholder="moderator@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            disabled={isPending}
          />
        </div>

        <Button
          onClick={handleInvite}
          disabled={isPending || !email.trim()}
          className="w-full gap-2"
        >
          {isPending
            ? <><Loader2 className="size-4 animate-spin" /> Sending…</>
            : <><UserPlus className="size-4" /> Send Invitation</>
          }
        </Button>

        <p className="text-xs text-muted-foreground">
          The invited user will receive an email with a link to set their password and activate the moderator account.
        </p>
      </div>
    </div>
  );
}
