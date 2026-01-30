import { getCourseById } from "@/actions/course.action";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  description: string;
  price?: number;
  category?: string;
}

export default async function CourseDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const course: Course | null = await getCourseById(params.id);
console.log(params);
  if (!course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <p className="text-muted-foreground">
          Course not found.
        </p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="mb-4 text-3xl font-bold">
            {course.title}
          </h1>

          <p className="mb-6 text-muted-foreground">
            {course.description}
          </p>

          <div className="rounded-xl border bg-muted p-6">
            <h3 className="mb-2 font-semibold">
              What you’ll learn
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Industry-ready skills</li>
              <li>Hands-on practice</li>
              <li>Real-world projects</li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="rounded-xl border bg-background p-6">
          <p className="mb-4 text-2xl font-bold">
            {course.price ? `৳ ${course.price}` : "Free"}
          </p>

          <Button className="w-full">
            Enroll Now
          </Button>

          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p>✔ Lifetime access</p>
            <p>✔ Certificate included</p>
            <p>✔ Beginner friendly</p>
          </div>
        </div>
      </div>
    </section>
  );
}
