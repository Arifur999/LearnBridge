import { getAdminUsers } from "@/actions/dashboard.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, ShieldCheck, UserX } from "lucide-react";
import UserStatusToggle from "./UserStatusToggle";

const text = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const ROLE_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  admin:   { label: "Admin",   bg: "bg-red-100 dark:bg-red-900/30",       text: "text-red-700 dark:text-red-400",       dot: "bg-red-500"     },
  trainer: { label: "Tutor",   bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400", dot: "bg-violet-500"  },
  tutor:   { label: "Tutor",   bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400", dot: "bg-violet-500"  },
  student: { label: "Student", bg: "bg-blue-100 dark:bg-blue-900/30",     text: "text-blue-700 dark:text-blue-400",     dot: "bg-blue-500"    },
};

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  active:  { label: "Active",  bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  blocked: { label: "Banned",  bg: "bg-red-100 dark:bg-red-900/30",         text: "text-red-700 dark:text-red-400",         dot: "bg-red-500"     },
  banned:  { label: "Banned",  bg: "bg-red-100 dark:bg-red-900/30",         text: "text-red-700 dark:text-red-400",         dot: "bg-red-500"     },
};

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
];

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  const total    = users.length;
  const students = users.filter((u) => String(u.role ?? "").toLowerCase() === "student").length;
  const tutors   = users.filter((u) => { const r = String(u.role ?? "").toLowerCase(); return r === "tutor" || r === "trainer"; }).length;
  const admins   = users.filter((u) => String(u.role ?? "").toLowerCase() === "admin").length;
  const banned   = users.filter((u) => ["blocked", "banned"].includes(String(u.status ?? "").toLowerCase())).length;

  const statCards = [
    { icon: Users,        label: "Total Users", value: total,    sub: "All registered",    iconBg: "bg-primary/10",                          iconColor: "text-primary",                          bar: "bg-primary",     barW: "100%" },
    { icon: GraduationCap,label: "Students",    value: students, sub: `${total > 0 ? Math.round((students/total)*100) : 0}% of users`,      iconBg: "bg-blue-100 dark:bg-blue-900/30",           iconColor: "text-blue-600 dark:text-blue-400",      bar: "bg-blue-500",    barW: total > 0 ? `${Math.round((students/total)*100)}%` : "0%" },
    { icon: BookOpen,     label: "Tutors",      value: tutors,   sub: `${total > 0 ? Math.round((tutors/total)*100) : 0}% of users`,        iconBg: "bg-violet-100 dark:bg-violet-900/30",       iconColor: "text-violet-600 dark:text-violet-400",  bar: "bg-violet-500",  barW: total > 0 ? `${Math.round((tutors/total)*100)}%` : "0%" },
    { icon: ShieldCheck,  label: "Admins",      value: admins,   sub: "Platform admins",   iconBg: "bg-amber-100 dark:bg-amber-900/30",      iconColor: "text-amber-600 dark:text-amber-400",    bar: "bg-amber-500",   barW: total > 0 ? `${Math.round((admins/total)*100)}%` : "0%" },
    { icon: UserX,        label: "Banned",      value: banned,   sub: "Restricted access", iconBg: "bg-red-100 dark:bg-red-900/30",          iconColor: "text-red-600 dark:text-red-400",        bar: "bg-red-500",     barW: total > 0 ? `${Math.round((banned/total)*100)}%` : "0%" },
  ];

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

      {/* ── Users Table ────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
                <Users className="size-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">All Users</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">{total} registered members</p>
              </div>
            </div>
            {banned > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-400">
                <span className="size-1.5 rounded-full bg-red-500" />
                {banned} banned
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-muted">
                <Users className="size-8 text-muted-foreground/40" />
              </div>
              <p className="font-semibold">No users found</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="hidden border-b bg-muted/40 sm:grid sm:grid-cols-[2fr_2.5fr_1fr_1fr_1.2fr_auto] gap-4 px-5 py-3">
                {["User", "Email", "Role", "Status", "Joined", "Action"].map((h) => (
                  <p key={h} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</p>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-border/60">
                {users.map((user, idx) => {
                  const userId        = text(user.id ?? user._id ?? user.email);
                  const userName      = text(user.name, "Unknown");
                  const userEmail     = text(user.email);
                  const rawRole       = String(user.role ?? "student").toLowerCase();
                  const rawStatus     = String(user.status ?? "active").toLowerCase();
                  const isBanned      = ["blocked", "banned"].includes(rawStatus);
                  const roleCfg       = ROLE_CFG[rawRole]   ?? ROLE_CFG.student;
                  const statusCfg     = STATUS_CFG[rawStatus] ?? STATUS_CFG.active;
                  const joined        = user.createdAt
                    ? new Date(text(user.createdAt)).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                    : "—";

                  return (
                    <div
                      key={userId}
                      className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-muted/30 sm:grid-cols-[2fr_2.5fr_1fr_1fr_1.2fr_auto] sm:items-center sm:gap-4"
                    >
                      {/* User */}
                      <div className="flex items-center gap-3">
                        <div className={`flex size-9 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                          {userName[0]?.toUpperCase() ?? "U"}
                        </div>
                        <p className="truncate text-sm font-semibold">{userName}</p>
                      </div>

                      {/* Email */}
                      <p className="truncate text-sm text-muted-foreground">{userEmail}</p>

                      {/* Role */}
                      <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${roleCfg.bg} ${roleCfg.text}`}>
                        <span className={`size-1.5 rounded-full ${roleCfg.dot}`} />
                        {roleCfg.label}
                      </span>

                      {/* Status */}
                      <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                        <span className={`size-1.5 rounded-full ${isBanned ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`} />
                        {statusCfg.label}
                      </span>

                      {/* Joined */}
                      <p className="text-xs text-muted-foreground">{joined}</p>

                      {/* Action */}
                      <UserStatusToggle userId={userId} isBanned={isBanned} />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
