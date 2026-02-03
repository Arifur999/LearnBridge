import { getAllCourses } from "@/actions/course.action";
import CourseCard from "./CourseCard";
import CoursesFilter from "./CoursesFilter";
import Pagination from "./Pagination";

interface Course {
  id: string;
  title: string;
  description: string;
  price?: number;
}


export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
 
  const { search, page: pageQuery } = await searchParams;

  const page = Number(pageQuery) || 1;
  const limit = 9;

  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());
  
  if (search) {
    params.set("search", search);
  }

  const result = await getAllCourses(`?${params.toString()}`);

  const courses: Course[] = result?.data ?? [];
  const meta = result?.meta ?? null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">All Courses</h1>
        <p className="mt-2 text-muted-foreground">
          Explore all available courses and start learning today.
        </p>
      </div>

      <CoursesFilter />

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