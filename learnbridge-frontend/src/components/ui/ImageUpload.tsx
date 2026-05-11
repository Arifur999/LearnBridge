"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadCourseImageAction } from "@/actions/upload.action";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  fallbackSrc?: string;
}

export default function ImageUpload({ value, onChange, fallbackSrc }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.append("image", file);
      const res = await uploadCourseImageAction(fd);
      if (!res.success) {
        toast.error(res.message ?? "Upload failed");
      } else {
        onChange(res.url!);
        toast.success("Image uploaded!");
      }
    });
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const preview = value || fallbackSrc;

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-lg border h-44 w-full bg-muted group">
          <Image src={preview} alt="Course image" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-full bg-white/90 p-2 text-sm font-medium text-gray-800 hover:bg-white flex items-center gap-1.5"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              Change
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-full bg-white/90 p-2 text-sm font-medium text-red-600 hover:bg-white flex items-center gap-1.5"
                disabled={isPending}
              >
                <X className="size-4" /> Remove
              </button>
            )}
          </div>
          {isPending && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="size-7 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !isPending && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`flex h-44 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors
            ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40"}
            ${isPending ? "pointer-events-none opacity-60" : ""}`}
        >
          {isPending ? (
            <>
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading…</p>
            </>
          ) : (
            <>
              <div className="rounded-full bg-muted p-3">
                <ImagePlus className="size-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {isDragging ? "Drop image here" : "Click or drag image here"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WEBP · max 5 MB</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
