import Link from "next/link";
import { Calendar, Star, UserRoundCheck } from "lucide-react";

import { getMyBookings } from "@/actions/dashboard.action";
import { Button } from "@/components/ui/button";
import { getCurrentUserFromServer } from "@/lib/auth";

export default async function TutorDashboardPage() {
  const user = await getCurrentUserFromServer();
  const sessions = await getMyBookings();

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
          <p className="text-2xl font-bold">{sessions.length}</p>
          <p className="text-sm text-muted-foreground">Teaching sessions</p>
        </div>
        <div className="rounded-lg border p-5">
          <UserRoundCheck className="mb-3 size-5 text-primary" />
          <p className="text-2xl font-bold">
            {sessions.filter((item) => item.status === "CONFIRMED").length}
          </p>
          <p className="text-sm text-muted-foreground">Confirmed</p>
        </div>
        <div className="rounded-lg border p-5">
          <Star className="mb-3 size-5 text-primary" />
          <p className="text-2xl font-bold">Reviews</p>
          <p className="text-sm text-muted-foreground">Ratings from students</p>
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
