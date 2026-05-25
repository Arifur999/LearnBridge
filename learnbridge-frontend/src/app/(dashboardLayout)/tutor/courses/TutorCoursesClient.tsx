"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen, Plus, Pencil, Trash2, X, Loader2,
  Users, CheckCircle2, Clock, XCircle, Sparkles,
  GraduationCap, DollarSign, LayoutGrid, Save,
} from "lucide-react";
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
  "Programming","Design","Mathematics","Science",
  "Language","Business","Music","Art","Other",
];

const CATEGORY_IMAGES: Record<string, string> = {
  Programming: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
  Design:      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
  Mathematics: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80",
  Science:     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  Language:    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80",
  Business:    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
  Music:       "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80",
  Art:         "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&q=80",
  Other:       "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80",
};

const CATEGORY_COLORS: Record<string, { bar: string; chip: string; chipText: string }> = {
  Programming: { bar: "#6366f1", chip: "bg-indigo-50 dark:bg-indigo-950/40", chipText: "text-indigo-700 dark:text-indigo-300" },
  Design:      { bar: "#ec4899", chip: "bg-pink-50 dark:bg-pink-950/40",    chipText: "text-pink-700 dark:text-pink-300"   },
  Mathematics: { bar: "#f59e0b", chip: "bg-amber-50 dark:bg-amber-950/40",  chipText: "text-amber-700 dark:text-amber-300" },
  Science:     { bar: "#10b981", chip: "bg-emerald-50 dark:bg-emerald-950/40", chipText: "text-emerald-700 dark:text-emerald-300" },
  Language:    { bar: "#8b5cf6", chip: "bg-violet-50 dark:bg-violet-950/40", chipText: "text-violet-700 dark:text-violet-300" },
  Business:    { bar: "#06b6d4", chip: "bg-cyan-50 dark:bg-cyan-950/40",    chipText: "text-cyan-700 dark:text-cyan-300"   },
  Music:       { bar: "#ef4444", chip: "bg-red-50 dark:bg-red-950/40",      chipText: "text-red-700 dark:text-red-300"     },
  Art:         { bar: "#f97316", chip: "bg-orange-50 dark:bg-orange-950/40", chipText: "text-orange-700 dark:text-orange-300" },
  Other:       { bar: "#6366f1", chip: "bg-indigo-50 dark:bg-indigo-950/40", chipText: "text-indigo-700 dark:text-indigo-300" },
};

const STATUS_CFG: Record<string, { icon: React.ElementType; bg: string; text: string; dot: string; label: string }> = {
  APPROVED: { icon: CheckCircle2, bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500", label: "Approved" },
  PENDING:  { icon: Clock,        bg: "bg-amber-100 dark:bg-amber-900/30",     text: "text-amber-700 dark:text-amber-400",    dot: "bg-amber-500",  label: "Pending"  },
  REJECTED: { icon: XCircle,      bg: "bg-red-100 dark:bg-red-900/30",         text: "text-red-600 dark:text-red-400",        dot: "bg-red-500",    label: "Rejected" },
};

function getCourseImage(c: Course) {
  return c.image || CATEGORY_IMAGES[c.category ?? "Other"] || CATEGORY_IMAGES.Other;
}

export default function TutorCoursesClient({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses]   = useState<Course[]>(initialCourses);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Course | null>(null);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice]           = useState("");
  const [category, setCategory]     = useState("Programming");
  const [imageUrl, setImageUrl]     = useState("");

  const approved = courses.filter((c) => (c.status ?? "").toUpperCase() === "APPROVED").length;
  const pending  = courses.filter((c) => (c.status ?? "").toUpperCase() === "PENDING").length;
  const totalEnrollments = courses.reduce((s, c) => s + (c.totalEnrollments ?? 0), 0);

  function openCreate() {
    setEditing(null);
    setTitle(""); setDescription(""); setPrice(""); setCategory("Programming"); setImageUrl("");
    setShowForm(true);
  }
  function openEdit(c: Course) {
    setEditing(c);
    setTitle(c.title ?? ""); setDescription(c.description ?? "");
    setPrice(c.price != null ? String(c.price) : "");
    setCategory(c.category ?? "Programming"); setImageUrl(c.image ?? "");
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) { toast.error("Description is required"); return; }
    const payload = { title, description, category, price: price ? Number(price) : undefined, image: imageUrl.trim() || undefined };
    startTransition(async () => {
      const res = editing ? await updateCourseAction(editing.id, payload) : await createCourseAction(payload);
      if (!res.success) { toast.error(res.message ?? "Something went wrong"); return; }
      toast.success(editing ? "Course updated!" : "Course submitted for approval!");
      setShowForm(false);
      if (editing) {
        setCourses((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...payload, status: "PENDING" } : c));
      } else {
        const data = (res as { success: true; data: Record<string, unknown> }).data;
        setCourses((prev) => [{ id: String(data?.id ?? Date.now()), title, description, category, price: price ? Number(price) : undefined, image: imageUrl.trim() || null, status: "PENDING", totalEnrollments: 0 }, ...prev]);
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
    <div className="space-y-8">

      {/* ── Header row ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Stats pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { icon: LayoutGrid,     label: "Total",      value: courses.length,    color: "bg-primary/10 text-primary" },
            { icon: CheckCircle2,   label: "Approved",   value: approved,          color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
            { icon: Clock,          label: "Pending",    value: pending,           color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
            { icon: Users,          label: "Enrollments",value: totalEnrollments,  color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${color}`}>
              <Icon className="size-3.5" />
              {value} {label}
            </div>
          ))}
        </div>
        <Button onClick={openCreate} className="gap-2 rounded-xl self-start sm:self-auto">
          <Plus className="size-4" /> Add Course
        </Button>
      </div>

      {/* ── Create / Edit Modal Overlay ─────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />

          {/* Modal panel */}
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl border border-border/60 bg-card shadow-2xl">

            {/* Gradient top bar */}
            <div className="h-1 w-full bg-linear-to-r from-primary via-violet-500 to-indigo-600" />

            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10">
                  {editing ? (
                    <Pencil className="size-4 text-primary" />
                  ) : (
                    <Sparkles className="size-4 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">
                    {editing ? "Edit Course" : "Create New Course"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {editing ? "Update your course details below" : "Fill in the details and submit for approval"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="flex size-9 items-center justify-center rounded-xl border bg-muted/50 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Course Title */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Course Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Introduction to PHP"
                  required
                  className="h-11 rounded-xl text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Description <span className="text-red-500">*</span>
                </Label>
                <textarea
                  className="w-full min-h-[100px] resize-none rounded-xl border bg-background px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="What will students learn? What topics are covered?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Price + Category side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Price (BDT)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">৳</span>
                    <Input
                      type="number" min="0" step="0.01" placeholder="0"
                      value={price} onChange={(e) => setPrice(e.target.value)}
                      className="h-11 rounded-xl pl-7 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Category
                  </Label>
                  <select
                    className="w-full h-11 rounded-xl border bg-background px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Image upload */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Course Image
                </Label>
                <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-3">
                  <ImageUpload
                    value={imageUrl}
                    onChange={setImageUrl}
                    fallbackSrc={CATEGORY_IMAGES[category]}
                  />
                </div>
              </div>

              {/* Info notice */}
              <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
                <Clock className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  New or edited courses are set to <strong>Pending</strong> until an admin approves them.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 border-t pt-5">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 gap-2 rounded-xl"
                >
                  {isPending
                    ? <Loader2 className="size-4 animate-spin" />
                    : <Save className="size-4" />
                  }
                  {editing ? "Save Changes" : "Submit for Approval"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl px-6"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────────────── */}
      {courses.length === 0 && !showForm && (
        <div className="flex flex-col items-center gap-5 rounded-3xl border-2 border-dashed py-20 text-center">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-muted">
            <GraduationCap className="size-10 text-muted-foreground/40" />
          </div>
          <div>
            <p className="text-base font-semibold">No courses yet</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Share your expertise by creating your first course. Students are waiting!
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2 rounded-xl">
            <Plus className="size-4" /> Create your first course
          </Button>
        </div>
      )}

      {/* ── Course grid ─────────────────────────────────────────── */}
      {courses.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => {
            const statusKey = (c.status ?? "PENDING").toUpperCase();
            const scfg = STATUS_CFG[statusKey] ?? STATUS_CFG.PENDING;
            const StatusIcon = scfg.icon;
            const imgSrc = getCourseImage(c);
            const catColor = CATEGORY_COLORS[c.category ?? "Other"] ?? CATEGORY_COLORS.Other;
            const isFree = !c.price || c.price === 0;

            return (
              <div
                key={c.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Top accent bar */}
                <div className="h-[3px] w-full shrink-0"
                  style={{ background: `linear-gradient(to right, ${catColor.bar}, ${catColor.bar}99)` }} />

                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgSrc} alt={c.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = CATEGORY_IMAGES.Other; }} />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Status badge */}
                  <span className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${scfg.bg} ${scfg.text}`}>
                    <span className={`size-1.5 rounded-full ${scfg.dot}`} />
                    {scfg.label}
                  </span>

                  {/* Price */}
                  <span className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-sm font-extrabold backdrop-blur-sm ${isFree ? "bg-emerald-500/90 text-white" : "bg-black/45 text-white ring-1 ring-white/25"}`}>
                    {isFree ? "Free" : `BDT ${c.price}`}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Category chip */}
                  {c.category && (
                    <span className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${catColor.chip} ${catColor.chipText}`}>
                      <span className="size-1.5 rounded-full" style={{ background: catColor.bar }} />
                      {c.category}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="mb-1.5 line-clamp-2 text-sm font-bold leading-snug tracking-tight transition-colors group-hover:text-primary">
                    {c.title}
                  </h3>

                  {/* Description */}
                  {c.description && (
                    <p className="mb-4 flex-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {c.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="size-3.5 opacity-60" />
                      <span>{c.totalEnrollments ?? 0} enrolled</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        onClick={() => openEdit(c)}
                        title="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 rounded-xl text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                        onClick={() => handleDelete(c.id)}
                        disabled={isPending}
                        title="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
