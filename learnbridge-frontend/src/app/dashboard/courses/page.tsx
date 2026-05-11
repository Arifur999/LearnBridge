import Link from "next/link";
import { getMyEnrollments as getEnrolledCoursesAction } from "@/actions/enrollment.action";
import DashPageHeader from "@/components/layout/DashPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ArrowRight } from "lucide-react";

export default async function StudentCoursesPage() {
  const enrollments = await getEnrolledCoursesAction();
  const list = Array.isArray(enrollments) ? enrollments : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DashPageHeader title="My Courses" description="Courses you are enrolled in." className="mb-0" />
        <Button asChild variant="outline">
          <Link href="/courses">Browse Courses <ArrowRight className="ml-2 size-4" /></Link>
        </Button>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <BookOpen className="mx-auto mb-4 size-10 text-muted-foreground/40" />
          <p className="font-medium">No courses enrolled yet.</p>
          <Button asChild className="mt-4">
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((enrollment: Record<string, unknown>, i) => {
            const course = enrollment?.course as Record<string, unknown> | undefined ?? enrollment;
            const id = String(course?.id ?? enrollment?.courseId ?? i);
            const title = String(course?.title ?? "Course");
            const description = String(course?.description ?? "");
            const level = String(course?.level ?? "");
            const category = (course?.category as Record<string, unknown>)?.name
              ? String((course.category as Record<string, unknown>).name)
              : undefined;

            return (
              <Card key={id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="size-5" />
                  </div>
                  <h3 className="font-semibold leading-snug">{title}</h3>
                  {category && <p className="text-xs text-primary mt-0.5">{category}</p>}
                  {level && <p className="text-xs text-muted-foreground mt-0.5">{level}</p>}
                  {description && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{description}</p>
                  )}
                  <Button asChild size="sm" className="mt-4 w-full" variant="outline">
                    <Link href={`/courses/${id}`}>View Course</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
