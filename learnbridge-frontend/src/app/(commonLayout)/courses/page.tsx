import { Suspense } from "react";
import { getAllCourses, getCategories } from "@/actions/course.action";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, LayoutGrid, SlidersHorizontal, Search } from "lucide-react";
import CourseCard from "./CourseCard";
import CoursesFilter from "./CoursesFilter";
import Pagination from "./Pagination";

interface Course {
  id: string;
  title: string;
  description: string;
  price?: number;
  category?: string;
  image?: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

const isPaginationMeta = (value: unknown): value is PaginationMeta => {
  return (
    !!value &&
    typeof value === "object" &&
    "page" in value &&
    "limit" in value &&
    "total" in value
  );
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const { search, category, minPrice, maxPrice, sort, page: pageQuery } =
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
  if (sort) params.set("sort", sort);

  const [result, categories] = await Promise.all([
    getAllCourses(`?${params.toString()}`),
    getCategories(),
  ]);

  const courses: Course[] = result?.data ?? [];
  const meta = isPaginationMeta(result?.meta) ? result.meta : null;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b bg-slate-950 text-white">
        <Image
          src="/front-view-academic-cap-with-books-pencils_23-2148756619.jpg"
          alt="Academic books, pencils, and graduation cap"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-slate-950/58" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/30 via-slate-950/58 to-slate-950/92" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/50 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[62svh] max-w-7xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6">
          {/* Pill badge with pulsing dot */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-white/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
            </span>
            <BookOpen className="size-3.5 opacity-80" />
            Course Library
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Pick a course and build momentum topic by topic
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
            Explore practical learning paths, compare categories and prices, and
            keep your next goal in view.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="group bg-white font-semibold text-slate-950 hover:bg-white/90"
            >
              <Link href="#course-results">Browse courses</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              <Link href="/tutors">Find a tutor</Link>
            </Button>
          </div>

          {/* Stat row */}
          <div className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            {[
              { icon: BookOpen, value: meta?.total ?? "Curated", label: "Available courses" },
              { icon: LayoutGrid, value: categories.length || "Many", label: "Subject categories" },
              { icon: SlidersHorizontal, value: "Price filters", label: "Search by budget" },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-0.5 bg-black/30 px-8 py-4 text-center backdrop-blur-sm"
              >
                <Icon className="mb-1 size-4 text-white/50" />
                <span className="text-xl font-bold text-white">{value}</span>
                <span className="text-xs text-white/60">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section
        id="course-results"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6"
      >
        <div className="mb-8">
          <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <Search className="size-3" />
            Browse Courses
          </p>
          <h2 className="text-2xl font-bold">
            {meta
              ? `${meta.total} course${meta.total !== 1 ? "s" : ""} available`
              : "Explore courses"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search by subject, category, and budget to narrow the list quickly.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="mb-10 h-20 animate-pulse rounded-2xl bg-muted" />
          }
        >
          <CoursesFilter categories={categories} basePath="/courses" />
        </Suspense>

        {courses.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed py-20 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <Search className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">No courses found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your filters or search terms.
              </p>
            </div>
          </div>
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
                image={course.image}
                basePath="/courses"
              />
            ))}
          </div>
        )}

        {meta && (
          <Pagination
            page={meta.page}
            limit={meta.limit}
            total={meta.total}
            basePath="/courses"
          />
        )}
      </section>
    </>
  );
}
