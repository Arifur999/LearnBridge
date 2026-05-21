import Link from "next/link";
import { Star, GraduationCap, ArrowRight } from "lucide-react";

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
  const initials = title?.charAt(0)?.toUpperCase() ?? "T";

  return (
    <Link
      href={`/tutors/${id}`}
      className="group flex flex-col overflow-hidden border bg-card/90 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg dark:bg-card"
    >
      {/* Avatar area */}
      <div className="flex h-40 items-center justify-center bg-linear-to-br from-primary/12 via-background to-emerald-100 dark:from-primary/15 dark:via-card dark:to-emerald-950/35">
        {profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profileImage}
            alt={title}
            className="size-24 rounded-full object-cover ring-4 ring-background"
          />
        ) : (
          <div className="flex size-20 items-center justify-center rounded-full bg-primary/20 text-3xl font-bold text-primary ring-4 ring-background">
            {initials}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Category badge */}
        {category && (
          <span className="mb-2 inline-block w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {category}
          </span>
        )}

        {/* Name */}
        <h3 className="mb-1 line-clamp-2 min-h-10 font-semibold leading-snug transition-colors group-hover:text-primary">
          {title}
        </h3>

        {/* Star rating */}
        {typeof rating === "number" && (
          <div className="mb-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`size-3.5 ${
                  s <= Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted-foreground"
                }`}
              />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Bio */}
        <p className="mb-3 line-clamp-2 flex-1 text-sm text-muted-foreground">{description}</p>

        {/* Subjects */}
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
                +{subjects.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-primary">
            {price != null && price > 0 ? `BDT ${price}/session` : price === 0 ? "Free" : ""}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-primary transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            <GraduationCap className="size-3.5" />
            View Profile
            <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TutorCard;
