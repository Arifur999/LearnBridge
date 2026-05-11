import DashPageHeader from "@/components/layout/DashPageHeader";
import { mentorService } from "@/services/mentor.service";
import { GraduationCap } from "lucide-react";

export default async function MentorRostersPage() {
  const students = await mentorService.getStudents();
  const list = Array.isArray(students) ? students : [];

  return (
    <div className="space-y-6">
      <DashPageHeader title="Student Rosters" description="Students learning under your mentorship." />
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <GraduationCap className="mx-auto mb-4 size-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">No students in your roster yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Course</th>
                <th className="px-4 py-3 text-left font-semibold">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((s: Record<string, unknown>, i: number) => {
                const student = s?.student as Record<string, unknown> | undefined;
                const course = s?.course as Record<string, unknown> | undefined;
                const progress = Number(s?.progress ?? 0);
                return (
                  <tr key={String(s.id ?? i)} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{String(student?.name ?? s.name ?? "—")}</td>
                    <td className="px-4 py-3 text-muted-foreground">{String(student?.email ?? s.email ?? "—")}</td>
                    <td className="px-4 py-3">{String(course?.title ?? "—")}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{progress}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
