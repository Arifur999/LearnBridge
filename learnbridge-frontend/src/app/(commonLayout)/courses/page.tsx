import { getAllCourses } from "@/actions/course.action";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  description: string;
}

export default async function CoursesPage() {
  const courses: Course[] = await getAllCourses();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">All Courses</h1>
        <p className="mt-2 text-muted-foreground">
          Explore all available courses and start learning today.
        </p>
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <p className="text-muted-foreground">
          No courses found.
        </p>
      )}

      {/* Courses Grid */}
      {courses.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-xl border bg-background p-4"
            >
              <div className="mb-4 h-40 rounded-md bg-gray-200" />

              <h3 className="mb-2 font-semibold">
                {course.title}
              </h3>

              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                {course.description}
              </p>

              <Button asChild size="sm">
                <Link href={`/courses/${course.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
