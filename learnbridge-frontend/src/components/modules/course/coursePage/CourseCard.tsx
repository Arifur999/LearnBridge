import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users } from "lucide-react";
import { Course } from "@/types";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-50">
            <BookOpen className="h-12 w-12 text-indigo-300" />
          </div>
        )}
        {course.status && course.status !== "PUBLISHED" && (
          <Badge className="absolute top-2 right-2" variant="secondary">
            {course.status}
          </Badge>
        )}
      </div>
      <CardContent className="pt-4 pb-4 px-4 space-y-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {course.category && (
            <Badge variant="outline" className="text-xs">{course.category.name}</Badge>
          )}
          <Badge variant="secondary" className="text-xs capitalize">
            {course.level?.toLowerCase() ?? "beginner"}
          </Badge>
        </div>

        <Link href={`/courses/${course.id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="font-semibold line-clamp-2">{course.title}</h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{course._count?.enrollments ?? 0} students</span>
          </div>
          <p className="font-bold text-sm">
            {course.price === 0 ? "Free" : `$${course.price}`}
          </p>
        </div>

        {(course.mentor || course.institute) && (
          <p className="text-xs text-muted-foreground">
            by {course.mentor?.user?.name ?? course.institute?.name ?? "Instructor"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
