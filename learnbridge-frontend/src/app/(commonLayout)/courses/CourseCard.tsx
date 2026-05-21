import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

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

const CATEGORY_IMAGES: Record<string, string> = {
  Programming: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
  Design:      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
  Mathematics: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80",
  Science:     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  Language:    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80",
  Business:    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
  Music:       "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80",
  Art:         "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&q=80",
  default:     "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80",
};

function getCourseImage(image?: string, category?: string): string {
  if (image) return image;
  return CATEGORY_IMAGES[category ?? ""] ?? CATEGORY_IMAGES.default;
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

const CourseCard = ({ id, title, description, price, category, rating, image, basePath = "/courses" }: CourseCardProps) => {
  const cardImage = getCourseImage(image, category);

  return (
    <Link
      href={`${basePath}/${id}`}
      className="group flex flex-col overflow-hidden border bg-card/90 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg dark:bg-card"
    >
      <div className="relative h-44 overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cardImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
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

        <h3 className="mb-1.5 line-clamp-2 min-h-11 font-semibold leading-snug transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">{description}</p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-primary">
            {price ? `BDT ${price}/session` : "Free"}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-primary transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            View Course <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
