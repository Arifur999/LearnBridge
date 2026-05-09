import { Mail, Shield, User, Calendar } from "lucide-react";
import { getCurrentUserFromServer } from "@/lib/auth";
import { getMyBookings } from "@/actions/dashboard.action";

export default async function StudentProfilePage() {
  const [user, bookings] = await Promise.all([
    getCurrentUserFromServer(),
    getMyBookings(),
  ]);

  const completedCount = bookings.filter(
    (b) => String(b.status ?? "").toUpperCase() === "COMPLETED"
  ).length;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Your SkillBridge account details.</p>
      </div>

      {/* Avatar + name card */}
      <div className="rounded-2xl border bg-linear-to-br from-primary/5 to-violet-50 p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
            {(user?.name ?? "S").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-semibold">{user?.name ?? "Student"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border bg-background p-4">
            <Mail className="mb-2 size-4 text-primary" />
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email ?? "N/A"}</p>
          </div>
          <div className="rounded-xl border bg-background p-4">
            <Shield className="mb-2 size-4 text-primary" />
            <p className="text-xs text-muted-foreground">Role</p>
            <p className="font-medium capitalize">{user?.role ?? "Student"}</p>
          </div>
          <div className="rounded-xl border bg-background p-4">
            <Calendar className="mb-2 size-4 text-primary" />
            <p className="text-xs text-muted-foreground">Total Bookings</p>
            <p className="font-medium">{bookings.length}</p>
          </div>
          <div className="rounded-xl border bg-background p-4">
            <User className="mb-2 size-4 text-primary" />
            <p className="text-xs text-muted-foreground">Completed Sessions</p>
            <p className="font-medium">{completedCount}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-5">
        <p className="text-sm text-muted-foreground">
          To update your email or password, please contact support at{" "}
          <a href="mailto:support@skillbridge.com" className="font-medium text-primary hover:underline">
            support@skillbridge.com
          </a>
        </p>
      </div>
    </div>
  );
}
