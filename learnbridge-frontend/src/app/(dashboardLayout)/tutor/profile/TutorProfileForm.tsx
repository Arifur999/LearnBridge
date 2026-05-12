"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { updateTutorProfileAction } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

interface Profile {
  bio: string;
  subjects: string;
  hourlyRate: number;
  category: string;
  profileImage: string;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  profile: Profile | null;
  categories: Category[];
}

const initialState = { success: false, message: "" };

export default function TutorProfileForm({ profile, categories }: Props) {
  const [state, formAction, isPending] = useActionState(updateTutorProfileAction, initialState);
  const [profileImage, setProfileImage] = useState(profile?.profileImage ?? "");

  useEffect(() => {
    if (state.message) {
      if (state.success) toast.success(state.message);
      else toast.error(state.message);
    }
  }, [state.success, state.message]);

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border p-6">
      {/* Profile Image Upload */}
      <div className="space-y-2">
        <Label>Profile Photo</Label>
        <ImageUpload value={profileImage} onChange={setProfileImage} />
        <input type="hidden" name="profileImage" value={profileImage} />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        {categories.length > 0 ? (
          <Select name="category" defaultValue={profile?.category ?? ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id="category"
            name="category"
            placeholder="e.g. Programming, Math, English"
            defaultValue={profile?.category ?? ""}
          />
        )}
      </div>

      {/* Subjects */}
      <div className="space-y-2">
        <Label htmlFor="subjects">Subjects</Label>
        <Input
          id="subjects"
          name="subjects"
          placeholder="JavaScript, React, Algebra (comma-separated)"
          defaultValue={profile?.subjects ?? ""}
        />
        <p className="text-xs text-muted-foreground">Separate multiple subjects with commas</p>
      </div>

      {/* Hourly rate */}
      <div className="space-y-2">
        <Label htmlFor="hourlyRate">Session Price (BDT)</Label>
        <Input
          id="hourlyRate"
          name="hourlyRate"
          type="number"
          min="0"
          placeholder="500"
          defaultValue={profile?.hourlyRate ?? ""}
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          placeholder="Tell students about your experience and teaching style..."
          defaultValue={profile?.bio ?? ""}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <Button type="submit" disabled={isPending} className="gap-2">
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Save Profile
      </Button>
    </form>
  );
}
