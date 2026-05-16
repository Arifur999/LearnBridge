"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Eye, Star, Trash2, Loader2, User, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { addFeaturedTutorAction, deleteTutorAction } from "@/actions/admin.action";

export interface AdminTutor {
  id: string;
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

function TutorDetailModal({ tutor, open, onClose }: { tutor: AdminTutor; open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tutor Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10">
              {tutor.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tutor.profileImage} alt={tutor.name} className="size-16 rounded-full object-cover" />
              ) : (
                <User className="size-8 text-primary" />
              )}
            </div>
            <div>
              <p className="text-lg font-bold">{tutor.name}</p>
              {tutor.email && <p className="text-sm text-muted-foreground">{tutor.email}</p>}
              {tutor.isFeatured && (
                <Badge className="mt-1 bg-amber-100 text-amber-700 hover:bg-amber-100">
                  <Star className="mr-1 size-3 fill-amber-500 text-amber-500" /> Featured
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2 rounded-xl border p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium">{tutor.category || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hourly Rate</span>
              <span className="font-medium">{tutor.price != null ? `BDT ${tutor.price}` : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rating</span>
              <span className="font-medium flex items-center gap-1">
                {tutor.rating != null ? (
                  <><Star className="size-3.5 fill-amber-400 text-amber-400" />{tutor.rating.toFixed(1)}</>
                ) : "—"}
              </span>
            </div>
            {tutor.subjects && tutor.subjects.length > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Subjects</span>
                <span className="text-right font-medium">{tutor.subjects.join(", ")}</span>
              </div>
            )}
          </div>

          {tutor.bio && (
            <div className="rounded-xl border p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bio</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{tutor.bio}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeleteWarningDialog({
  tutor,
  open,
  onClose,
  onConfirm,
  isPending,
}: {
  tutor: AdminTutor;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" /> Delete Tutor
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-1">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <p className="font-semibold text-destructive">Warning — This action cannot be undone!</p>
            <p className="mt-1 text-muted-foreground">
              You are about to permanently delete <span className="font-semibold text-foreground">{tutor.name}</span>.
              All their courses, bookings, and profile data will be removed.
            </p>
          </div>
          <div className="flex gap-2 pt-1">
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

function TutorRow({ tutor, onDeleted }: { tutor: AdminTutor; onDeleted: (id: string) => void }) {
  const [viewOpen, setViewOpen] = useState(false);
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
      const res = await deleteTutorAction(tutor.id);
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
      <tr className="hover:bg-muted/30 transition-colors">
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              {tutor.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tutor.profileImage} alt={tutor.name} className="size-9 rounded-full object-cover" />
              ) : (
                <User className="size-4 text-primary" />
              )}
            </div>
            <div>
              <p className="font-medium leading-tight">{tutor.name}</p>
              {tutor.email && <p className="text-xs text-muted-foreground">{tutor.email}</p>}
            </div>
          </div>
        </td>
        <td className="px-5 py-4 text-sm text-muted-foreground">{tutor.category || "—"}</td>
        <td className="px-5 py-4 text-sm font-medium">
          {tutor.price != null ? `BDT ${tutor.price}` : "—"}
        </td>
        <td className="px-5 py-4">
          {tutor.isFeatured ? (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
              <Star className="mr-1 size-3 fill-amber-500 text-amber-500" /> Featured
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">Standard</Badge>
          )}
        </td>
        <td className="px-5 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8" disabled={isPending}>
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <MoreHorizontal className="size-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setViewOpen(true)}>
                <Eye className="mr-2 size-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddFeatured} disabled={tutor.isFeatured}>
                <Star className="mr-2 size-4 text-amber-500" />
                {tutor.isFeatured ? "Already Featured" : "Add to Featured"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 size-4" /> Delete Tutor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

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

export default function AllTutorsClient({ initialTutors }: { initialTutors: AdminTutor[] }) {
  const [tutors, setTutors] = useState<AdminTutor[]>(initialTutors);

  const handleDeleted = (id: string) => {
    setTutors((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="overflow-hidden rounded-2xl border">
      {tutors.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-sm text-muted-foreground">No tutors found on the platform.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Tutor</th>
              <th className="px-5 py-3 text-left font-semibold">Category</th>
              <th className="px-5 py-3 text-left font-semibold">Hourly Rate</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tutors.map((tutor) => (
              <TutorRow key={tutor.id} tutor={tutor} onDeleted={handleDeleted} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
