"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategoryAction, deleteCategoryAction } from "@/actions/dashboard.action";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Props {
  initialCategories: Category[];
}

export default function CategoriesManager({ initialCategories }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("description", description.trim());
      const res = await createCategoryAction(formData);
      if (res.success) {
        toast.success("Category created");
        setName("");
        setDescription("");
        // Optimistically add to list
        const newCat = (res.data as { data?: Category; id?: string; name?: string; description?: string }) ?? {};
        const created: Category = {
          id: String((newCat?.data as Category)?.id ?? (newCat as Category)?.id ?? Date.now()),
          name: String((newCat?.data as Category)?.name ?? (newCat as Category)?.name ?? name),
          description: String((newCat?.data as Category)?.description ?? (newCat as Category)?.description ?? description),
        };
        setCategories((prev) => [...prev, created]);
      } else {
        toast.error(res.message ?? "Failed to create category");
      }
    });
  };

  const handleDelete = (categoryId: string) => {
    setDeletingId(categoryId);
    startTransition(async () => {
      const res = await deleteCategoryAction(categoryId);
      if (res.success) {
        toast.success("Category deleted");
        setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      } else {
        toast.error(res.message ?? "Failed to delete category");
      }
      setDeletingId(null);
    });
  };

  return (
    <div className="space-y-6">
      {/* Create form */}
      <div className="rounded-2xl border p-6">
        <h2 className="mb-4 font-semibold">Add New Category</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cat-name">Category Name</Label>
            <Input
              id="cat-name"
              placeholder="e.g. Programming"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat-desc">Description (optional)</Label>
            <Input
              id="cat-desc"
              placeholder="Short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={handleCreate}
          disabled={isPending}
          className="mt-4 gap-2"
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add Category
        </Button>
      </div>

      {/* Categories list */}
      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <Tags className="mx-auto mb-3 size-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">No categories yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">Add one above to get started.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-start justify-between gap-3 rounded-2xl border bg-background p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <Tags className="size-4 shrink-0 text-primary" />
                  <p className="font-semibold">{cat.name}</p>
                </div>
                {cat.description && (
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={deletingId === cat.id}
                onClick={() => handleDelete(cat.id)}
              >
                {deletingId === cat.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
