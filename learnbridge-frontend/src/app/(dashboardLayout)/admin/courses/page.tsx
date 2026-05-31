import { getAdminCoursesAction } from "@/actions/dashboard.action";
import AdminCoursesClient from "./AdminCoursesClient";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle2, XCircle, Clock, Users } from "lucide-react";

export interface AdminCourse {
  id: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  image?: string | null;
  status: string;
  createdAt?: string;
  trainer?: { id: string; name: string; email: string };
  _count?: { enrollments: number };
}

export default async function AdminCoursesPage() {
  const courses = (await getAdminCoursesAction()) as unknown as AdminCourse[];

  const total    = courses.length;
  const pending  = courses.filter((c) => (c.status ?? "").toUpperCase() === "PENDING").length;
  const approved = courses.filter((c) => (c.status ?? "").toUpperCase() === "APPROVED").length;
  const rejected = courses.filter((c) => (c.status ?? "").toUpperCase() === "REJECTED").length;
  const totalEnrollments = courses.reduce((s, c) => s + (c._count?.enrollments ?? 0), 0);

  const statCards = [
    { icon: BookOpen,     label: "Total Courses",  value: total,             sub: "All submitted",          iconBg: "bg-primary/10",                          iconColor: "text-primary",                           bar: "bg-primary",     barW: "100%" },
    { icon: Clock,        label: "Pending",         value: pending,           sub: "Awaiting review",        iconBg: "bg-amber-100 dark:bg-amber-900/30",       iconColor: "text-amber-600 dark:text-amber-400",     bar: "bg-amber-500",   barW: total > 0 ? `${Math.round((pending  / total) * 100)}%` : "0%" },
    { icon: CheckCircle2, label: "Approved",        value: approved,          sub: "Live on platform",       iconBg: "bg-emerald-100 dark:bg-emerald-900/30",   iconColor: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", barW: total > 0 ? `${Math.round((approved / total) * 100)}%` : "0%" },
    { icon: XCircle,      label: "Rejected",        value: rejected,          sub: "Not published",          iconBg: "bg-red-100 dark:bg-red-900/30",           iconColor: "text-red-600 dark:text-red-400",         bar: "bg-red-500",     barW: total > 0 ? `${Math.round((rejected / total) * 100)}%` : "0%" },
    { icon: Users,        label: "Enrollments",     value: totalEnrollments,  sub: "Total across courses",   iconBg: "bg-violet-100 dark:bg-violet-900/30",     iconColor: "text-violet-600 dark:text-violet-400",   bar: "bg-violet-500",  barW: "100%" },
  ];

  return (
    <div className="space-y-6">

      
      <div>
        <h1 className="text-2xl font-black tracking-tight">Course Approvals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review, approve or reject courses submitted by tutors
        </p>
      </div>

      
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-primary via-amber-500 to-emerald-500" />
        <CardContent className="p-0">
          <div className="grid divide-y sm:divide-x sm:divide-y-0 sm:grid-cols-5">
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

      
      <AdminCoursesClient initialCourses={courses} />
    </div>
  );
}
