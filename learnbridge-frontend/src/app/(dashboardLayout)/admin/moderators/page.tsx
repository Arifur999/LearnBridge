"use client";

import { useState } from "react";
import DashPageHeader from "@/components/layout/DashPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

export default function AdminModeratorsPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invite-moderator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success(`Invitation sent to ${email}`);
        setEmail("");
      } else {
        const data = await res.json();
        toast.error(data?.message ?? "Failed to send invitation");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
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
          <Button onClick={handleInvite} disabled={loading || !email.trim()}>
            <UserPlus className="mr-2 size-4" />
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
