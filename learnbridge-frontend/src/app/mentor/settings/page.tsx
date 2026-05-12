"use client";

import DashPageHeader from "@/components/layout/DashPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateMentorProfileAction } from "@/actions/mentor.action";

export default function MentorSettingsPage() {
  const [bio, setBio] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateMentorProfileAction({ bio, specialization });
      if (res.success) {
        toast.success("Profile updated.");
      } else {
        toast.error(res.message ?? "Could not save changes.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <DashPageHeader title="Settings" description="Update your mentor profile." />
      <Card className="max-w-lg">
        <CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                placeholder="e.g. Web Development, Data Science"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="w-full min-h-25 rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Tell students about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
