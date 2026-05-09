"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateUserStatusAction } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { ShieldBan, ShieldCheck, Loader2 } from "lucide-react";

interface Props {
  userId: string;
  isBanned: boolean;
}

export default function UserStatusToggle({ userId, isBanned: initialBanned }: Props) {
  const [banned, setBanned] = useState(initialBanned);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const newStatus = banned ? "ACTIVE" : "BLOCKED";
    startTransition(async () => {
      const res = await updateUserStatusAction(userId, newStatus);
      if (res.success) {
        setBanned(!banned);
        toast.success(banned ? "User unbanned" : "User banned");
      } else {
        toast.error(res.message ?? "Failed to update status");
      }
    });
  };

  return (
    <Button
      size="sm"
      variant={banned ? "default" : "destructive"}
      onClick={toggle}
      disabled={isPending}
      className="gap-1.5"
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : banned ? (
        <ShieldCheck className="size-3.5" />
      ) : (
        <ShieldBan className="size-3.5" />
      )}
      {banned ? "Unban" : "Ban"}
    </Button>
  );
}
