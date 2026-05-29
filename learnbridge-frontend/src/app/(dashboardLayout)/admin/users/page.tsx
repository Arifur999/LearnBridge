import { getAdminUsers } from "@/actions/dashboard.action";
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, ShieldCheck, UserX } from "lucide-react";
import AdminUsersClient from "./AdminUsersClient";

const text = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  const total    = users.length;
  const students = users.filter((u) => String(u.role ?? "").toLowerCase() === "student").length;
  const tutors   = users.filter((u) => { const r = String(u.role ?? "").toLowerCase(); return r === "tutor" || r === "trainer"; }).length;
  const admins   = users.filter((u) => String(u.role ?? "").toLowerCase() === "admin").length;
  const banned   = users.filter((u) => ["blocked", "banned"].includes(String(u.status ?? "").toLowerCase())).length;

  const statCards = [
    { icon: Users,         label: "Total Users", value: total,    sub: "All registered",    iconBg: "bg-primary/10",                          iconColor: "text-primary",                           bar: "bg-primary",     barW: "100%"  },
    { icon: GraduationCap, label: "Students",    value: students, sub: `${total > 0 ? Math.round((students/total)*100) : 0}% of users`,      iconBg: "bg-blue-100 dark:bg-blue-900/30",           iconColor: "text-blue-600 dark:text-blue-400",       bar: "bg-blue-500",    barW: total > 0 ? `${Math.round((students/total)*100)}%` : "0%" },
    { icon: BookOpen,      label: "Tutors",      value: tutors,   sub: `${total > 0 ? Math.round((tutors/total)*100) : 0}% of users`,        iconBg: "bg-violet-100 dark:bg-violet-900/30",       iconColor: "text-violet-600 dark:text-violet-400",   bar: "bg-violet-500",  barW: total > 0 ? `${Math.round((tutors/total)*100)}%` : "0%"   },
    { icon: ShieldCheck,   label: "Admins",      value: admins,   sub: "Platform admins",   iconBg: "bg-emerald-100 dark:bg-emerald-900/30",  iconColor: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", barW: total > 0 ? `${Math.round((admins/total)*100)}%` : "0%"   },
    { icon: UserX,         label: "Banned",      value: banned,   sub: "Restricted access", iconBg: "bg-red-100 dark:bg-red-900/30",          iconColor: "text-red-600 dark:text-red-400",         bar: "bg-red-500",     barW: total > 0 ? `${Math.round((banned/total)*100)}%` : "0%"   },
  ];

  /* Normalise for client component */
  const normalised = users.map((u, idx) => ({
    id:     text(u.id ?? u._id ?? u.email),
    name:   text(u.name, "Unknown"),
    email:  text(u.email),
    role:   String(u.role ?? "student").toLowerCase(),
    status: String(u.status ?? "active").toLowerCase(),
    joined: u.createdAt
      ? new Date(text(u.createdAt)).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : "—",
    idx,
  }));

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">User Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All registered users on the platform
        </p>
      </div>

      {/* ── Stats Card ─────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-primary via-violet-500 to-emerald-500" />
        <CardContent className="p-0">
          <div className="grid divide-y sm:divide-x sm:divide-y-0 sm:grid-cols-5">
            {statCards.map(({ icon: Icon, label, value, sub, iconBg, iconColor, bar, barW }) => (
              <div key={label} className="flex flex-col gap-3 p-5 transition-colors hover:bg-muted/40">
                <div className="flex items-start justify-between">
                  <div className={`flex size-9 items-center justify-center rounded-2xl ${iconBg}`}>
                    <Icon className={`size-4 ${iconColor}`} />
                  </div>
                  <span className="text-2xl font-black tabular-nums">{value}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${bar}`} style={{ width: barW }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Interactive User List ──────────────────────────────── */}
      <AdminUsersClient users={normalised} banned={banned} />
    </div>
  );
}
