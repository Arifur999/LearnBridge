"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { updateProfileAction } from "@/actions/user.action";

interface UserProfileFormProps {
  user: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  };
}

export default function UserProfileForm({ user }: UserProfileFormProps) {
  const [name, setName] = useState(user.name ?? "");
  const [loading, setLoading] = useState(false);

  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Saving profile...");
    try {
      const formData = new FormData();
      formData.set("name", name);
      const res = await updateProfileAction(formData);
      if (res?.error) {
        toast.error(String(res.error), { id: toastId });
      } else {
        toast.success("Profile updated", { id: toastId });
      }
    } catch {
      toast.error("Failed to update profile", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.image} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{user.name ?? "User"}</p>
          <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="profile-name">Full Name</Label>
        <Input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>

      <div className="space-y-1">
        <Label>Email</Label>
        <Input value={user.email ?? ""} disabled className="bg-muted" />
        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
