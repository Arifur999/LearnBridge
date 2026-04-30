import { getAllCourses, getCategories } from "@/actions/course.action";
import CourseCard from "./CourseCard";
import CoursesFilter from "./CoursesFilter";
import Pagination from "./Pagination";

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
    page?: string;
  }>;
}) {
 
  const { search, category, minPrice, maxPrice, page: pageQuery } = await searchParams;

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

      <CoursesFilter categories={categories} />

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

      {meta && (
        <Pagination
          page={meta.page}
          limit={meta.limit}
          total={meta.total}
        />
      )}
    </section>
  );
}
