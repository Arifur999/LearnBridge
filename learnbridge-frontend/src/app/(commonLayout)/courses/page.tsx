import { Suspense } from "react";
import { getAllCourses, getCategories } from "@/actions/course.action";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
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
  const { search, category, minPrice, maxPrice, sort, page: pageQuery } = await searchParams;

  const page = Number(pageQuery) || 1;
  const limit = 9;

  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());
  
  if (search) {
    params.set("search", search);
  }
  if (category) {
    params.set("category", category);
  }
  if (minPrice) {
    params.set("minPrice", minPrice);
  }
  if (maxPrice) {
    params.set("maxPrice", maxPrice);
  }
  if (sort) {
    params.set("sort", sort);
  }

  const [result, categories] = await Promise.all([
    getAllCourses(`?${params.toString()}`),
    getCategories(),
  ]);
  

  const courses: Course[] = result?.data ?? [];
  const meta = isPaginationMeta(result?.meta) ? result.meta : null;

  return (
    <>
      <section className="relative isolate overflow-hidden border-b bg-slate-950 text-white">
        <Image
          src="/front-view-academic-cap-with-books-pencils_23-2148756619.jpg"
          alt="Academic books, pencils, and graduation cap"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-slate-950/54" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/34 via-slate-950/55 to-slate-950/90" />

        <div className="relative mx-auto flex min-h-[62svh] max-w-7xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6">
          <p className="mb-4 border-y border-amber-200/55 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-amber-100">
            Course Library
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Pick a course and build momentum topic by topic
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/82 sm:text-lg">
            Explore practical learning paths, compare categories and prices, and keep your next goal in view.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-amber-200 text-slate-950 hover:bg-amber-100">
              <Link href="#course-results">Browse courses</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/tutors">Find a tutor</Link>
            </Button>
          </div>
        </div>

        <div className="relative border-t border-white/18 bg-slate-950/72">
          <div className="mx-auto grid max-w-7xl gap-px bg-white/12 sm:grid-cols-3">
            <p className="bg-slate-950/78 px-4 py-4 text-sm text-white/74 sm:px-6">
              <span className="block text-xl font-bold text-white">{meta?.total ?? "Curated"}</span>
              Available courses
            </p>
            <p className="bg-slate-950/78 px-4 py-4 text-sm text-white/74 sm:px-6">
              <span className="block text-xl font-bold text-white">{categories.length || "Many"}</span>
              Subject categories
            </p>
            <p className="bg-slate-950/78 px-4 py-4 text-sm text-white/74 sm:px-6">
              <span className="block text-xl font-bold text-white">Budget filters</span>
              Search by price and topic
            </p>
          </div>
        </div>
      </section>

      <section id="course-results" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6">
        <div className="mb-7 max-w-2xl">
          <h2 className="text-2xl font-bold">Browse Courses</h2>
          <p className="mt-2 text-muted-foreground">
            Search by subject, category, and budget to narrow the course list quickly.
          </p>
        </div>

        <Suspense fallback={<div className="mb-10 h-20 animate-pulse rounded-xl bg-muted" />}>
          <CoursesFilter categories={categories} basePath="/courses" />
        </Suspense>

        {courses.length === 0 && (
          <p className="text-muted-foreground">No courses found.</p>
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
