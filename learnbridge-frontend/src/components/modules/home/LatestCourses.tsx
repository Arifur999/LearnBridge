import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SectionHeader from "./SectionHeader";
import { API_V1_URL } from "@/lib/config";

async function getLatestCourses() {
  try {
    const res = await fetch(`${API_V1_URL}/courses?limit=6&sort=createdAt`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    const courses = data?.data?.data ?? data?.data ?? data ?? [];
    return Array.isArray(courses) ? courses : [];
  } catch {
    return [];
  }
}

const levelColor: Record<string, string> = {
  BEGINNER: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  INTERMEDIATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  ADVANCED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default async function LatestCourses() {
  const courses = await getLatestCourses();
  if (!courses.length) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader
            label="Courses"
            title="Fresh courses to keep moving"
            description="Browse recent courses when you want a structured path beside your tutoring sessions."
            className="mb-0"
          />
          <Button variant="outline" asChild className="hidden sm:flex shrink-0">
            <Link href="/courses">
              Browse All <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 6).map((course: Record<string, unknown>) => {
            const id = course.id as string;
            const title = course.title as string;
            const description = course.description as string;
            const price = course.price as number | undefined;
            const level = (course.level as string) || "BEGINNER";
            const category = (course.category as Record<string, unknown>)?.name as string | undefined;
            const count = (course._count as Record<string, unknown>)?.enrollments as number | undefined;
            const duration = course.duration as number | undefined;
            const image = course.image as string | undefined;

            return (
              <Card key={id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-40 overflow-hidden bg-muted">
                  <Image
                    src={image || "/education-learn-study-world-graduated-student-studying-abroad-international-idea_488220-56721.jpg"}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${levelColor[level] || levelColor.BEGINNER}`}
                    >
                      {level}
                    </span>
                    {category && (
                      <span className="text-xs text-muted-foreground">{category}</span>
                    )}
                  </div>
                  <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    {duration != null && (
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> {duration}h
                      </span>
                    )}
                    {count != null && (
                      <span className="flex items-center gap-1">
                        <Users className="size-3" /> {count} enrolled
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    {price != null && (
                      <span className="font-semibold text-sm">BDT {price}</span>
                    )}
                    <Button asChild size="sm" className="ml-auto">
                      <Link href={`/courses/${id}`}>View Course</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
