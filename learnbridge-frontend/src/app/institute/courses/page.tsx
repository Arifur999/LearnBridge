import DashPageHeader from "@/components/layout/DashPageHeader";
import { instituteService } from "@/services/institute.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default async function InstituteCoursesPage() {
  const courses = await instituteService.getCourses();
  const list = Array.isArray(courses) ? courses : [];

  return (
    <div className="space-y-6">
      <DashPageHeader title="Courses" description="Manage your institute's courses." />
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <BookOpen className="mx-auto mb-4 size-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">No courses yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c: Record<string, unknown>, i: number) => (
            <Card key={String(c.id ?? i)}>
              <CardContent className="p-5">
                <h3 className="font-semibold">{String(c.title ?? "Course")}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{String(c.description ?? "")}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline">{String(c.level ?? "BEGINNER")}</Badge>
                  {c.price != null && <span className="text-sm font-semibold">${String(c.price)}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
