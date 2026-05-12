import { getCurrentUserFromServer } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashPageHeader from "@/components/layout/DashPageHeader";
import { Mail, Shield } from "lucide-react";
import StudentProfileClient from "@/app/(dashboardLayout)/student/profile/StudentProfileClient";

export default async function StudentProfilePage() {
  const user = await getCurrentUserFromServer();
  if (!user) redirect("/login");

  const userImage =
    typeof (user as Record<string, unknown>)?.image === "string"
      ? (user as Record<string, unknown>).image as string
      : "";

  return (
    <div className="max-w-2xl space-y-6">
      <DashPageHeader title="My Profile" description="Manage your account information." />

      <StudentProfileClient
        initialName={user.name ?? ""}
        initialImage={userImage}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border bg-background p-4">
          <Mail className="mb-2 size-4 text-primary" />
          <p className="text-xs text-muted-foreground">Email</p>
          <p className="font-medium">{user.email ?? "N/A"}</p>
        </div>
        <div className="rounded-xl border bg-background p-4">
          <Shield className="mb-2 size-4 text-primary" />
          <p className="text-xs text-muted-foreground">Role</p>
          <p className="font-medium capitalize">{user.role ?? "Student"}</p>
        </div>
      </div>
    </div>
  );
}
