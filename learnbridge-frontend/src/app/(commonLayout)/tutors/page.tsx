import { Suspense } from "react";
import { getAllCourses, getCategories } from "@/actions/course.action";
import CourseCard from "../courses/CourseCard";
import CoursesFilter from "../courses/CoursesFilter";
import Pagination from "../courses/Pagination";
import { Loader2 } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  price?: number;
  category?: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

const isPaginationMeta = (value: unknown): value is PaginationMeta =>
  !!value &&
  typeof value === "object" &&
  "page" in value &&
  "limit" in value &&
  "total" in value;

export default async function TutorsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}) {
  const { search, category, minPrice, maxPrice, page: pageQuery } =
    await searchParams;

  const page = Number(pageQuery) || 1;
  const limit = 9;

  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);

  const [result, categories] = await Promise.all([
    getAllCourses(`?${params.toString()}`),
    getCategories(),
  ]);

  const courses: Course[] = result?.data ?? [];
  const meta = isPaginationMeta(result?.meta) ? result.meta : null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Browse Tutors</h1>
        <p className="mt-2 text-muted-foreground">
          Find expert tutors by subject, category, and hourly price.
        </p>
      </div>

      <Suspense fallback={<div className="mb-10 h-20 animate-pulse rounded-xl bg-muted" />}>
        <CoursesFilter categories={categories} />
      </Suspense>

      {courses.length === 0 && (
        <p className="text-muted-foreground">No tutors found.</p>
      )}

      {courses.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              price={course.price}
              category={course.category}
            />
          ))}
        </div>
      )}

      {meta && <Pagination page={meta.page} limit={meta.limit} total={meta.total} />}
    </section>
  );
}
