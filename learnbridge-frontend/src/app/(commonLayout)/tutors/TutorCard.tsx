import Link from "next/link";
import { Star, BadgeCheck, BookOpen } from "lucide-react";

interface TutorCardProps {
  id: string;
  title: string;
  description: string;
  price?: number;
  category?: string;
  rating?: number;
  subjects?: string[];
  profileImage?: string;
}

const TutorCard = ({
  id,
  title,
  description,
  price,
  category,
  rating,
  subjects = [],
  profileImage,
}: TutorCardProps) => {
  const parts = title?.trim().split(/\s+/) ?? [];
  const initials =
    parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (parts[0]?.[0]?.toUpperCase() ?? "T");

  const priceLabel =
    price != null && price > 0
      ? `BDT ${price}`
      : price === 0
      ? "Free"
      : null;

  return (
    <Link
      href={`/tutors/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl"
    >
      {/* Hover glow ring */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 ring-1 ring-primary/25 transition-opacity duration-300 group-hover:opacity-100" />

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="relative flex h-52 flex-col items-center justify-center overflow-hidden">

        {/* Indigo gradient background — matches brand primary */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-400 via-indigo-600 to-indigo-900 dark:from-indigo-600 dark:via-indigo-800 dark:to-indigo-950" />

        {/* Radial centre-glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_75%_at_50%_25%,rgba(165,180,252,0.30),transparent)]" />

        {/* Rating pill — top left */}
        {typeof rating === "number" && rating > 0 && (
          <div className="absolute left-3.5 top-3.5 z-10 flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
          </div>
        )}

        {/* Category pill — top right */}
        {category && (
          <div className="absolute right-3.5 top-3.5 z-10 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm ring-1 ring-white/30">
            {category}
          </div>
        )}

        {/* Avatar */}
        <div className="relative z-10 mb-2">
          {profileImage ? (
            <img
              src={profileImage}
              alt={title}
              className="size-[88px] rounded-full object-cover ring-4 ring-white/90 shadow-xl transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-[88px] items-center justify-center rounded-full bg-white/15 text-3xl font-black text-white ring-4 ring-white/90 shadow-xl backdrop-blur-sm transition-transform duration-500 group-hover:scale-105">
              {initials}
            </div>
          )}

          {/* Verified badge */}
          <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-white shadow-md">
            <BadgeCheck className="size-3.5 text-indigo-600" />
          </div>
        </div>

        {/* ── Colorful wave lines ── */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg
            viewBox="0 0 500 64"
            preserveAspectRatio="none"
            className="absolute bottom-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Wave 1 — cyan (complements indigo) */}
            <path
              d="M0,42 C55,22 110,58 165,38 C220,18 275,54 330,36 C385,18 440,50 500,32 L500,64 L0,64 Z"
              fill="rgba(34,211,238,0.18)"
            />
            <path
              d="M0,42 C55,22 110,58 165,38 C220,18 275,54 330,36 C385,18 440,50 500,32"
              fill="none"
              stroke="rgba(34,211,238,0.75)"
              strokeWidth="1.6"
            />

            {/* Wave 2 — violet */}
            <path
              d="M0,50 C65,30 130,62 200,44 C270,26 335,58 400,40 C435,30 468,46 500,38 L500,64 L0,64 Z"
              fill="rgba(167,139,250,0.15)"
            />
            <path
              d="M0,50 C65,30 130,62 200,44 C270,26 335,58 400,40 C435,30 468,46 500,38"
              fill="none"
              stroke="rgba(167,139,250,0.75)"
              strokeWidth="1.6"
            />

            {/* Wave 3 — emerald */}
            <path
              d="M0,56 C80,38 160,64 240,50 C320,36 400,62 500,48 L500,64 L0,64 Z"
              fill="rgba(52,211,153,0.12)"
            />
            <path
              d="M0,56 C80,38 160,64 240,50 C320,36 400,62 500,48"
              fill="none"
              stroke="rgba(52,211,153,0.72)"
              strokeWidth="1.6"
            />

            {/* Wave 4 — sky blue (closest to brand, front layer) */}
            <path
              d="M0,60 C70,44 150,66 230,55 C310,44 390,64 500,54 L500,64 L0,64 Z"
              fill="rgba(147,197,253,0.18)"
            />
            <path
              d="M0,60 C70,44 150,66 230,55 C310,44 390,64 500,54"
              fill="none"
              stroke="rgba(147,197,253,0.85)"
              strokeWidth="1.8"
            />
          </svg>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">

        {/* Active indicator */}
        <div className="mb-2 flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-muted-foreground">Expert Tutor</span>
        </div>

        {/* Name */}
        <h3 className="mb-1 line-clamp-1 text-base font-bold leading-snug tracking-tight transition-colors group-hover:text-primary">
          {title}
        </h3>

        {/* Description */}
        {description ? (
          <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : (
          <p className="mb-4 flex-1 text-sm italic text-muted-foreground/40">
            No description provided.
          </p>
        )}

        {/* Subjects */}
        {subjects.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {subjects.slice(0, 3).map((sub) => (
              <span
                key={sub}
                className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
              >
                <BookOpen className="size-2.5 opacity-55" />
                {sub}
              </span>
            ))}
            {subjects.length > 3 && (
              <span className="rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                +{subjects.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/40 pt-3.5">
          <div>
            {priceLabel ? (
              <>
                <span className="text-base font-extrabold text-foreground">
                  {priceLabel}
                </span>
                {price != null && price > 0 && (
                  <span className="ml-1 text-xs text-muted-foreground">/session</span>
                )}
              </>
            ) : (
              <span className="text-xs text-muted-foreground">Price on request</span>
            )}
          </div>

          {/* CTA — indigo brand colors */}
          <span className="shrink-0 rounded-full border border-primary/30 bg-primary/8 px-3.5 py-1.5 text-xs font-semibold text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
            View Profile →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TutorCard;
