import Link from "next/link";
import { Calendar, Star, UserRoundCheck } from "lucide-react";

import { getTutorBookings, getTutorCourses } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { getCurrentUserFromServer } from "@/lib/auth";

export default async function TutorDashboardPage() {
  const user = await getCurrentUserFromServer();
  const [bookings, courses] = await Promise.all([
    getTutorBookings(),
    getTutorCourses(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {user?.name ?? "tutor"}. Manage your teaching sessions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-5">
          <Calendar className="mb-3 size-5 text-primary" />
          <p className="text-2xl font-bold">{bookings.length}</p>
          <p className="text-sm text-muted-foreground">Teaching sessions</p>
        </div>
        <div className="rounded-lg border p-5">
          <UserRoundCheck className="mb-3 size-5 text-primary" />
          <p className="text-2xl font-bold">
            {bookings.filter((item: any) => item.status === "CONFIRMED").length}
          </p>
          <p className="text-sm text-muted-foreground">Confirmed</p>
        </div>
        <div className="rounded-lg border p-5">
          <Star className="mb-3 size-5 text-primary" />
          <p className="text-2xl font-bold">{courses.length}</p>
          <p className="text-sm text-muted-foreground">Your Courses</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/tutor/availability">Set Availability</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/tutor/profile">Edit Profile</Link>
        </Button>
      </div>
    </div>
  );
}
