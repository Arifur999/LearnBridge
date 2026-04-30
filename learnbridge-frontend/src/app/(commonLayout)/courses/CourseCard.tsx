import Link from "next/link";

import { Button } from "@/components/ui/button";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  price?: number;
  category?: string;
}

const CourseCard = ({
  id,
  title,
  description,
  price,
  category,
}: CourseCardProps) => {
  return (
    <div className="rounded-xl border bg-background p-4 transition hover:shadow-md">
      <div className="mb-4 h-40 rounded-md bg-muted" />

      <h3 className="mb-2 line-clamp-1 text-lg font-semibold">{title}</h3>

      {category && (
        <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
          {category}
        </p>
      )}

      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
        {description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {price ? `BDT ${price}/session` : "Free"}
        </span>

        <Button asChild size="sm">
          <Link href={`/tutors/${id}`}>View Profile</Link>
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
