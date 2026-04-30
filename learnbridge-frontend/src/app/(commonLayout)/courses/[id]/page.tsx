import { getCourseById } from "@/actions/course.action";
import { BookingModal } from "@/components/booking-modal";

interface TutorProfile {
  id: string;
  title: string;
  description: string;
  price?: number;
  category?: string;
  rating?: number;
  reviews?: unknown[];
  trainer?: {
    id: string;
    name: string;
  };
}

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor: TutorProfile | null = await getCourseById(id);

  if (!tutor) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-destructive">Tutor Not Found</h2>
        <p className="text-muted-foreground">
          Could not find tutor with ID: {id}
        </p>
      </div>
    );
  }

  const tutorName = tutor.trainer?.name ?? tutor.title;
  const tutorId = tutor.trainer?.id ?? tutor.id;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            {tutor.category || "Tutor"}
          </p>
          <h1 className="mb-4 text-3xl font-bold">{tutorName}</h1>
          <p className="mb-6 text-muted-foreground">{tutor.description}</p>

          <div className="rounded-xl border bg-muted p-6">
            <h3 className="mb-2 font-semibold">Profile Highlights</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Instant session booking</li>
              <li>Verified tutor profile</li>
              <li>Student reviews and rating history</li>
            </ul>
          </div>
        </div>

        <div className="h-fit rounded-xl border bg-background p-6 lg:sticky lg:top-24">
          <p className="mb-2 text-2xl font-bold">
            {tutor.price ? `BDT ${tutor.price}/session` : "Free"}
          </p>
          {typeof tutor.rating === "number" && (
            <p className="mb-4 text-sm text-muted-foreground">
              Rating: {tutor.rating.toFixed(1)}
            </p>
          )}

          <BookingModal trainerId={tutorId} trainerName={tutorName} />

          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p>Confirmed instantly</p>
            <p>Manage bookings from your dashboard</p>
            <p>Leave a review after the session</p>
          </div>
        </div>
      </div>
    </section>
  );
}
