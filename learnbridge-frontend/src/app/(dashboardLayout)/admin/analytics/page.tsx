import { getAdminBookings, getAdminUsers, getCategories } from "@/actions/dashboard.action";
import DashPageHeader from "@/components/layout/DashPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, CheckCircle, TrendingUp } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const [users, bookings, categories] = await Promise.all([
    getAdminUsers(),
    getAdminBookings(),
    getCategories(),
  ]);

  const completed = bookings.filter((b) => String(b?.status ?? "").toUpperCase() === "COMPLETED").length;
  const confirmed = bookings.filter((b) => String(b?.status ?? "").toUpperCase() === "CONFIRMED").length;
  const cancelled = bookings.filter((b) => String(b?.status ?? "").toUpperCase() === "CANCELLED").length;
  const students = users.filter((u) => String(u?.role ?? "").toLowerCase() === "student").length;
  const tutors = users.filter((u) => {
    const r = String(u?.role ?? "").toLowerCase();
    return r === "tutor" || r === "trainer";
  }).length;

  const stats = [
    { icon: Users,      label: "Total Users",      value: users.length,      color: "bg-primary/10 text-primary" },
    { icon: BookOpen,   label: "Total Bookings",    value: bookings.length,   color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
    { icon: CheckCircle,label: "Completed",         value: completed,         color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { icon: TrendingUp, label: "Categories",        value: categories.length, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  ];

  return (
    <div className="space-y-8">
      <DashPageHeader title="Analytics" description="Platform-wide statistics and insights." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className={`mb-3 inline-flex rounded-xl p-3 ${color}`}>
                <Icon className="size-5" />
              </div>
              <p className="text-3xl font-bold">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Booking Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Completed",  value: completed,  pct: bookings.length ? Math.round((completed / bookings.length) * 100) : 0,  color: "bg-emerald-500" },
                { label: "Confirmed",  value: confirmed,  pct: bookings.length ? Math.round((confirmed / bookings.length) * 100) : 0,  color: "bg-primary" },
                { label: "Cancelled",  value: cancelled,  pct: bookings.length ? Math.round((cancelled / bookings.length) * 100) : 0,  color: "bg-destructive" },
              ].map(({ label, value, pct, color }) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value} ({pct}%)</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>User Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Students",  value: students,              color: "bg-primary" },
                { label: "Tutors",    value: tutors,                color: "bg-violet-500" },
                { label: "Others",    value: users.length - students - tutors, color: "bg-muted-foreground" },
              ].map(({ label, value, color }) => {
                const pct = users.length ? Math.round((value / users.length) * 100) : 0;
                return (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value} ({pct}%)</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
