import Link from "next/link";
import { BookOpenCheck, Tags, Users } from "lucide-react";

import { getAdminBookings, getAdminUsers } from "@/actions/dashboard.action";
import { getCategories } from "@/actions/course.action";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [users, bookings, categories] = await Promise.all([
    getAdminUsers(),
    getAdminBookings(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor users, bookings, and tutoring categories.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-5">
          <Users className="mb-3 size-5 text-primary" />
          <p className="text-2xl font-bold">{users.length}</p>
          <p className="text-sm text-muted-foreground">Users</p>
        </div>
        <div className="rounded-lg border p-5">
          <BookOpenCheck className="mb-3 size-5 text-primary" />
          <p className="text-2xl font-bold">{bookings.length}</p>
          <p className="text-sm text-muted-foreground">Bookings</p>
        </div>
        <div className="rounded-lg border p-5">
          <Tags className="mb-3 size-5 text-primary" />
          <p className="text-2xl font-bold">{categories.length}</p>
          <p className="text-sm text-muted-foreground">Categories</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/admin/users">Manage Users</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/bookings">View Bookings</Link>
        </Button>
      </div>
    </div>
  );
}
