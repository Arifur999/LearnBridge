"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { inviteModeratorAction } from "@/actions/admin.action";

export default function InviteModeratorModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) { toast.error("Email is required"); return; }
    setLoading(true);
    const toastId = toast.loading("Sending invitation...");
    try {
      const res = await inviteModeratorAction(email, name);
      if (!res?.success) {
        toast.error(res?.message ?? "Failed to send invitation", { id: toastId });
      } else {
        toast.success("Invitation sent successfully", { id: toastId });
        setEmail("");
        setName("");
        setOpen(false);
      }
    } catch {
      toast.error("Failed to send invitation", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Invite Moderator
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Moderator</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="mod-name">Name</Label>
            <Input
              id="mod-name"
              placeholder="Moderator name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="mod-email">Email</Label>
            <Input
              id="mod-email"
              type="email"
              placeholder="moderator@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Sending..." : "Send Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
