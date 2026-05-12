"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Category, Subject } from "@/types";
import { toast } from "sonner";
import {
  createCategoryAction,
  createSubjectAction,
  deleteCategoryAction,
  deleteSubjectAction,
  updateCategoryAction,
  updateSubjectAction,
} from "@/actions/admin.action";

export default function ManageCategories({ data }: { data: Category[] }) {
  const categories = data;
  const subjects = data.flatMap((cat: Category) => cat.subjects);

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catEditId, setCatEditId] = useState<string | null>(null);
  const [catName, setCatName] = useState("");
  const [catDescription, setCatDescription] = useState("");

  const [subModalOpen, setSubModalOpen] = useState(false);
  const [subEditId, setSubEditId] = useState<string | null>(null);
  const [subName, setSubName] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  function openCategoryCreate() {
    setCatEditId(null);
    setCatName("");
    setCatDescription("");
    setCatModalOpen(true);
  }

  function openCategoryEdit(cat: Category) {
    setCatEditId(cat.id);
    setCatName(cat.name);
    setCatDescription(cat.description || "");
    setCatModalOpen(true);
  }

  async function handleCategorySubmit() {
    setCatModalOpen(false);
    if (catEditId) {
      const toastId = toast.loading("Updating category...");
      try {
        const res = await updateCategoryAction({ name: catName, description: catDescription }, catEditId);
        if (res?.error) { toast.error(String(res.error), { id: toastId }); return; }
        toast.success("Category updated", { id: toastId });
      } catch { toast.error("Failed to update category", { id: toastId }); }
    } else {
      const toastId = toast.loading("Creating category...");
      try {
        const res = await createCategoryAction({ name: catName, description: catDescription });
        if (res?.error) { toast.error(String(res.error), { id: toastId }); return; }
        toast.success("Category created", { id: toastId });
      } catch { toast.error("Failed to create category", { id: toastId }); }
    }
  }

  async function handleCategoryDelete(id: string) {
    const toastId = toast.loading("Deleting category...");
    try {
      const res = await deleteCategoryAction(id);
      if (res?.error) { toast.error(String(res.error), { id: toastId }); return; }
      toast.success("Category deleted", { id: toastId });
    } catch { toast.error("Failed to delete category", { id: toastId }); }
  }

  function openSubjectCreate() {
    setSubEditId(null);
    setSubName("");
    setSubCategoryId("");
    setSubModalOpen(true);
  }

  function openSubjectEdit(sub: Subject) {
    setSubEditId(sub.id);
    setSubName(sub.name);
    setSubCategoryId(sub.categoryId);
    setSubModalOpen(true);
  }

  async function handleSubjectSubmit() {
    setSubModalOpen(false);
    if (subEditId) {
      const toastId = toast.loading("Updating subject...");
      try {
        const res = await updateSubjectAction({ name: subName, categoryId: subCategoryId }, subEditId);
        if (res?.error) { toast.error(String(res.error), { id: toastId }); return; }
        toast.success("Subject updated", { id: toastId });
      } catch { toast.error("Failed to update subject", { id: toastId }); }
    } else {
      const toastId = toast.loading("Adding subject...");
      try {
        const res = await createSubjectAction({ name: subName, categoryId: subCategoryId });
        if (res?.error) { toast.error(String(res.error), { id: toastId }); return; }
        toast.success("Subject added", { id: toastId });
      } catch { toast.error("Failed to create subject", { id: toastId }); }
    }
  }

  async function handleSubjectDelete(id: string) {
    const toastId = toast.loading("Deleting subject...");
    try {
      const res = await deleteSubjectAction(id);
      if (res?.error) { toast.error(String(res.error), { id: toastId }); return; }
      toast.success("Subject deleted", { id: toastId });
    } catch { toast.error("Failed to delete subject", { id: toastId }); }
  }

  return (
    <div>
      <Tabs defaultValue="categories" className="mt-6">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="flex justify-end mb-4">
            <Button onClick={openCategoryCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">{category.description || "—"}</TableCell>
                  <TableCell>{category.subjects.length}</TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => openCategoryEdit(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Delete Category</DialogTitle>
                          <DialogDescription>Are you sure you want to delete <b>{category.name}</b>? This action is permanent.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-row justify-end gap-2">
                          <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                          <DialogClose asChild>
                            <Button type="button" variant="destructive" onClick={() => handleCategoryDelete(category.id)}>Confirm Delete</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="subjects">
          <div className="flex justify-end mb-4">
            <Button onClick={openSubjectCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add Subject
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {data.find((c) => c.id === sub.categoryId)?.name || "—"}
                  </TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => openSubjectEdit(sub)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Delete Subject</DialogTitle>
                          <DialogDescription>Are you sure you want to delete <b>{sub.name}</b>? This action is permanent.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-row justify-end gap-2">
                          <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                          <DialogClose asChild>
                            <Button type="button" variant="destructive" onClick={() => handleSubjectDelete(sub.id)}>Confirm Delete</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      {/* Category Modal */}
      <Dialog open={catModalOpen} onOpenChange={setCatModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{catEditId ? "Edit Category" : "Create Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="cat-name">Name</Label>
              <Input id="cat-name" placeholder="e.g. Humanities" value={catName} onChange={(e) => setCatName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea id="cat-desc" placeholder="Optional description" value={catDescription} onChange={(e) => setCatDescription(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCategorySubmit}>{catEditId ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subject Modal */}
      <Dialog open={subModalOpen} onOpenChange={setSubModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{subEditId ? "Edit Subject" : "Create Subject"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="sub-name">Name</Label>
              <Input id="sub-name" placeholder="e.g. Higher Math" value={subName} onChange={(e) => setSubName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sub-cat">Category</Label>
              <Select value={subCategoryId} onValueChange={setSubCategoryId}>
                <SelectTrigger id="sub-cat"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubjectSubmit}>{subEditId ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
