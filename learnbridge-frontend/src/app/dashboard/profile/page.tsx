import { getCurrentUserFromServer } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashPageHeader from "@/components/layout/DashPageHeader";

export default async function StudentProfilePage() {
  const user = await getCurrentUserFromServer();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <DashPageHeader title="My Profile" description="Manage your account information." />
      <Card className="max-w-xl">
        <CardHeader><CardTitle>Account Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {(user.name ?? "U").charAt(0).toUpperCase()}
          </div>
          <div className="grid gap-3 text-sm">
            <div className="flex gap-3">
              <span className="w-24 shrink-0 text-muted-foreground">Name</span>
              <span className="font-medium">{user.name ?? "—"}</span>
            </div>
            <div className="flex gap-3">
              <span className="w-24 shrink-0 text-muted-foreground">Email</span>
              <span className="font-medium">{user.email ?? "—"}</span>
            </div>
            <div className="flex gap-3">
              <span className="w-24 shrink-0 text-muted-foreground">Role</span>
              <span className="capitalize font-medium">{user.role ?? "student"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
