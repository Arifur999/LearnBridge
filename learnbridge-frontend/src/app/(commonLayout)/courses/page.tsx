import { getAllCourses } from "@/actions/course.action";
import CourseCard from "./CourseCard";
import CoursesFilter from "./CoursesFilter";

interface Course {
  id: string;
  title: string;
  description: string;
  price?: number;
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const query = searchParams.search
    ? `?search=${searchParams.search}`
    : "";

  const courses: Course[] = await getAllCourses(query);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">All Courses</h1>
        <p className="mt-2 text-muted-foreground">
          Explore all available courses and start learning today.
        </p>
      </div>

      {/* Filter */}
      <CoursesFilter />

      {/* Empty */}
      {courses.length === 0 && (
        <p className="text-muted-foreground">No courses found.</p>
      )}

      {/* Grid */}
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
    </section>
  );
}
