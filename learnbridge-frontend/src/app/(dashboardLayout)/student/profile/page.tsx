import { Mail, Shield, User } from "lucide-react";

import { getCurrentUserFromServer } from "@/lib/auth";

export default async function StudentProfilePage() {
  const user = await getCurrentUserFromServer();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Your SkillBridge account details.</p>
      </div>

      <div className="rounded-lg border p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
            <User className="size-5" />
          </div>
          <div>
            <p className="text-lg font-semibold">{user?.name ?? "Student"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <Mail className="mb-2 size-4 text-primary" />
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email ?? "N/A"}</p>
          </div>
          <div className="rounded-lg border p-4">
            <Shield className="mb-2 size-4 text-primary" />
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium">Student</p>
          </div>
        </div>
      </div>
    </div>
  );
}
