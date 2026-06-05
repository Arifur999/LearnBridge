"use client";

import { useState, useTransition, useActionState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Loader2, Pencil, Save, X, BadgeCheck, AlertCircle,
  Tag, DollarSign, LayoutGrid, BookOpen, Camera,
} from "lucide-react";
import { toast } from "sonner";
import { updateUserProfileAction, updateTutorProfileAction } from "@/actions/dashboard.action";
import ImageUpload from "@/components/ui/ImageUpload";

interface Profile {
  bio: string;
  subjects: string;
  hourlyRate: number;
  category: string;
  profileImage: string;
}

interface Category { id: string; name: string; }

interface Props {
  initialName:   string;
  initialImage:  string;
  userRole?:     string;
  userEmail?:    string;
  emailVerified?: boolean;
  profile:       Profile | null;
  categories:    Category[];
}

const initialState = { success: false, message: "" };

export default function TutorProfileClient({
  initialName, initialImage, userRole = "Tutor", userEmail = "", emailVerified = false, profile, categories,
}: Props) {
  const [name, setName]       = useState(initialName);
  const [image, setImage]     = useState(initialImage);
  const [editing, setEditing] = useState(false);
  const [isPendingName, startNameTransition] = useTransition();

  // Tutor profile form
  const [profileImage, setProfileImage] = useState(profile?.profileImage ?? "");
  const defaultCat = categories.find((c) => c.name === profile?.category) ?? categories[0] ?? null;
  const [selectedCatId, setSelectedCatId]     = useState(defaultCat?.id ?? "");
  const [selectedCatName, setSelectedCatName] = useState(defaultCat?.name ?? profile?.category ?? "");
  const [tutorState, tutorFormAction, isTutorPending] = useActionState(updateTutorProfileAction, initialState);

  useEffect(() => {
    if (!tutorState.message) return;
    if (tutorState.success) { toast.success(tutorState.message); setEditing(false); }
    else toast.error(tutorState.message);
  }, [tutorState.success, tutorState.message]);

  function handleNameSave() {
    startNameTransition(async () => {
      const res = await updateUserProfileAction({ name, image });
      if (res.success) { toast.success(res.message); }
      else toast.error(res.message);
    });
  }

  function handleCancel() {
    setName(initialName);
    setImage(initialImage);
    setEditing(false);
  }

  const handleCategoryChange = (value: string) => {
    const cat = categories.find((c) => c.id === value);
    setSelectedCatId(value);
    setSelectedCatName(cat?.name ?? "");
  };

  const initials    = (name || "T").charAt(0).toUpperCase();
  const displayRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
  const isPending   = isPendingName || isTutorPending;

  return (
    <div className="flex w-full flex-col items-center gap-4">

      {/* Avatar */}
      <div className="relative">
        <div className="size-24 overflow-hidden rounded-full ring-4 ring-background shadow-xl">
          {image ? (
            <Image src={image} alt={name} width={96} height={96} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-primary text-3xl font-black text-white">
              {initials}
            </div>
          )}
        </div>
        {emailVerified ? (
          <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background shadow-sm" title="Email verified">
            <BadgeCheck className="size-4 text-white" />
          </div>
        ) : (
          <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-amber-500 ring-2 ring-background shadow-sm" title="Email not verified">
            <AlertCircle className="size-4 text-white" />
          </div>
        )}
      </div>

      {/* Name + Role */}
      <div className="text-center">
        <h2 className="text-xl font-black tracking-tight">{name || "Tutor"}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{displayRole}</p>
        {!emailVerified && (
          <a
            href={`/verify-email${userEmail ? `?email=${encodeURIComponent(userEmail)}` : ""}`}
            className="mt-1 inline-block text-xs font-semibold text-amber-500 hover:underline"
          >
            Verify your email
          </a>
        )}
      </div>

      {/* Edit button */}
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

      
      {editing && (
        <div className="w-full space-y-4 rounded-2xl border border-border/60 bg-muted/30 p-5">

          {/* Name + Photo */}
          <p className="text-sm font-semibold">Basic Info</p>

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
            <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Camera className="size-3.5" /> Profile Photo
            </Label>
            <ImageUpload value={image} onChange={setImage} />
          </div>

          <Button
            type="button"
            onClick={handleNameSave}
            disabled={isPendingName}
            variant="outline"
            className="w-full gap-2 rounded-xl"
          >
            {isPendingName ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Name & Photo
          </Button>

          <div className="border-t border-border/60 pt-4">
            <p className="mb-4 text-sm font-semibold">Teaching Details</p>

            <form action={tutorFormAction} className="space-y-4">
              <input type="hidden" name="profileImage" value={profileImage} />
              <input type="hidden" name="categoryId"   value={selectedCatId} />
              <input type="hidden" name="category"     value={selectedCatName} />

              {/* Teaching Photo */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Camera className="size-3.5" /> Teaching Profile Photo
                </Label>
                <ImageUpload value={profileImage} onChange={setProfileImage} />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <LayoutGrid className="size-3.5" /> Category
                </Label>
                {categories.length > 0 ? (
                  <Select value={selectedCatId} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input name="category" placeholder="e.g. Programming" defaultValue={profile?.category ?? ""} className="rounded-xl" />
                )}
              </div>

              {/* Subjects */}
              <div className="space-y-1.5">
                <Label htmlFor="subjects" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Tag className="size-3.5" /> Subjects
                </Label>
                <Input id="subjects" name="subjects" placeholder="PHP, React (comma-separated)" defaultValue={profile?.subjects ?? ""} className="rounded-xl" />
                <p className="text-xs text-muted-foreground">Separate with commas</p>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <Label htmlFor="hourlyRate" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <DollarSign className="size-3.5" /> Session Price (BDT)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">৳</span>
                  <Input id="hourlyRate" name="hourlyRate" type="number" min="0" placeholder="500" defaultValue={profile?.hourlyRate || ""} className="rounded-xl pl-8" />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <Label htmlFor="bio" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <BookOpen className="size-3.5" /> Bio
                </Label>
                <textarea
                  id="bio" name="bio" rows={3}
                  placeholder="Tell students about your teaching style..."
                  defaultValue={profile?.bio ?? ""}
                  className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isTutorPending} className="flex-1 gap-2 rounded-xl">
                  {isTutorPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  Save Teaching Info
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending} className="gap-2 rounded-xl">
                  <X className="size-4" /> Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
