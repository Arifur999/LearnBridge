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
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl"
    >
      {/* Hover glow ring */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 ring-1 ring-primary/20 transition-opacity duration-300 group-hover:opacity-100" />

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="relative flex h-52 flex-col items-center justify-center overflow-hidden bg-muted/30 dark:bg-muted/10">

        {/* Very subtle primary tint — transparent feel */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-violet-400/5" />

        {/* Soft dot mesh */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.511 0.262 264.05 / 0.4) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Rating pill — top left */}
        {typeof rating === "number" && rating > 0 && (
          <div className="absolute left-3.5 top-3.5 z-10 flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-xs font-semibold text-amber-600 shadow-sm backdrop-blur-sm dark:text-amber-400">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
          </div>
        )}

        {/* Category pill — top right */}
        {category && (
          <div className="absolute right-3.5 top-3.5 z-10 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm">
            {category}
          </div>
        )}

        {/* Avatar */}
        <div className="relative z-10 mb-2">
          {profileImage ? (
            <img
              src={profileImage}
              alt={title}
              className="size-[88px] rounded-full object-cover ring-4 ring-background shadow-lg transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-[88px] items-center justify-center rounded-full bg-primary/10 text-3xl font-black text-primary ring-4 ring-background shadow-lg transition-transform duration-500 group-hover:scale-105">
              {initials}
            </div>
          )}

          {/* Verified badge */}
          <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border/50">
            <BadgeCheck className="size-3.5 text-primary" />
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
            {/* Wave 1 — cyan */}
            <path
              d="M0,42 C55,22 110,58 165,38 C220,18 275,54 330,36 C385,18 440,50 500,32 L500,64 L0,64 Z"
              fill="rgba(34,211,238,0.10)"
            />
            <path
              d="M0,42 C55,22 110,58 165,38 C220,18 275,54 330,36 C385,18 440,50 500,32"
              fill="none"
              stroke="rgba(34,211,238,0.60)"
              strokeWidth="1.5"
            />

            {/* Wave 2 — violet */}
            <path
              d="M0,50 C65,30 130,62 200,44 C270,26 335,58 400,40 C435,30 468,46 500,38 L500,64 L0,64 Z"
              fill="rgba(139,92,246,0.09)"
            />
            <path
              d="M0,50 C65,30 130,62 200,44 C270,26 335,58 400,40 C435,30 468,46 500,38"
              fill="none"
              stroke="rgba(139,92,246,0.65)"
              strokeWidth="1.5"
            />

            {/* Wave 3 — emerald */}
            <path
              d="M0,56 C80,38 160,64 240,50 C320,36 400,62 500,48 L500,64 L0,64 Z"
              fill="rgba(52,211,153,0.09)"
            />
            <path
              d="M0,56 C80,38 160,64 240,50 C320,36 400,62 500,48"
              fill="none"
              stroke="rgba(52,211,153,0.65)"
              strokeWidth="1.5"
            />

            {/* Wave 4 — indigo/primary (front, thickest) */}
            <path
              d="M0,60 C70,44 150,66 230,55 C310,44 390,64 500,54 L500,64 L0,64 Z"
              fill="rgba(99,102,241,0.12)"
            />
            <path
              d="M0,60 C70,44 150,66 230,55 C310,44 390,64 500,54"
              fill="none"
              stroke="rgba(99,102,241,0.75)"
              strokeWidth="2"
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

          <span className="shrink-0 rounded-full border border-primary/30 bg-primary/8 px-3.5 py-1.5 text-xs font-semibold text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
            View Profile →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TutorCard;
