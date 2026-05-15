import { Suspense } from "react";
import { getAllTutors, getCategories } from "@/actions/course.action";
import TutorCard from "./TutorCard";
import CoursesFilter from "../courses/CoursesFilter";
import Pagination from "../courses/Pagination";

interface Tutor {
  id: string;
  title: string;
  description: string;
  price?: number;
  category?: string;
  rating?: number;
  subjects?: string[];
  profileImage?: string;
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
    getAllTutors(`?${params.toString()}`),
    getCategories(),
  ]);

  const tutors: Tutor[] = (result?.data ?? []) as Tutor[];
  const meta = isPaginationMeta(result?.meta) ? result.meta : null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Browse Tutors</h1>
        <p className="mt-2 text-muted-foreground">
          Find expert tutors by subject, category, and hourly price. Login required to view profiles.
        </p>
      </div>

      <Suspense fallback={<div className="mb-10 h-20 animate-pulse rounded-xl bg-muted" />}>
        <CoursesFilter categories={categories} basePath="/tutors" />
      </Suspense>

      {tutors.length === 0 && (
        <p className="text-muted-foreground">No tutors found.</p>
      )}

      {tutors.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutors.map((tutor) => (
            <TutorCard
              key={tutor.id}
              id={tutor.id}
              title={tutor.title}
              description={tutor.description}
              price={tutor.price}
              category={tutor.category}
              rating={tutor.rating}
              subjects={tutor.subjects}
              profileImage={tutor.profileImage}
            />
          ))}
        </div>
      )}

      {meta && (
        <Pagination
          page={meta.page}
          limit={meta.limit}
          total={meta.total}
          basePath="/tutors"
        />
      )}
    </section>
  );
}
