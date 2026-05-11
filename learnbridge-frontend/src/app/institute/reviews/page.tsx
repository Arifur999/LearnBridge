import DashPageHeader from "@/components/layout/DashPageHeader";
import { instituteService } from "@/services/institute.service";
import { formatDate } from "@/lib/utils";
import { Star } from "lucide-react";

export default async function InstituteReviewsPage() {
  const reviews = await instituteService.getReviews();
  const list = Array.isArray(reviews) ? reviews : [];

  return (
    <div className="space-y-6">
      <DashPageHeader title="Reviews" description="Student reviews for your courses." />
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((r: Record<string, unknown>, i: number) => {
            const student = r?.student as Record<string, unknown> | undefined;
            const course = r?.course as Record<string, unknown> | undefined;
            return (
              <div key={String(r.id ?? i)} className="rounded-2xl border bg-background p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{String(student?.name ?? "Student")}</p>
                    {course?.title != null && <p className="text-xs text-muted-foreground">{String(course.title)}</p>}
                  </div>
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
