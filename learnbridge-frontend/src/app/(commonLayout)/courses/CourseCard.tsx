import Link from "next/link";
import { Star } from "lucide-react";

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
  const cardImage = getCourseImage(image, category);

  return (
    <Link
      href={`${basePath}/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl dark:bg-card"
    >
      {/* Image with overlays */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cardImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/55 via-transparent to-transparent" />

        {/* Category badge on image */}
        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {category}
          </span>
        )}

        {/* Rating badge on image */}
        {typeof rating === "number" && rating > 0 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1.5 line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="mb-4 flex-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="flex items-center justify-between border-t border-border/50 pt-3">
          <span className="font-bold text-primary">
            {price ? `BDT ${price}` : "Free"}
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
            View Course →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
