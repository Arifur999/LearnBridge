import Link from "next/link";
import { BookOpenCheck, Tags, Users, TrendingUp, ArrowRight } from "lucide-react";
import { getAdminBookings, getAdminUsers, getCategories } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [users, bookings, categories] = await Promise.all([
    getAdminUsers(),
    getAdminBookings(),
    getCategories(),
  ]);

  const confirmedBookings = bookings.filter(
    (b) => String(b.status ?? "").toUpperCase() === "CONFIRMED"
  ).length;
  const completedBookings = bookings.filter(
    (b) => String(b.status ?? "").toUpperCase() === "COMPLETED"
  ).length;

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: users.length,
      color: "bg-indigo-50 text-indigo-600",
      href: "/admin/users",
    },
    {
      icon: BookOpenCheck,
      label: "Total Bookings",
      value: bookings.length,
      color: "bg-violet-50 text-violet-600",
      href: "/admin/bookings",
    },
    {
      icon: TrendingUp,
      label: "Confirmed",
      value: confirmedBookings,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/bookings",
    },
    {
      icon: Tags,
      label: "Categories",
      value: categories.length,
      color: "bg-emerald-50 text-emerald-600",
      href: "/admin/categories",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor users, bookings, and tutoring categories.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className={`mb-3 inline-flex rounded-xl p-3 ${stat.color}`}>
                <Icon className="size-5" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <h3 className="mb-3 font-semibold">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Confirmed</span>
              <span className="font-medium">{confirmedBookings}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-medium">{completedBookings}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{bookings.length}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-5">
          <h3 className="mb-3 font-semibold">Quick Actions</h3>
          <div className="space-y-2">
            <Button asChild className="w-full justify-between" variant="outline">
              <Link href="/admin/users">
                Manage Users <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild className="w-full justify-between" variant="outline">
              <Link href="/admin/bookings">
                View Bookings <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild className="w-full justify-between" variant="outline">
              <Link href="/admin/categories">
                Manage Categories <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
