import { Suspense } from "react";
import { getAllTutors, getCategories } from "@/actions/course.action";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
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
      <section className="relative isolate overflow-hidden border-b bg-zinc-950 text-white">
        <Image
          src="/book-with-green-board-background_1150-3837.jpg"
          alt="Books and study tools in a learning room"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-zinc-950/58" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/78 to-emerald-950/30" />

        <div className="relative mx-auto flex min-h-[58svh] max-w-7xl flex-col justify-end px-4 py-12 sm:px-6 md:py-16">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-200">
              Tutor Directory
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Find a tutor for the topic that is slowing you down
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/82 sm:text-lg">
              Compare expertise, hourly rates, and subjects before you book focused one-to-one learning support.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-emerald-300 text-emerald-950 hover:bg-emerald-200">
                <Link href="#tutor-results">Browse tutors</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/register">Join as a tutor</Link>
              </Button>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/20 pt-5 text-sm text-white/72">
            <p><span className="mr-2 text-2xl font-bold text-white">{meta?.total ?? "Verified"}</span>Tutor profiles</p>
            <p><span className="mr-2 text-2xl font-bold text-white">{categories.length || "Many"}</span>Categories</p>
            <p><span className="mr-2 text-2xl font-bold text-white">1:1</span>Live support</p>
          </div>
        </div>
      </section>

      <section id="tutor-results" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6">
        <div className="mb-7 max-w-2xl">
          <h2 className="text-2xl font-bold">Browse Tutors</h2>
          <p className="mt-2 text-muted-foreground">
            Find expert tutors by subject, category, and hourly price. Login is required to view full profiles.
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
    </>
  );
}
