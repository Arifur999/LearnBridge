import Link from "next/link";
import { getCurrentUserFromServer } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStudentDashboard, getMyBookings } from "@/actions/dashboard.action";
import { CalendarDays, BookOpen, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashPageHeader from "@/components/layout/DashPageHeader";
import { formatDate, formatTime } from "@/lib/utils";
import StudentBookingChart from "./StudentBookingChart";

export default async function StudentDashboardPage() {
  const user = await getCurrentUserFromServer();
  if (!user) redirect("/login");

  const [stats, bookings] = await Promise.all([
    getStudentDashboard(),
    getMyBookings(),
  ]);

  const recent = Array.isArray(bookings) ? bookings.slice(0, 5) : [];
  const totalBookings = Array.isArray(bookings) ? bookings.length : 0;
  const completed = Array.isArray(bookings)
    ? bookings.filter((b) => String(b?.status ?? "").toUpperCase() === "COMPLETED").length
    : 0;
  const upcoming = Array.isArray(bookings)
    ? bookings.filter((b) => {
        const s = String(b?.status ?? "").toUpperCase();
        return s === "CONFIRMED" || s === "PENDING";
      }).length
    : 0;

  const statCards = [
    { icon: CalendarDays, label: "Total Bookings", value: totalBookings, color: "bg-primary/10 text-primary", href: "/dashboard/bookings" },
    { icon: BookOpen, label: "Completed Sessions", value: completed, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", href: "/dashboard/bookings" },
    { icon: CreditCard, label: "Upcoming Sessions", value: upcoming, color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400", href: "/dashboard/bookings" },
  ];

  return (
    <div className="space-y-8">
      <DashPageHeader
        title={`Welcome back, ${user.name ?? "Student"} `}
        description="Here's an overview of your learning activity."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map(({ icon: Icon, label, value, color, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className={`mb-3 inline-flex rounded-xl p-3 ${color}`}>
                  <Icon className="size-5" />
                </div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <StudentBookingChart bookings={Array.isArray(bookings) ? bookings.map((b) => ({ createdAt: String(b?.createdAt ?? ""), status: String(b?.status ?? "") })) : []} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Bookings</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/bookings">
              View all <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground text-sm">No bookings yet.</p>
              <Button asChild className="mt-3" size="sm">
                <Link href="/tutors">Browse Tutors</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((b, i) => {
                const id = String(b?.id ?? b?._id ?? i);
                const tutor = b?.tutor;
                const tutorName = typeof tutor === "object" && tutor
                  ? String((tutor as Record<string, unknown>)?.user
                      ? ((tutor as Record<string, unknown>).user as Record<string, unknown>)?.name
                      : (tutor as Record<string, unknown>)?.name ?? "Tutor")
                  : String(b?.tutorName ?? "Tutor");
                const status = String(b?.status ?? "PENDING").toUpperCase();
                const statusColor =
                  status === "COMPLETED" ? "text-emerald-600 dark:text-emerald-400"
                  : status === "CANCELLED" ? "text-destructive"
                  : "text-primary";
                const avail = b?.availability as Record<string, unknown> | undefined;
                const day = avail?.day ? String(avail.day) : "";
                const start = avail?.startTime ? formatTime(String(avail.startTime)) : "";
                const end = avail?.endTime ? formatTime(String(avail.endTime)) : "";

                return (
                  <div key={id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                    <div>
                      <p className="font-medium">{tutorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {day && start ? `${day} • ${start}${end ? ` – ${end}` : ""}` : formatDate(String(b?.createdAt ?? ""))}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold ${statusColor}`}>{status}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
