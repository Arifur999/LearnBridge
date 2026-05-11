import DashPageHeader from "@/components/layout/DashPageHeader";
import { getAdminUsers } from "@/actions/dashboard.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldCheck, ShieldBan, UserCog } from "lucide-react";

export default async function ModeratorDashboardPage() {
  const users = await getAdminUsers();
  const total = users.length;
  const active = users.filter((u) => String(u?.status ?? "active").toLowerCase() !== "blocked").length;
  const banned = users.filter((u) => String(u?.status ?? "").toLowerCase() === "blocked").length;
  const mods = users.filter((u) => String(u?.role ?? "").toLowerCase() === "moderator").length;

  const cards = [
    { icon: Users,       label: "Total Users",     value: total,  color: "bg-primary/10 text-primary" },
    { icon: ShieldCheck, label: "Active",           value: active, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { icon: ShieldBan,   label: "Banned",           value: banned, color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
    { icon: UserCog,     label: "Moderators",       value: mods,   color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
  ];

  const roleCounts: Record<string, number> = {};
  users.forEach((u) => {
    const r = String(u?.role ?? "Unknown");
    roleCounts[r] = (roleCounts[r] ?? 0) + 1;
  });

  return (
    <div className="space-y-8">
      <DashPageHeader title="Moderator Overview" description="Platform user activity and access status." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, color }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className={`mb-3 inline-flex rounded-xl p-3 ${color}`}><Icon className="size-5" /></div>
              <p className="text-3xl font-bold">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="max-w-md">
        <CardHeader><CardTitle>Users by Role</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(roleCounts).map(([role, count]) => {
            const pct = total ? Math.round((count / total) * 100) : 0;
            return (
              <div key={role}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{role.toLowerCase()}</span>
                  <span className="font-medium">{count} ({pct}%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
