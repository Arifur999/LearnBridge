"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Plus, Trash2, Loader2, Tags, BookOpen,
  Layers, Code, Palette, Music, Calculator,
  Globe, Microscope, LayoutGrid, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { createCategoryAction, deleteCategoryAction } from "@/actions/dashboard.action";

interface Category { id: string; name: string; description: string; }

const CARD_ACCENTS = [
  { bar: "from-primary to-violet-500",       iconBg: "bg-primary/10",                         iconColor: "text-primary"                          },
  { bar: "from-violet-500 to-indigo-500",    iconBg: "bg-violet-100 dark:bg-violet-900/30",    iconColor: "text-violet-600 dark:text-violet-400"  },
  { bar: "from-emerald-500 to-teal-500",     iconBg: "bg-emerald-100 dark:bg-emerald-900/30",  iconColor: "text-emerald-600 dark:text-emerald-400" },
  { bar: "from-amber-500 to-orange-400",     iconBg: "bg-amber-100 dark:bg-amber-900/30",      iconColor: "text-amber-600 dark:text-amber-400"    },
  { bar: "from-cyan-500 to-blue-500",        iconBg: "bg-cyan-100 dark:bg-cyan-900/30",        iconColor: "text-cyan-600 dark:text-cyan-400"      },
  { bar: "from-rose-500 to-pink-400",        iconBg: "bg-rose-100 dark:bg-rose-900/30",        iconColor: "text-rose-600 dark:text-rose-400"      },
];

/* Map category name → icon */
const CATEGORY_ICONS: { match: RegExp; icon: React.ElementType }[] = [
  { match: /program|code|dev|software|web/i, icon: Code       },
  { match: /design|art|graphic|ui|ux/i,      icon: Palette    },
  { match: /music|audio|sound/i,             icon: Music      },
  { match: /math|calc|stat|algebra/i,        icon: Calculator },
  { match: /language|english|french|write/i, icon: Globe      },
  { match: /science|bio|chem|phys|lab/i,     icon: Microscope },
  { match: /book|read|lit|history/i,         icon: BookOpen   },
];

function getCategoryIcon(name: string): React.ElementType {
  for (const { match, icon } of CATEGORY_ICONS) {
    if (match.test(name)) return icon;
  }
  return Tags;
}

function DeleteDialog({
  category, open, onClose, onConfirm, isPending,
}: { category: Category; open: boolean; onClose: () => void; onConfirm: () => void; isPending: boolean }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" /> Delete Category
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <p className="font-semibold text-destructive">This action cannot be undone!</p>
            <p className="mt-1 text-muted-foreground">
              Deleting{" "}
              <span className="font-semibold text-foreground">&ldquo;{category.name}&rdquo;</span>{" "}
              will remove it from all tutors and listings.
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

function CategoryCard({
  category, idx, onDelete, deletingId,
}: { category: Category; idx: number; onDelete: (c: Category) => void; deletingId: string | null }) {
  const accent  = CARD_ACCENTS[idx % CARD_ACCENTS.length];
  const Icon    = getCategoryIcon(category.name);
  const isDeleting = deletingId === category.id;

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <div className={`h-[3px] w-full bg-linear-to-r ${accent.bar}`} />
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${accent.iconBg} transition-transform group-hover:scale-110`}>
            <Icon className={`size-5 ${accent.iconColor}`} />
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <p className="font-black text-sm leading-snug">{category.name}</p>
            {category.description && category.description !== "N/A" ? (
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {category.description}
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground/50 italic">No description</p>
            )}
          </div>

          {/* Delete */}
          <Button
            size="icon"
            variant="ghost"
            className="size-8 shrink-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            disabled={isDeleting}
            onClick={() => onDelete(category)}
          >
            {isDeleting
              ? <Loader2 className="size-4 animate-spin" />
              : <Trash2 className="size-4" />
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories]   = useState<Category[]>(initialCategories);
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition]  = useTransition();
  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [confirmCat, setConfirmCat]   = useState<Category | null>(null);

  const handleCreate = () => {
    if (!name.trim()) { toast.error("Category name is required"); return; }
    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("description", description.trim());
      const res = await createCategoryAction(formData);
      if (res.success) {
        toast.success("Category created!");
        setName("");
        setDescription("");
        const newCat = (res.data as { data?: Category } ) ?? {};
        const created: Category = {
          id:          String((newCat?.data as Category)?.id  ?? (res.data as Category)?.id  ?? Date.now()),
          name:        String((newCat?.data as Category)?.name ?? (res.data as Category)?.name ?? name),
          description: String((newCat?.data as Category)?.description ?? (res.data as Category)?.description ?? description),
        };
        setCategories((prev) => [...prev, created]);
      } else {
        toast.error(res.message ?? "Failed to create category");
      }
    });
  };

  const handleDeleteConfirmed = () => {
    if (!confirmCat) return;
    const id = confirmCat.id;
    setDeletingId(id);
    startTransition(async () => {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        toast.success("Category deleted");
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error(res.message ?? "Failed to delete category");
      }
      setDeletingId(null);
      setConfirmCat(null);
    });
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">

        
        <div>
          <Card className="overflow-hidden sticky top-4">
            <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />
            <CardHeader className="border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
                  <Plus className="size-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Add New Category</CardTitle>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Create a new subject category
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 p-6">

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="cat-name" className="flex items-center gap-2 text-sm font-semibold">
                  <div className="flex size-5 items-center justify-center rounded-md bg-muted">
                    <Tags className="size-3 text-muted-foreground" />
                  </div>
                  Category Name
                  <span className="text-red-500 text-xs">*</span>
                </Label>
                <Input
                  id="cat-name"
                  placeholder="e.g. Programming"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  disabled={isPending}
                  className="rounded-xl h-11"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="cat-desc" className="flex items-center gap-2 text-sm font-semibold">
                  <div className="flex size-5 items-center justify-center rounded-md bg-muted">
                    <BookOpen className="size-3 text-muted-foreground" />
                  </div>
                  Description
                  <span className="font-normal text-xs text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="cat-desc"
                  placeholder="Short description of this category"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isPending}
                  className="rounded-xl h-11"
                />
              </div>

              {/* Preview */}
              {name.trim() && (
                <div className="rounded-2xl border bg-muted/30 p-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Preview</p>
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
                      {(() => { const Icon = getCategoryIcon(name); return <Icon className="size-4 text-primary" />; })()}
                    </div>
                    <div>
                      <p className="text-sm font-black">{name.trim()}</p>
                      {description.trim() && (
                        <p className="text-xs text-muted-foreground">{description.trim()}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                onClick={handleCreate}
                disabled={isPending || !name.trim()}
                className="w-full h-11 gap-2 rounded-xl font-semibold"
              >
                {isPending
                  ? <><Loader2 className="size-4 animate-spin" /> Creating…</>
                  : <><Plus className="size-4" /> Add Category</>
                }
              </Button>

              {/* Info */}
              <p className="text-center text-xs text-muted-foreground">
                {categories.length} categor{categories.length !== 1 ? "ies" : "y"} on the platform
              </p>
            </CardContent>
          </Card>
        </div>

        
        <div>
          <Card className="overflow-hidden">
            <div className="h-[3px] w-full bg-linear-to-r from-violet-500 to-emerald-500" />
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
                    <LayoutGrid className="size-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">All Categories</CardTitle>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {categories.length} subject categor{categories.length !== 1 ? "ies" : "y"}
                    </p>
                  </div>
                </div>
                {categories.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-400">
                    <Tags className="size-3" />
                    {categories.length} total
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-5">
              {categories.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                  <div className="flex size-16 items-center justify-center rounded-3xl bg-muted">
                    <Tags className="size-8 text-muted-foreground/40" />
                  </div>
                  <div>
                    <p className="font-semibold">No categories yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add your first category using the form on the left
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {categories.map((cat, idx) => (
                    <CategoryCard
                      key={cat.id}
                      category={cat}
                      idx={idx}
                      onDelete={setConfirmCat}
                      deletingId={deletingId}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete confirm dialog */}
      {confirmCat && (
        <DeleteDialog
          category={confirmCat}
          open={!!confirmCat}
          onClose={() => setConfirmCat(null)}
          onConfirm={handleDeleteConfirmed}
          isPending={!!deletingId}
        />
      )}
    </>
  );
}
