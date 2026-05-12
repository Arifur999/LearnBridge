"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";
import { updateUserProfileAction } from "@/actions/dashboard.action";
import ImageUpload from "@/components/ui/ImageUpload";

interface Props {
  initialName: string;
  initialImage: string;
}

export default function StudentProfileClient({ initialName, initialImage }: Props) {
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

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-primary/5 to-violet-50 dark:to-violet-950/20 p-6 space-y-5">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          {image ? (
            <div className="size-20 overflow-hidden rounded-2xl border-2 border-primary/20">
              <Image src={image} alt={name} width={80} height={80} className="object-cover size-full" />
            </div>
          ) : (
            <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-bold text-primary border-2 border-primary/20">
              {initials}
            </div>
          )}
        </div>
        <div>
          <p className="text-xl font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground capitalize">Student</p>
          {!editing && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2 gap-1.5 h-8 text-xs"
              onClick={() => setEditing(true)}
            >
              <Pencil className="size-3" /> Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="space-y-4 border-t pt-4">
          <div className="space-y-2">
            <Label>Display Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <ImageUpload value={image} onChange={setImage} />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={isPending} className="gap-2">
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isPending} className="gap-2">
              <X className="size-4" /> Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
