import DashPageHeader from "@/components/layout/DashPageHeader";
import { mentorService } from "@/services/mentor.service";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function MentorCoursesPage() {
  const courses = await mentorService.getAssignedCourses();
  const list = Array.isArray(courses) ? courses : [];

  return (
    <div className="space-y-6">
      <DashPageHeader title="My Courses" description="Courses assigned to you as a mentor." />
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <BookOpen className="mx-auto mb-4 size-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">No courses assigned yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c: Record<string, unknown>, i: number) => {
            const institute = c?.institute as Record<string, unknown> | undefined;
            return (
              <div key={String(c.id ?? i)} className="rounded-2xl border bg-background p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-snug">{String(c.title ?? "Untitled")}</h3>
                  <Badge variant="secondary">{String(c.level ?? "All Levels")}</Badge>
                </div>
                {c.description != null && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{String(c.description)}</p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>{institute?.name ? `By ${String(institute.name)}` : "—"}</span>
                  <span className="font-semibold text-foreground">${String(c.price ?? 0)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
