"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Plus, Pencil, Trash2, X, Loader2, DollarSign, Users } from "lucide-react";
import { toast } from "sonner";
import {
  createCourseAction,
  updateCourseAction,
  deleteCourseAction,
} from "@/actions/tutor.action";
import ImageUpload from "@/components/ui/ImageUpload";

interface Course {
  id: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  image?: string | null;
  status?: string;
  totalEnrollments?: number;
}

const CATEGORIES = [
  "Programming", "Design", "Mathematics", "Science",
  "Language", "Business", "Music", "Art", "Other",
];

const CATEGORY_IMAGES: Record<string, string> = {
  Programming: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
  Design: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
  Mathematics: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80",
  Science: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  Language: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80",
  Business: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
  Music: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80",
  Art: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&q=80",
  Other: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  APPROVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function getCourseImage(course: Course) {
  if (course.image) return course.image;
  return CATEGORY_IMAGES[course.category ?? "Other"] ?? CATEGORY_IMAGES.Other;
}

export default function TutorCoursesClient({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Programming");
  const [imageUrl, setImageUrl] = useState("");

  function openCreate() {
    setEditing(null);
    setTitle(""); setDescription(""); setPrice(""); setCategory("Programming"); setImageUrl("");
    setShowForm(true);
  }

  function openEdit(c: Course) {
    setEditing(c);
    setTitle(c.title ?? "");
    setDescription(c.description ?? "");
    setPrice(c.price != null ? String(c.price) : "");
    setCategory(c.category ?? "Programming");
    setImageUrl(c.image ?? "");
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) { toast.error("Description is required"); return; }

    const payload = {
      title,
      description,
      category,
      price: price ? Number(price) : undefined,
      image: imageUrl.trim() || undefined,
    };

    startTransition(async () => {
      const res = editing
        ? await updateCourseAction(editing.id, payload)
        : await createCourseAction(payload);

      if (!res.success) { toast.error(res.message ?? "Something went wrong"); return; }

      toast.success(editing ? "Course updated!" : "Course submitted for approval!");
      setShowForm(false);

      if (editing) {
        setCourses((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...payload, status: "PENDING" } : c));
      } else {
        const data = (res as { success: true; data: Record<string, unknown> }).data;
        const newCourse: Course = {
          id: String(data?.id ?? Date.now()),
          title, description, category,
          price: price ? Number(price) : undefined,
          image: imageUrl.trim() || null,
          status: "PENDING",
          totalEnrollments: 0,
        };
        setCourses((prev) => [newCourse, ...prev]);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this course?")) return;
    startTransition(async () => {
      const res = await deleteCourseAction(id);
      if (!res.success) { toast.error(res.message ?? "Delete failed"); return; }
      toast.success("Course deleted.");
      setCourses((prev) => prev.filter((c) => c.id !== id));
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="gap-2">
          <Plus className="size-4" /> Add Course
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/40 shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-base">{editing ? "Edit Course" : "New Course"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="size-8">
                <X className="size-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="c-title">Title *</Label>
                <Input id="c-title" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Introduction to React" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-desc">Description *</Label>
                <textarea id="c-desc"
                  className="w-full min-h-20 rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="What will students learn?"
                  value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="c-price">Price ($)</Label>
                  <Input id="c-price" type="number" min="0" step="0.01" placeholder="0"
                    value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-category">Category</Label>
                  <select id="c-category"
                    className="w-full h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={category} onChange={(e) => setCategory(e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Course Image</Label>
                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  fallbackSrc={CATEGORY_IMAGES[category]}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                New/edited courses go back to PENDING until admin approves.
              </p>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isPending} className="gap-2">
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                  {editing ? "Save Changes" : "Submit for Approval"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {courses.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-dashed p-14 text-center">
          <BookOpen className="mx-auto mb-4 size-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">No courses yet.</p>
          <Button className="mt-4 gap-2" onClick={openCreate}>
            <Plus className="size-4" /> Create your first course
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => {
            const statusKey = (c.status ?? "PENDING").toUpperCase();
            const statusClass = STATUS_STYLE[statusKey] ?? STATUS_STYLE.PENDING;
            const imgSrc = getCourseImage(c);
            return (
              <Card key={c.id} className="group overflow-hidden">
                <div className="relative h-36 w-full bg-muted">
                  <Image src={imgSrc} alt={c.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
                  <div className="absolute inset-0 bg-black/10" />
                  <span className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
                    {statusKey.charAt(0) + statusKey.slice(1).toLowerCase()}
                  </span>
                </div>
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold leading-snug line-clamp-1">{c.title}</h3>
                  {c.description != null && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                  )}
                  {c.category != null && (
                    <span className="inline-block rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                      {c.category}
                    </span>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 font-semibold text-primary">
                        <DollarSign className="size-3.5" />
                        {c.price != null && c.price > 0 ? c.price : "Free"}
                      </span>
                      {c.totalEnrollments != null && (
                        <span className="flex items-center gap-1 text-muted-foreground text-xs">
                          <Users className="size-3" /> {c.totalEnrollments}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="size-7" onClick={() => openEdit(c)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(c.id)} disabled={isPending}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
