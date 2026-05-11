import DashPageHeader from "@/components/layout/DashPageHeader";
import { instituteService } from "@/services/institute.service";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, GraduationCap, DollarSign } from "lucide-react";

export default async function InstituteDashboardPage() {
  const overview = await instituteService.getOverview() as Record<string, unknown> | null;
  const stats = (overview?.stats as Record<string, unknown>) ?? {};

  const cards = [
    { icon: BookOpen,     label: "Total Courses",     value: String(stats?.totalCourses ?? 0),     color: "bg-primary/10 text-primary" },
    { icon: Users,        label: "Total Mentors",      value: String(stats?.totalMentors ?? 0),     color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
    { icon: GraduationCap,label: "Total Enrollments",  value: String(stats?.totalEnrollments ?? 0), color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { icon: DollarSign,   label: "Total Revenue",      value: `$${String(stats?.totalRevenue ?? 0)}`, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  ];

  return (
    <div className="space-y-8">
      <DashPageHeader title="Institute Overview" description="Your institute's performance at a glance." />
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
