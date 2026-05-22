import { Suspense } from "react";
import { getAllTutors, getCategories } from "@/actions/course.action";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Users, BookOpen, LayoutGrid, Search } from "lucide-react";
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
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b bg-zinc-950 text-white">
        <Image
          src="/book-with-green-board-background_1150-3837.jpg"
          alt="Books and study tools in a learning room"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-zinc-950/60" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/80 to-emerald-950/30" />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/50 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[58svh] max-w-7xl flex-col justify-end px-4 py-12 sm:px-6 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Find a tutor for the topic that is slowing you down
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Compare expertise, hourly rates, and subjects before you book
              focused one-to-one learning support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="group bg-white font-semibold text-zinc-950 hover:bg-white/90"
              >
                <Link href="#tutor-results">Browse tutors</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              >
                <Link href="/register">Join as a tutor</Link>
              </Button>
            </div>
          </div>

          {/* Stat row */}
          <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:w-fit">
            {[
              { icon: Users, value: meta?.total ?? "500+", label: "Tutor profiles" },
              { icon: LayoutGrid, value: categories.length || "Many", label: "Categories" },
              { icon: BookOpen, value: "1:1", label: "Live support" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-0.5 bg-black/30 px-8 py-4 text-center backdrop-blur-sm">
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
        id="tutor-results"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6"
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Search className="size-3" />
              Browse Tutors
            </p>
            <h2 className="text-2xl font-bold">
              {meta ? `${meta.total} tutor${meta.total !== 1 ? "s" : ""} available` : "Expert tutors"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Filter by subject, category, and price. Login required to view full profiles.
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="mb-10 h-20 animate-pulse rounded-2xl bg-muted" />
          }
        >
          <CoursesFilter categories={categories} basePath="/tutors" />
        </Suspense>

        {tutors.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed py-20 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <Search className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">No tutors found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your filters or search terms.
              </p>
            </div>
          </div>
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
    </>
  );
}
