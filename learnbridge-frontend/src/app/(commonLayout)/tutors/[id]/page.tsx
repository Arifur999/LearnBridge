import { Star, CheckCircle, User } from "lucide-react";
import { getCourseById } from "@/actions/course.action";
import { getTutorReviewsAction } from "@/actions/review.action";
import { BookingModal } from "@/components/booking-modal";
import { getCurrentUserFromServer } from "@/lib/auth";

interface TutorProfile {
  id: string;
  title: string;
  description: string;
  price?: number;
  category?: string;
  rating?: number;
  subjects?: string[];
  profileImage?: string;
  trainer?: { id: string; name: string };
}

interface Review {
  id?: string;
  _id?: string;
  rating?: number;
  comment?: string;
  student?: { name?: string };
  studentName?: string;
}

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`size-4 ${
          s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
        }`}
      />
    ))}
  </div>
);

export default async function TutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [tutor, reviews, currentUser] = await Promise.all([
    getCourseById(id) as Promise<TutorProfile | null>,
    getTutorReviewsAction(id),
    getCurrentUserFromServer(),
  ]);

  if (!tutor) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <User className="mx-auto mb-4 size-12 text-muted-foreground/40" />
        <h2 className="text-xl font-bold text-destructive">Tutor Not Found</h2>
        <p className="text-muted-foreground">Could not find tutor with ID: {id}</p>
      </div>
    );
  }

  const tutorName = tutor.trainer?.name ?? tutor.title;
  const tutorId   = tutor.trainer?.id ?? tutor.id;
  const subjects  = Array.isArray(tutor.subjects) ? tutor.subjects : [];
  const avgRating =
    typeof tutor.rating === "number"
      ? tutor.rating
      : reviews.length > 0
        ? reviews.reduce((sum: number, r: Review) => sum + (Number(r.rating) || 0), 0) /
          reviews.length
        : null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-3">
        {/* LEFT: Profile info */}
        <div className="space-y-8 lg:col-span-2">
          {/* Header */}
          <div className="flex items-start gap-5">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              {tutor.profileImage ? (
                <img
                  src={tutor.profileImage}
                  alt={tutorName}
                  className="size-20 rounded-2xl object-cover"
                />
              ) : (
                <User className="size-10 text-primary" />
              )}
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-primary">{tutor.category || "Tutor"}</p>
              <h1 className="text-2xl font-bold md:text-3xl">{tutorName}</h1>
              {avgRating !== null && (
                <div className="mt-1 flex items-center gap-2">
                  <StarDisplay rating={avgRating} />
                  <span className="text-sm text-muted-foreground">
                    {avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* About */}
          <div className="rounded-2xl border bg-muted/30 p-6">
            <h3 className="mb-3 font-semibold">About</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{tutor.description}</p>
          </div>

          {/* Subjects */}
          {subjects.length > 0 && (
            <div>
              <h3 className="mb-3 font-semibold">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {subjects.map((sub: string) => (
                  <span
                    key={sub}
                    className="rounded-full border bg-primary/5 px-3 py-1 text-sm font-medium text-primary"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          <div className="rounded-2xl border p-6">
            <h3 className="mb-4 font-semibold">Why Book with {tutorName}?</h3>
            <ul className="space-y-2.5">
              {[
                "Instant session confirmation",
                "Verified tutor profile",
                "Flexible time slots",
                "Post-session review system",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Reviews */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Student Reviews ({reviews.length})
            </h3>
            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                No reviews yet. Be the first to book a session!
              </div>
            ) : (
              <div className="space-y-4">
                {(reviews as Review[]).map((rev, idx) => {
                  const reviewerName =
                    rev.studentName ??
                    (rev.student && typeof rev.student === "object" ? rev.student.name : undefined) ??
                    "Student";
                  const reviewId = rev.id ?? rev._id ?? idx.toString();
                  return (
                    <div key={reviewId} className="rounded-2xl border p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {(reviewerName as string).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{reviewerName as string}</span>
                        </div>
                        {typeof rev.rating === "number" && (
                          <StarDisplay rating={rev.rating} />
                        )}
                      </div>
                      {rev.comment && (
                        <p className="text-sm text-muted-foreground">{rev.comment}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Booking card */}
        <div className="h-fit rounded-2xl border bg-background p-6 lg:sticky lg:top-24">
          <p className="mb-1 text-3xl font-bold text-primary">
            {tutor.price ? `BDT ${tutor.price}` : "Free"}
          </p>
          <p className="mb-4 text-sm text-muted-foreground">per session</p>

          {avgRating !== null && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2">
              <StarDisplay rating={avgRating} />
              <span className="text-sm font-medium text-amber-700">{avgRating.toFixed(1)}/5.0</span>
            </div>
          )}

          <BookingModal trainerId={tutorId} trainerName={tutorName} price={tutor.price ?? 0} userRole={currentUser?.role} />

          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="size-4 text-primary" /> Confirmed instantly
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="size-4 text-primary" /> Manage from dashboard
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="size-4 text-primary" /> Leave a review after session
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
