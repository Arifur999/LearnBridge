import Link from "next/link";
import { Star, BookOpen, ArrowRight } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  price?: number;
  category?: string;
  rating?: number;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`size-3.5 ${
          star <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "fill-muted text-muted-foreground"
        }`}
      />
    ))}
    <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
  </div>
);

const CourseCard = ({ id, title, description, price, category, rating }: CourseCardProps) => {
  return (
    <Link
      href={`/tutors/${id}`}
      className="group flex flex-col rounded-2xl border bg-background shadow-sm transition-all hover:shadow-md hover:border-primary/40"
    >
      <div className="flex h-40 items-center justify-center rounded-t-2xl bg-linear-to-br from-primary/10 to-violet-100">
        <BookOpen className="size-12 text-primary/35 transition-transform group-hover:scale-110" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          {category && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {category}
            </span>
          )}
          {typeof rating === "number" && <StarRating rating={rating} />}
        </div>

        <h3 className="mb-1.5 line-clamp-1 font-semibold leading-snug group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">{description}</p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-primary">
            {price ? `BDT ${price}/session` : "Free"}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            View Profile <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
