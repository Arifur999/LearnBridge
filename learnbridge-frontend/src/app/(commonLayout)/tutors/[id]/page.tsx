import { Star, CheckCircle, User, ArrowLeft } from "lucide-react";
import { getCourseById } from "@/actions/course.action";
import { getTutorReviewsAction } from "@/actions/review.action";
import { BookingModal } from "@/components/booking-modal";
import { getCurrentUserFromServer } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          s <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "fill-muted-foreground/20 text-muted-foreground/20"
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
        <p className="text-muted-foreground">
          Could not find tutor with ID: {id}
        </p>
      </div>
    );
  }

  const tutorName = tutor.trainer?.name ?? tutor.title;
  const tutorId = tutor.trainer?.id ?? tutor.id;
  const subjects = Array.isArray(tutor.subjects) ? tutor.subjects : [];
  const userRole = (currentUser?.role ?? "").toLowerCase();
  const isLoggedIn = !!currentUser;
  const isStudent = isLoggedIn && userRole === "student";
  const avgRating =
    typeof tutor.rating === "number"
      ? tutor.rating
      : reviews.length > 0
      ? reviews.reduce(
          (sum: number, r: Review) => sum + (Number(r.rating) || 0),
          0
        ) / reviews.length
      : null;

  const initials = (() => {
    const parts = tutorName.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0]?.[0]?.toUpperCase() ?? "T";
  })();

  return (
    <>
      {/* Hero banner */}
      <div className="relative isolate overflow-hidden border-b bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-linear-to-r from-primary/20 via-zinc-950/90 to-zinc-950" />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/60 via-transparent to-transparent" />

        {/* Decorative ring */}
        <div className="absolute -right-32 -top-32 size-96 rounded-full border border-white/[0.05]" />
        <div className="absolute -right-20 -top-20 size-64 rounded-full border border-white/[0.05]" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
          <Link
            href="/tutors"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to tutors
          </Link>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            {/* Avatar */}
            <div className="shrink-0">
              {tutor.profileImage ? (
                <img
                  src={tutor.profileImage}
                  alt={tutorName}
                  className="size-28 rounded-2xl object-cover ring-4 ring-white/10 shadow-2xl"
                />
              ) : (
                <div className="flex size-28 items-center justify-center rounded-2xl bg-primary/30 text-3xl font-bold text-white ring-4 ring-white/10">
                  {initials}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              {tutor.category && (
                <span className="mb-2 inline-block rounded-full bg-primary/20 px-3 py-0.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary ring-1 ring-primary/30">
                  {tutor.category}
                </span>
              )}
              <h1 className="text-3xl font-black leading-tight md:text-4xl">
                {tutorName}
              </h1>
              {avgRating !== null && (
                <div className="mt-2 flex items-center gap-2">
                  <StarDisplay rating={avgRating} />
                  <span className="text-sm text-white/65">
                    {avgRating.toFixed(1)} ·{" "}
                    {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Price callout */}
            {tutor.price != null && (
              <div className="shrink-0 rounded-2xl bg-white/10 px-5 py-3 text-center ring-1 ring-white/15 backdrop-blur-sm">
                <p className="text-2xl font-black">
                  BDT {tutor.price}
                </p>
                <p className="text-xs text-white/60">per session</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* LEFT: Profile content */}
          <div className="space-y-8 lg:col-span-2">
            {/* About */}
            <div className="rounded-2xl border bg-muted/30 p-6">
              <h3 className="mb-3 font-semibold">About</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {tutor.description}
              </p>
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
              <h3 className="mb-4 font-semibold">
                Why book with {tutorName}?
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Instant session confirmation",
                  "Verified tutor profile",
                  "Flexible time slots",
                  "Post-session review system",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="size-4 shrink-0 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                Student Reviews ({reviews.length})
              </h3>

              {reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                  No reviews yet. Be the first to book a session!
                </div>
              ) : (
                <div className="space-y-4">
                  {(reviews as Review[]).map((rev, idx) => {
                    const reviewerName =
                      rev.studentName ??
                      (rev.student && typeof rev.student === "object"
                        ? rev.student.name
                        : undefined) ??
                      "Student";
                    const reviewId = rev.id ?? rev._id ?? idx.toString();
                    return (
                      <div
                        key={reviewId}
                        className="relative overflow-hidden rounded-2xl border p-5"
                      >
                        {/* Decorative quote mark */}
                        <span className="pointer-events-none absolute right-4 top-2 select-none font-serif text-7xl leading-none text-foreground/[0.04]">
                          &ldquo;
                        </span>

                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                              {(reviewerName as string)
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <span className="font-medium">
                              {reviewerName as string}
                            </span>
                          </div>
                          {typeof rev.rating === "number" && (
                            <StarDisplay rating={rev.rating} />
                          )}
                        </div>
                        {rev.comment && (
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            &ldquo;{rev.comment}&rdquo;
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Booking card */}
          <div className="h-fit rounded-2xl border bg-background p-6 shadow-sm lg:sticky lg:top-24">
            <p className="text-3xl font-black text-primary">
              {tutor.price ? `BDT ${tutor.price}` : "Free"}
            </p>
            <p className="mb-5 text-sm text-muted-foreground">per session</p>

            {avgRating !== null && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 dark:bg-amber-950/30">
                <StarDisplay rating={avgRating} />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  {avgRating.toFixed(1)} / 5.0
                </span>
              </div>
            )}

            {isStudent ? (
              <>
                <BookingModal
                  trainerId={tutorId}
                  trainerName={tutorName}
                  price={tutor.price ?? 0}
                />
                <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                  {[
                    "Confirmed instantly",
                    "Manage from dashboard",
                    "Leave a review after session",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="size-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            ) : !isLoggedIn ? (
              <div className="text-center">
                <p className="mb-4 text-sm text-muted-foreground">
                  Sign in as a student to book a session.
                </p>
                <Button asChild size="lg" className="w-full">
                  <Link href={`/login?returnUrl=/tutors/${tutor.id}`}>
                    Sign In to Book
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="mt-2 rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                {userRole === "trainer" || userRole === "tutor"
                  ? "Tutors cannot book sessions."
                  : userRole === "admin"
                  ? "Admins cannot book sessions."
                  : "Sign in as a student to book."}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
