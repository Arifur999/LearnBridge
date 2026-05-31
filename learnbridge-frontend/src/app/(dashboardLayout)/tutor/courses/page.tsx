import { getTutorCoursesAction } from "@/actions/tutor.action";
import TutorCoursesClient from "./TutorCoursesClient";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle2, Clock, Users } from "lucide-react";

export default async function TutorCoursesPage() {
  const courses = await getTutorCoursesAction();
  const list = Array.isArray(courses) ? courses : [];

  const approved        = list.filter((c) => String(c.status ?? "").toUpperCase() === "APPROVED").length;
  const pending         = list.filter((c) => String(c.status ?? "").toUpperCase() === "PENDING").length;
  const totalEnrollments = list.reduce((s, c) => s + Number(c.totalEnrollments ?? 0), 0);

  const statCards = [
    { icon: BookOpen,    label: "Total Courses", value: list.length,       sub: "All your courses",        iconBg: "bg-primary/10",                          iconColor: "text-primary",                           bar: "bg-primary",     barW: "100%" },
    { icon: CheckCircle2,label: "Approved",      value: approved,          sub: "Live on the platform",    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",   iconColor: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", barW: list.length > 0 ? `${Math.round((approved / list.length) * 100)}%` : "0%" },
    { icon: Clock,       label: "Pending",       value: pending,           sub: "Awaiting admin review",   iconBg: "bg-amber-100 dark:bg-amber-900/30",       iconColor: "text-amber-600 dark:text-amber-400",     bar: "bg-amber-500",   barW: list.length > 0 ? `${Math.round((pending / list.length) * 100)}%` : "0%"  },
    { icon: Users,       label: "Enrollments",   value: totalEnrollments,  sub: "Students across courses", iconBg: "bg-violet-100 dark:bg-violet-900/30",     iconColor: "text-violet-600 dark:text-violet-400",   bar: "bg-violet-500",  barW: "100%" },
  ];

  return (
    <div className="space-y-6">

      
      <div>
        <h1 className="text-2xl font-black tracking-tight">My Courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create, manage and track all your published courses
        </p>
      </div>

      
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-primary via-violet-500 to-emerald-500" />
        <CardContent className="p-0">
          <div className="grid divide-y sm:divide-x sm:divide-y-0 sm:grid-cols-4">
            {statCards.map(({ icon: Icon, label, value, sub, iconBg, iconColor, bar, barW }) => (
              <div key={label} className="flex flex-col gap-3 p-5 transition-colors hover:bg-muted/40">
                <div className="flex items-start justify-between">
                  <div className={`flex size-9 items-center justify-center rounded-2xl ${iconBg}`}>
                    <Icon className={`size-4 ${iconColor}`} />
                  </div>
                  <span className="text-2xl font-black tabular-nums">{value}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${bar}`} style={{ width: barW }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      
      <TutorCoursesClient initialCourses={list} />
    </div>
  );
}
