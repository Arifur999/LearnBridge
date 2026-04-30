import Link from "next/link";
import { CalendarCheck, Search, Star, User } from "lucide-react";

import { getMyBookings } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { getCurrentUserFromServer } from "@/lib/auth";

export default async function StudentDashboardPage() {
  const user = await getCurrentUserFromServer();
  const bookings = await getMyBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name ?? "student"}. Manage your learning sessions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-5">
          <CalendarCheck className="mb-3 size-5 text-primary" />
          <p className="text-2xl font-bold">{bookings.length}</p>
          <p className="text-sm text-muted-foreground">Total bookings</p>
        </div>
        <div className="rounded-lg border p-5">
          <Star className="mb-3 size-5 text-primary" />
          <p className="text-2xl font-bold">
            {bookings.filter((item) => item.status === "COMPLETED").length}
          </p>
          <p className="text-sm text-muted-foreground">Completed sessions</p>
        </div>
        <div className="rounded-lg border p-5">
          <User className="mb-3 size-5 text-primary" />
          <p className="text-2xl font-bold">Active</p>
          <p className="text-sm text-muted-foreground">Profile status</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/tutors">
            <Search className="mr-2 size-4" />
            Browse Tutors
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/student/bookings">View My Bookings</Link>
        </Button>
      </div>
    </div>
  );
}
