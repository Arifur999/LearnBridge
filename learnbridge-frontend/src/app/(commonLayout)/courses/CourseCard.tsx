"use client";

import Link from "next/link";
import { Star, BookOpen, Code2, Palette, Calculator, FlaskConical, Languages, Briefcase, Music, Brush, ArrowRight } from "lucide-react";
import { useState } from "react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  price?: number;
  category?: string;
  rating?: number;
  image?: string;
  basePath?: string;
}

/* Unsplash photos per category — reliable CDN, no auth needed */
const CATEGORY_IMAGES: Record<string, string> = {
  Programming:  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
  PHP:          "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&q=80",
  CSS:          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  JavaScript:   "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&q=80",
  Design:       "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
  Mathematics:  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80",
  Science:      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80",
  Language:     "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80",
  Business:     "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
  Music:        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80",
  Art:          "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
  default:      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
};

/* Per-category style config */
const CATEGORY_CONFIG: Record<string, {
  gradient: string;
  iconBg: string;
  chipBg: string;
  chipText: string;
  chipBorder: string;
  barFrom: string;
  barTo: string;
  Icon: React.ElementType;
}> = {
  Programming: { gradient: "from-blue-600 via-indigo-600 to-violet-700", iconBg: "bg-blue-500/20", chipBg: "bg-blue-50 dark:bg-blue-950/50", chipText: "text-blue-700 dark:text-blue-300", chipBorder: "border-blue-200 dark:border-blue-800", barFrom: "#3b82f6", barTo: "#4f46e5", Icon: Code2 },
  PHP:         { gradient: "from-indigo-600 via-violet-600 to-purple-700", iconBg: "bg-indigo-500/20", chipBg: "bg-indigo-50 dark:bg-indigo-950/50", chipText: "text-indigo-700 dark:text-indigo-300", chipBorder: "border-indigo-200 dark:border-indigo-800", barFrom: "#6366f1", barTo: "#7c3aed", Icon: Code2 },
  CSS:         { gradient: "from-sky-500 via-blue-500 to-indigo-600", iconBg: "bg-sky-500/20", chipBg: "bg-sky-50 dark:bg-sky-950/50", chipText: "text-sky-700 dark:text-sky-300", chipBorder: "border-sky-200 dark:border-sky-800", barFrom: "#0ea5e9", barTo: "#4f46e5", Icon: Code2 },
  JavaScript:  { gradient: "from-yellow-400 via-amber-400 to-orange-500", iconBg: "bg-yellow-400/20", chipBg: "bg-yellow-50 dark:bg-yellow-950/50", chipText: "text-yellow-700 dark:text-yellow-300", chipBorder: "border-yellow-200 dark:border-yellow-800", barFrom: "#facc15", barTo: "#f97316", Icon: Code2 },
  Design:      { gradient: "from-pink-500 via-rose-500 to-fuchsia-600", iconBg: "bg-pink-500/20", chipBg: "bg-pink-50 dark:bg-pink-950/50", chipText: "text-pink-700 dark:text-pink-300", chipBorder: "border-pink-200 dark:border-pink-800", barFrom: "#ec4899", barTo: "#c026d3", Icon: Palette },
  Mathematics: { gradient: "from-amber-500 via-orange-500 to-red-500", iconBg: "bg-amber-500/20", chipBg: "bg-amber-50 dark:bg-amber-950/50", chipText: "text-amber-700 dark:text-amber-300", chipBorder: "border-amber-200 dark:border-amber-800", barFrom: "#f59e0b", barTo: "#ef4444", Icon: Calculator },
  Science:     { gradient: "from-emerald-500 via-teal-500 to-cyan-600", iconBg: "bg-emerald-500/20", chipBg: "bg-emerald-50 dark:bg-emerald-950/50", chipText: "text-emerald-700 dark:text-emerald-300", chipBorder: "border-emerald-200 dark:border-emerald-800", barFrom: "#10b981", barTo: "#0891b2", Icon: FlaskConical },
  Language:    { gradient: "from-violet-500 via-purple-500 to-indigo-600", iconBg: "bg-violet-500/20", chipBg: "bg-violet-50 dark:bg-violet-950/50", chipText: "text-violet-700 dark:text-violet-300", chipBorder: "border-violet-200 dark:border-violet-800", barFrom: "#8b5cf6", barTo: "#4f46e5", Icon: Languages },
  Business:    { gradient: "from-cyan-500 via-sky-500 to-blue-600", iconBg: "bg-cyan-500/20", chipBg: "bg-cyan-50 dark:bg-cyan-950/50", chipText: "text-cyan-700 dark:text-cyan-300", chipBorder: "border-cyan-200 dark:border-cyan-800", barFrom: "#06b6d4", barTo: "#2563eb", Icon: Briefcase },
  Music:       { gradient: "from-red-500 via-rose-500 to-pink-600", iconBg: "bg-red-500/20", chipBg: "bg-red-50 dark:bg-red-950/50", chipText: "text-red-700 dark:text-red-300", chipBorder: "border-red-200 dark:border-red-800", barFrom: "#ef4444", barTo: "#db2777", Icon: Music },
  Art:         { gradient: "from-orange-400 via-amber-400 to-yellow-400", iconBg: "bg-orange-500/20", chipBg: "bg-orange-50 dark:bg-orange-950/50", chipText: "text-orange-700 dark:text-orange-300", chipBorder: "border-orange-200 dark:border-orange-800", barFrom: "#f97316", barTo: "#eab308", Icon: Brush },
};

const DEFAULT_CONFIG = {
  gradient: "from-indigo-500 via-violet-500 to-purple-600",
  iconBg: "bg-indigo-500/20",
  chipBg: "bg-primary/8",
  chipText: "text-primary",
  chipBorder: "border-primary/20",
  barFrom: "#6366f1",
  barTo: "#7c3aed",
  Icon: BookOpen,
};

function getConfig(category?: string) {
  return CATEGORY_CONFIG[category ?? ""] ?? DEFAULT_CONFIG;
}

function getCategoryImage(category?: string): string {
  return CATEGORY_IMAGES[category ?? ""] ?? CATEGORY_IMAGES.default;
}

const CourseCard = ({
  id,
  title,
  description,
  price,
  category,
  rating,
  image,
  basePath = "/courses",
}: CourseCardProps) => {
  /* Image fallback chain: backend image → unsplash photo → css gradient */
  const initialSrc = image || getCategoryImage(category);
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [showGradient, setShowGradient] = useState(false);

  const config = getConfig(category);
  const { Icon } = config;

  const priceLabel = price != null && price > 0 ? `BDT ${price}` : "Free";
  const isFree = !price || price === 0;

  const words = title?.trim().split(/\s+/) ?? [];
  const initials =
    words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : (words[0]?.[0]?.toUpperCase() ?? "C");

  function handleImgError() {
    if (imgSrc !== getCategoryImage(category)) {
      /* backend image failed → try unsplash fallback */
      setImgSrc(getCategoryImage(category));
    } else {
      /* unsplash also failed → show gradient */
      setShowGradient(true);
    }
  }

  return (
    <Link
      href={`${basePath}/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-2xl"
    >
      {/* Hover glow ring */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 ring-1 ring-primary/20 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Coloured top accent bar */}
      <div
        className="h-1 w-full shrink-0"
        style={{ background: `linear-gradient(to right, ${config.barFrom}, ${config.barTo})` }}
      />

      {/* ── Image / Gradient banner ──────────────────── */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {!showGradient ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={title}
              onError={handleImgError}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
          </>
        ) : (
          /* CSS gradient — last resort, always works */
          <div className={`relative flex h-full w-full flex-col items-center justify-center bg-linear-to-br ${config.gradient}`}>
            <div className="pointer-events-none absolute -right-8 -top-8 size-36 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -left-6 -bottom-6 size-28 rounded-full bg-white/5" />
            <div className={`mb-2 flex size-12 items-center justify-center rounded-2xl ${config.iconBg}`}>
              <Icon className="size-6 text-white/90" />
            </div>
            <p className="text-2xl font-black tracking-tight text-white/90">{initials}</p>
          </div>
        )}

        {/* Rating — top right */}
        {typeof rating === "number" && rating > 0 && (
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
          </div>
        )}

        {/* Price badge — bottom left */}
        <div className="absolute bottom-3 left-3 z-10 flex items-baseline gap-1.5">
          <span
            className={`rounded-full px-3 py-1 text-sm font-extrabold backdrop-blur-sm ${
              isFree
                ? "bg-emerald-500/90 text-white"
                : "bg-black/45 text-white ring-1 ring-white/25"
            }`}
          >
            {priceLabel}
          </span>
          {!isFree && <span className="text-xs text-white/65">/session</span>}
        </div>

        {/* Hover tint */}
        <div
          className="absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `linear-gradient(135deg, ${config.barFrom}25, transparent)` }}
        />
      </div>

      {/* ── Body ─────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5">

        {/* Category chip */}
        {category && (
          <div className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.chipBg} ${config.chipText} ${config.chipBorder}`}>
            <span className="size-1.5 rounded-full" style={{ background: config.barFrom }} />
            {category}
          </div>
        )}

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug tracking-tight transition-colors group-hover:text-primary">
          {title}
        </h3>

        {/* Description */}
        <p className="mb-5 flex-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpen className="size-3.5 opacity-60" />
            <span className="font-medium">View course</span>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 text-xs font-semibold text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
            Enroll
            <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
