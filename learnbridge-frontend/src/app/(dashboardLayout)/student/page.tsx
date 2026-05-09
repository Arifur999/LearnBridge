import Link from "next/link";
import { CalendarCheck, Search, Star, User, TrendingUp, ArrowRight } from "lucide-react";
import { getMyBookings } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { getCurrentUserFromServer } from "@/lib/auth";

export default async function StudentDashboardPage() {
  const user = await getCurrentUserFromServer();
  const bookings = await getMyBookings();

  const confirmed = bookings.filter((b) => String(b.status ?? "").toUpperCase() === "CONFIRMED").length;
  const completed = bookings.filter((b) => String(b.status ?? "").toUpperCase() === "COMPLETED").length;

  const stats = [
    {
      icon: CalendarCheck,
      label: "Total Bookings",
      value: bookings.length,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      icon: TrendingUp,
      label: "Confirmed",
      value: confirmed,
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Star,
      label: "Completed",
      value: completed,
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: User,
      label: "Account Status",
      value: "Active",
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, <span className="font-semibold text-foreground">{user?.name ?? "student"}</span>. Manage your learning sessions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border bg-background p-5 shadow-sm">
              <div className={`mb-3 inline-flex rounded-xl p-3 ${stat.color}`}>
                <Icon className="size-5" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <h3 className="mb-3 font-semibold">Quick Actions</h3>
          <div className="space-y-2">
            <Button asChild className="w-full justify-between">
              <Link href="/tutors">
                <span className="flex items-center gap-2">
                  <Search className="size-4" /> Browse Tutors
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild className="w-full justify-between" variant="outline">
              <Link href="/student/bookings">
                <span className="flex items-center gap-2">
                  <CalendarCheck className="size-4" /> My Bookings
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent bookings */}
        <div className="rounded-2xl border p-5">
          <h3 className="mb-3 font-semibold">Recent Bookings</h3>
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings yet. Browse tutors to get started!</p>
          ) : (
            <div className="space-y-2">
              {bookings.slice(0, 3).map((b, idx) => {
                const key = String(b.id ?? b._id ?? idx);
                const tutorName = String(
                  b.tutorName ??
                  (b.tutor && typeof b.tutor === "object" && "name" in b.tutor ? (b.tutor as { name?: unknown }).name : undefined) ??
                  "Tutor session"
                );
                const status = String(b.status ?? "CONFIRMED").toUpperCase();
                return (
                  <div key={key} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                    <span className="font-medium">{tutorName}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
                      status === "CANCELLED" ? "bg-red-100 text-red-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
