import DashPageHeader from "@/components/layout/DashPageHeader";
import { reviewService } from "@/services/review.service";
import { formatDate } from "@/lib/utils";
import { Star } from "lucide-react";

export default async function TutorReviewsPage() {
  const reviews = await reviewService.getMyReviews();
  const list = Array.isArray(reviews) ? reviews : [];
  const avgRating = list.length
    ? (list.reduce((s, r) => s + Number((r as Record<string, unknown>)?.rating ?? 0), 0) / list.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      <DashPageHeader title="Reviews" description="Feedback from your students." />

      <div className="flex items-center gap-3 rounded-2xl border bg-background p-5 shadow-sm max-w-xs">
        <div className="flex size-14 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
          <Star className="size-7 fill-yellow-400" />
        </div>
        <div>
          <p className="text-3xl font-bold">{avgRating}</p>
          <p className="text-sm text-muted-foreground">{list.length} review{list.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((r: Record<string, unknown>, i: number) => {
            const student = r?.student as Record<string, unknown> | undefined;
            return (
              <div key={String(r.id ?? i)} className="rounded-2xl border bg-background p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{String(student?.name ?? "Anonymous")}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{String(r.rating ?? 0)}</span>
                  </div>
                </div>
                {r.review != null && <p className="text-sm text-muted-foreground">{String(r.review)}</p>}
                <p className="mt-2 text-xs text-muted-foreground">{formatDate(String(r.createdAt ?? ""))}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
