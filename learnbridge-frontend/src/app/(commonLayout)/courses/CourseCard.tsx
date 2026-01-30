import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  price?: number;
}

const CourseCard = ({
  id,
  title,
  description,
  price,
}: CourseCardProps) => {
  return (
    <div className="rounded-xl border bg-background p-4 transition hover:shadow-md">
      {/* Thumbnail placeholder */}
      <div className="mb-4 h-40 rounded-md bg-muted" />

      <h3 className="mb-2 line-clamp-1 text-lg font-semibold">
        {title}
      </h3>

      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
        {description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {price ? `৳ ${price}` : "Free"}
        </span>

        <Button asChild size="sm">
          <Link href={`/courses/${id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
