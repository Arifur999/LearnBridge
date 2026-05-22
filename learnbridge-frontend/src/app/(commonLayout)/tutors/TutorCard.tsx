import Link from "next/link";
import { Star } from "lucide-react";

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

  return (
    <Link
      href={`/tutors/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl dark:bg-card"
    >
      {/* Avatar header */}
      <div className="relative flex h-44 items-center justify-center bg-linear-to-br from-primary/15 via-background to-violet-100/50 dark:from-primary/20 dark:via-card dark:to-violet-950/30">
        {typeof rating === "number" && rating > 0 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
          </div>
        )}
        {profileImage ? (
          <img
            src={profileImage}
            alt={title}
            className="size-24 rounded-full object-cover ring-4 ring-background shadow-md"
          />
        ) : (
          <div className="flex size-24 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary ring-4 ring-background shadow-md">
            {initials}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {category && (
          <span className="mb-1.5 inline-block w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {category}
          </span>
        )}

        <h3 className="mb-1 line-clamp-1 font-semibold leading-snug transition-colors group-hover:text-primary">
          {title}
        </h3>

        <p className="mb-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {description}
        </p>

        {subjects.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {subjects.slice(0, 3).map((sub) => (
              <span
                key={sub}
                className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
              >
                {sub}
              </span>
            ))}
            {subjects.length > 3 && (
              <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                +{subjects.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-3">
          <span className="font-bold text-primary">
            {price != null && price > 0
              ? `BDT ${price}`
              : price === 0
              ? "Free"
              : ""}
            {price != null && price > 0 && (
              <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                /session
              </span>
            )}
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
            View Profile →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TutorCard;
