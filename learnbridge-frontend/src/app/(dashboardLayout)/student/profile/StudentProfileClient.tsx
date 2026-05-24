"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil, Save, X, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { updateUserProfileAction } from "@/actions/dashboard.action";
import ImageUpload from "@/components/ui/ImageUpload";

interface Props {
  initialName: string;
  initialImage: string;
  userRole?: string;
}

export default function StudentProfileClient({ initialName, initialImage, userRole = "Student" }: Props) {
  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage);
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const res = await updateUserProfileAction({ name, image });
      if (res.success) {
        toast.success(res.message);
        setEditing(false);
      } else {
        toast.error(res.message);
      }
    });
  }

  function handleCancel() {
    setName(initialName);
    setImage(initialImage);
    setEditing(false);
  }

  const initials = (name || "S").charAt(0).toUpperCase();
  const displayRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();

  return (
    <div className="flex w-full flex-col items-center gap-5">

      {/* Avatar */}
      <div className="relative">
        <div className="size-24 overflow-hidden rounded-full ring-4 ring-background shadow-xl">
          {image ? (
            <Image
              src={image}
              alt={name}
              width={96}
              height={96}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-primary text-3xl font-black text-white">
              {initials}
            </div>
          )}
        </div>
        {/* Verified badge */}
        <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background shadow-sm">
          <BadgeCheck className="size-4 text-white" />
        </div>
      </div>

      {/* Name + Role */}
      <div className="text-center">
        <h2 className="text-xl font-black tracking-tight">{name || "Student"}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{displayRole}</p>
      </div>

      {/* Edit Profile button */}
      {!editing && (
        <Button
          onClick={() => setEditing(true)}
          variant="outline"
          className="gap-2 rounded-xl border-primary/30 px-5 text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Pencil className="size-3.5" />
          Edit Profile
        </Button>
      )}

      {/* Edit form */}
      {editing && (
        <div className="w-full rounded-2xl border border-border/60 bg-muted/30 p-5 space-y-4">
          <p className="text-sm font-semibold">Edit your profile</p>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Display Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Profile Photo
            </Label>
            <ImageUpload value={image} onChange={setImage} />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="flex-1 gap-2 rounded-xl"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
              className="gap-2 rounded-xl"
            >
              <X className="size-4" />
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
