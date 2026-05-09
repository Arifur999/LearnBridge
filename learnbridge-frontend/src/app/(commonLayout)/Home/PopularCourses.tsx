import Link from "next/link";
import { Star, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPopularCourses } from "@/actions/course.action";

interface Course {
  id: string;
  title: string;
  description: string;
  price?: number;
  category?: string;
  rating?: number;
}

const categoryColors: Record<string, string> = {
  programming: "bg-indigo-100 text-indigo-700",
  math: "bg-violet-100 text-violet-700",
  english: "bg-blue-100 text-blue-700",
  science: "bg-emerald-100 text-emerald-700",
};

const getCategoryColor = (cat?: string) => {
  const key = (cat ?? "").toLowerCase();
  return categoryColors[key] ?? "bg-primary/10 text-primary";
};

export default async function PopularCourses() {
  const courses: Course[] = await getPopularCourses(3);

  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-primary">
              Top Picks
            </p>
            <h2 className="text-3xl font-bold">Featured Tutors</h2>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/tutors">
              View All
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
            <BookOpen className="mx-auto mb-3 size-10 text-primary/40" />
            <p className="font-medium">No tutors available right now.</p>
            <p className="mt-1 text-sm">Check back soon or register as a tutor!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group flex flex-col rounded-2xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Placeholder image area */}
                <div className="mb-4 flex h-36 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-violet-100">
                  <BookOpen className="size-12 text-primary/40" />
                </div>

                <div className="mb-2 flex items-center justify-between gap-2">
                  {course.category && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(course.category)}`}
                    >
                      {course.category}
                    </span>
                  )}
                  {typeof course.rating === "number" && (
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <Star className="size-3 fill-amber-400" />
                      {course.rating.toFixed(1)}
                    </div>
                  )}
                </div>

                <h3 className="mb-1 font-semibold leading-snug">{course.title}</h3>
                <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">
                  {course.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">
                    {course.price ? `BDT ${course.price}/session` : "Free"}
                  </span>
                  <Button asChild size="sm">
                    <Link href={`/tutors/${course.id}`}>Book Now</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
