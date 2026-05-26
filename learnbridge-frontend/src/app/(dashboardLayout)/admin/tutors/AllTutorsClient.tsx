"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  MoreHorizontal, Eye, Star, Trash2, Loader2,
  User, AlertTriangle, GraduationCap, DollarSign,
  Mail, Tag, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addFeaturedTutorAction, deleteTutorAction } from "@/actions/admin.action";

export interface AdminTutor {
  id: string;
  userId?: string;
  name: string;
  email?: string;
  category?: string;
  price?: number;
  rating?: number;
  subjects?: string[];
  profileImage?: string;
  bio?: string;
  isFeatured?: boolean;
}

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
];

/* ── Detail Modal ─────────────────────────────────────────── */
function TutorDetailModal({ tutor, open, onClose }: { tutor: AdminTutor; open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="size-4 text-primary" /> Tutor Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">

          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-black text-primary overflow-hidden">
              {tutor.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tutor.profileImage} alt={tutor.name} className="size-16 object-cover" />
              ) : (
                tutor.name[0]?.toUpperCase() ?? "T"
              )}
            </div>
            <div>
              <p className="text-lg font-black">{tutor.name}</p>
              {tutor.email && <p className="text-sm text-muted-foreground">{tutor.email}</p>}
              {tutor.isFeatured && (
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                  <Star className="size-3 fill-amber-500 text-amber-500" /> Featured
                </span>
              )}
            </div>
          </div>

          {/* Info rows */}
          <div className="divide-y rounded-2xl border">
            {[
              { icon: Tag,        label: "Category",    value: tutor.category || "—" },
              { icon: DollarSign, label: "Hourly Rate", value: tutor.price != null ? `৳${tutor.price}` : "—" },
              { icon: Star,       label: "Rating",      value: tutor.rating != null ? `${tutor.rating.toFixed(1)} / 5.0` : "—" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="size-3.5" /> {label}
                </span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
            {tutor.subjects && tutor.subjects.length > 0 && (
              <div className="flex items-start justify-between px-4 py-3 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground shrink-0">
                  <BookOpen className="size-3.5" /> Subjects
                </span>
                <span className="text-right font-semibold">{tutor.subjects.join(", ")}</span>
              </div>
            )}
          </div>

          {tutor.bio && (
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bio</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{tutor.bio}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Delete Confirm Dialog ────────────────────────────────── */
function DeleteWarningDialog({
  tutor, open, onClose, onConfirm, isPending,
}: { tutor: AdminTutor; open: boolean; onClose: () => void; onConfirm: () => void; isPending: boolean }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" /> Delete Tutor
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <p className="font-semibold text-destructive">This action cannot be undone!</p>
            <p className="mt-1 text-muted-foreground">
              You are about to permanently delete{" "}
              <span className="font-semibold text-foreground">{tutor.name}</span>.
              All their courses, bookings, and profile data will be removed.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1 gap-1.5" onClick={onConfirm} disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Yes, Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Single Tutor Row ─────────────────────────────────────── */
function TutorRow({ tutor, idx, onDeleted }: { tutor: AdminTutor; idx: number; onDeleted: (id: string) => void }) {
  const [viewOpen, setViewOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAddFeatured = () => {
    startTransition(async () => {
      const res = await addFeaturedTutorAction(tutor.id);
      if (res.success) toast.success(`${tutor.name} added to Featured Tutors`);
      else toast.error(res.message ?? "Failed");
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteTutorAction(tutor.userId ?? tutor.id);
      if (res.success) {
        toast.success(`${tutor.name} deleted`);
        setDeleteOpen(false);
        onDeleted(tutor.id);
      } else {
        toast.error(res.message ?? "Failed to delete");
      }
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-muted/30 sm:grid-cols-[2.5fr_2fr_1fr_1.2fr_1fr_auto] sm:items-center sm:gap-4">

        {/* Tutor */}
        <div className="flex items-center gap-3">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black overflow-hidden ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
            {tutor.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tutor.profileImage} alt={tutor.name} className="size-10 object-cover" />
            ) : (
              tutor.name[0]?.toUpperCase() ?? "T"
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{tutor.name}</p>
            {tutor.email && (
              <p className="truncate text-xs text-muted-foreground">{tutor.email}</p>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2">
          <Tag className="size-3.5 shrink-0 text-muted-foreground" />
          <p className="truncate text-sm text-muted-foreground">{tutor.category || "—"}</p>
        </div>

        {/* Hourly Rate */}
        <div className="flex items-center gap-1.5">
          <DollarSign className="size-3.5 shrink-0 text-emerald-500" />
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {tutor.price != null ? `৳${tutor.price}` : "—"}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Star className={`size-3.5 shrink-0 ${tutor.rating != null ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
          <p className="text-sm font-semibold">
            {tutor.rating != null ? tutor.rating.toFixed(1) : "—"}
          </p>
        </div>

        {/* Status */}
        {tutor.isFeatured ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <Star className="size-3 fill-amber-500 text-amber-500" />
            Featured
          </span>
        ) : (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            <span className="size-1.5 rounded-full bg-muted-foreground/50" />
            Standard
          </span>
        )}

        {/* Action */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 rounded-xl" disabled={isPending}>
              {isPending
                ? <Loader2 className="size-4 animate-spin" />
                : <MoreHorizontal className="size-4" />
              }
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <DropdownMenuItem onClick={() => setViewOpen(true)} className="gap-2">
              <Eye className="size-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleAddFeatured}
              disabled={tutor.isFeatured || isPending}
              className="gap-2"
            >
              <Star className="size-4 text-amber-500" />
              {tutor.isFeatured ? "Already Featured" : "Add to Featured"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setDeleteOpen(true)}
              className="gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4" /> Delete Tutor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TutorDetailModal tutor={tutor} open={viewOpen} onClose={() => setViewOpen(false)} />
      <DeleteWarningDialog
        tutor={tutor}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isPending={isPending}
      />
    </>
  );
}

/* ── Main Export ──────────────────────────────────────────── */
export default function AllTutorsClient({ initialTutors }: { initialTutors: AdminTutor[] }) {
  const [tutors, setTutors] = useState<AdminTutor[]>(initialTutors);
  const featuredCount = tutors.filter((t) => t.isFeatured).length;

  const handleDeleted = (id: string) => {
    setTutors((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-[3px] w-full bg-linear-to-r from-primary to-amber-500" />
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">All Tutors</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">{tutors.length} registered tutors</p>
            </div>
          </div>
          {featuredCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <Star className="size-3 fill-amber-500 text-amber-500" />
              {featuredCount} featured
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {tutors.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-muted">
              <GraduationCap className="size-8 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold">No tutors found</p>
              <p className="mt-1 text-sm text-muted-foreground">Tutors who register will appear here</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden border-b bg-muted/40 sm:grid sm:grid-cols-[2.5fr_2fr_1fr_1.2fr_1fr_auto] gap-4 px-5 py-3">
              {["Tutor", "Category", "Rate", "Rating", "Status", ""].map((h) => (
                <p key={h} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</p>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-border/60">
              {tutors.map((tutor, idx) => (
                <TutorRow key={tutor.id} tutor={tutor} idx={idx} onDeleted={handleDeleted} />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
