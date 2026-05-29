"use client";

import { useState } from "react";
import { Search, Users, GraduationCap, BookOpen, ShieldCheck, UserX, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserStatusToggle from "./UserStatusToggle";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  idx: number;
}

const ROLE_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  admin:   { label: "Admin",   bg: "bg-red-100 dark:bg-red-900/30",       text: "text-red-700 dark:text-red-400",       dot: "bg-red-500"    },
  trainer: { label: "Tutor",   bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400", dot: "bg-violet-500" },
  tutor:   { label: "Tutor",   bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400", dot: "bg-violet-500" },
  student: { label: "Student", bg: "bg-blue-100 dark:bg-blue-900/30",     text: "text-blue-700 dark:text-blue-400",     dot: "bg-blue-500"   },
};

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  active:  { label: "Active", bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  blocked: { label: "Banned", bg: "bg-red-100 dark:bg-red-900/30",         text: "text-red-700 dark:text-red-400",         dot: "bg-red-500"     },
  banned:  { label: "Banned", bg: "bg-red-100 dark:bg-red-900/30",         text: "text-red-700 dark:text-red-400",         dot: "bg-red-500"     },
};

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
];

type TabKey = "ALL" | "STUDENT" | "TUTOR" | "ADMIN" | "BANNED";

const TAB_CFG: Record<TabKey, { label: string; icon: React.ElementType; active: string }> = {
  ALL:     { label: "All",      icon: Filter,       active: "bg-primary text-primary-foreground"           },
  STUDENT: { label: "Students", icon: GraduationCap,active: "bg-blue-600 text-white"                       },
  TUTOR:   { label: "Tutors",   icon: BookOpen,     active: "bg-violet-600 text-white"                     },
  ADMIN:   { label: "Admins",   icon: ShieldCheck,  active: "bg-rose-600 text-white"                       },
  BANNED:  { label: "Banned",   icon: UserX,        active: "bg-red-600 text-white"                        },
};

export default function AdminUsersClient({ users: raw, banned: bannedCount }: {
  users: User[];
  banned: number;
}) {
  const [tab, setTab]       = useState<TabKey>("ALL");
  const [search, setSearch] = useState("");

  const counts: Record<TabKey, number> = {
    ALL:     raw.length,
    STUDENT: raw.filter((u) => u.role === "student").length,
    TUTOR:   raw.filter((u) => u.role === "tutor" || u.role === "trainer").length,
    ADMIN:   raw.filter((u) => u.role === "admin").length,
    BANNED:  raw.filter((u) => ["blocked", "banned"].includes(u.status)).length,
  };

  const filtered = raw.filter((u) => {
    const q = search.toLowerCase().trim();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchTab =
      tab === "ALL"     ? true :
      tab === "BANNED"  ? ["blocked", "banned"].includes(u.status) :
      tab === "TUTOR"   ? (u.role === "tutor" || u.role === "trainer") :
      u.role === tab.toLowerCase();
    return matchSearch && matchTab;
  });

  return (
    <Card className="overflow-hidden">
      <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />

      <CardHeader className="border-b pb-4">
        <div className="flex flex-col gap-4">

          {/* Title + search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
                <Users className="size-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">All Users</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {filtered.length} of {raw.length} member{raw.length !== 1 ? "s" : ""}
                  {bannedCount > 0 && (
                    <span className="ml-2 text-red-500 font-semibold">· {bannedCount} banned</span>
                  )}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl pl-9 text-sm h-9"
              />
            </div>
          </div>

          {/* Tab pills */}
          <div className="flex flex-wrap gap-2">
            {(Object.entries(TAB_CFG) as [TabKey, typeof TAB_CFG[TabKey]][]).map(([key, cfg]) => {
              const TabIcon = cfg.icon;
              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    tab === key ? cfg.active : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <TabIcon className="size-3.5" />
                  {cfg.label}
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === key ? "bg-white/20" : "bg-background"}`}>
                    {counts[key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-muted">
              <Users className="size-8 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold">
                {search ? `No results for "${search}"` : `No ${TAB_CFG[tab].label} found`}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {search ? "Try a different search term" : "No users in this category yet"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div className="hidden border-b bg-muted/40 sm:grid sm:grid-cols-[2fr_2.5fr_1fr_1fr_1.2fr_auto] gap-4 px-5 py-3">
              {["User", "Email", "Role", "Status", "Joined", "Action"].map((h) => (
                <p key={h} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</p>
              ))}
            </div>

            <div className="divide-y divide-border/60">
              {filtered.map((user) => {
                const isBanned  = ["blocked", "banned"].includes(user.status);
                const roleCfg   = ROLE_CFG[user.role]   ?? ROLE_CFG.student;
                const statusCfg = STATUS_CFG[user.status] ?? STATUS_CFG.active;

                return (
                  <div
                    key={user.id}
                    className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-muted/30 sm:grid-cols-[2fr_2.5fr_1fr_1fr_1.2fr_auto] sm:items-center sm:gap-4"
                  >
                    {/* User */}
                    <div className="flex items-center gap-3">
                      <div className={`flex size-9 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${AVATAR_COLORS[user.idx % AVATAR_COLORS.length]}`}>
                        {user.name[0]?.toUpperCase() ?? "U"}
                      </div>
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                    </div>

                    {/* Email */}
                    <p className="truncate text-sm text-muted-foreground">{user.email}</p>

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
                    <p className="text-xs text-muted-foreground">{user.joined}</p>

                    {/* Action */}
                    <UserStatusToggle userId={user.id} isBanned={isBanned} />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
