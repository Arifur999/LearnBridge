import DashPageHeader from "@/components/layout/DashPageHeader";
import { mentorService } from "@/services/mentor.service";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, GraduationCap, Star } from "lucide-react";

export default async function MentorDashboardPage() {
  const overview = await mentorService.getOverview() as Record<string, unknown> | null;
  const stats = (overview?.stats as Record<string, unknown>) ?? {};

  const cards = [
    { icon: BookOpen,      label: "Assigned Courses",  value: String(stats?.totalCourses ?? 0),    color: "bg-primary/10 text-primary" },
    { icon: GraduationCap, label: "Total Students",    value: String(stats?.totalStudents ?? 0),   color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { icon: Star,          label: "Avg Rating",        value: String(stats?.avgRating ?? "N/A"),   color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
    { icon: Users,         label: "Active Rosters",    value: String(stats?.activeRosters ?? 0),  color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
  ];

  return (
    <div className="space-y-8">
      <DashPageHeader title="Mentor Dashboard" description="Your mentoring activity at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, color }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className={`mb-3 inline-flex rounded-xl p-3 ${color}`}><Icon className="size-5" /></div>
              <p className="text-3xl font-bold">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
