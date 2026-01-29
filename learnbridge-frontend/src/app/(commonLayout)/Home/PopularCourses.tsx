import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPopularCourses } from "@/actions/course.action";

interface Course {
  id: string;
  title: string;
  description: string;
}

export default async function PopularCourses() {
  const courses: Course[] = await getPopularCourses(3);

  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Popular Courses</h2>

          <Button asChild variant="outline">
            <Link href="/courses">View All</Link>
          </Button>
        </div>

        {courses.length === 0 && (
          <p className="text-muted-foreground">
            No courses available right now.
          </p>
        )}

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
      </div>
    </section>
  );
}
