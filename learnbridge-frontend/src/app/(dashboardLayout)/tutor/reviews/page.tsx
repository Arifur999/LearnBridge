import { reviewService } from "@/services/review.service";
import { formatDate } from "@/lib/utils";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Review = Record<string, unknown>;

/* ── Star renderer using Font Awesome ── */
function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const cls   = size === "lg" ? "size-6" : "size-3.5";

  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: full  }).map((_, i) => <FaStar     key={`f${i}`} className={`${cls} text-amber-400`} />)}
      {half === 1                  &&               <FaStarHalfAlt           className={`${cls} text-amber-400`} />}
      {Array.from({ length: empty }).map((_, i) => <FaRegStar   key={`e${i}`} className={`${cls} text-amber-300 dark:text-amber-600`} />)}
    </span>
  );
}

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
];

export default async function TutorReviewsPage() {
  const reviews = await reviewService.getMyReviews();
  const list: Review[] = Array.isArray(reviews) ? reviews : [];

  const avgRating = list.length
    ? list.reduce((s, r) => s + Number(r?.rating ?? 0), 0) / list.length
    : 0;

  /* rating distribution 1-5 */
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: list.filter((r) => Math.round(Number(r?.rating ?? 0)) === star).length,
  }));

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Feedback and ratings from your students
        </p>
      </div>

      {/* ── Rating summary card ────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-amber-400 via-yellow-300 to-amber-400" />
        <CardContent className="p-0">
          <div className="grid divide-y sm:divide-x sm:divide-y-0 sm:grid-cols-2">

            {/* Left: big number */}
            <div className="flex flex-col items-center justify-center gap-3 p-8">
              <span className="text-6xl font-black tabular-nums text-amber-500">
                {avgRating.toFixed(1)}
              </span>
              <StarRating rating={avgRating} size="lg" />
              <p className="text-sm text-muted-foreground">
                Based on <span className="font-semibold text-foreground">{list.length}</span>{" "}
                review{list.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Right: distribution bars */}
            <div className="flex flex-col justify-center gap-2.5 p-6">
              {dist.map(({ star, count }) => {
                const pct = list.length > 0 ? Math.round((count / list.length) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex w-8 shrink-0 items-center gap-1 text-xs font-semibold text-amber-500">
                      <FaStar className="size-3" />
                      {star}
                    </div>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-7 shrink-0 text-right text-xs text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Reviews list ───────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-[3px] w-full bg-linear-to-r from-amber-400 to-yellow-300" />
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                <MessageSquare className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-base font-semibold">All Reviews</CardTitle>
            </div>
            <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
              {list.length} total
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {list.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-muted">
                <FaRegStar className="size-7 text-muted-foreground/40" />
              </div>
              <div>
                <p className="font-semibold">No reviews yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Students will leave feedback after completing sessions
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
                <FaStar className="size-3.5" />
                Complete sessions to get your first review
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {list.map((r, idx) => {
                const student     = r?.student as Record<string, unknown> | undefined;
                const studentName = String(student?.name ?? r?.studentName ?? "Anonymous");
                const rating      = Number(r?.rating ?? 0);
                const reviewText  = r?.review != null ? String(r.review) : null;
                const date        = formatDate(String(r?.createdAt ?? ""));

                return (
                  <div key={String(r.id ?? idx)} className="flex gap-4 px-5 py-5 transition-colors hover:bg-muted/30">

                    {/* Avatar */}
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                      {studentName[0]?.toUpperCase() ?? "S"}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">{studentName}</p>
                          <p className="text-xs text-muted-foreground">{date}</p>
                        </div>
                        {/* Stars */}
                        <div className="flex items-center gap-2">
                          <StarRating rating={rating} />
                          <span className="text-sm font-bold text-amber-500">{rating.toFixed(1)}</span>
                        </div>
                      </div>

                      {reviewText && (
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {reviewText}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
