import Link from "next/link";
import {
  BookOpenCheck, Tags, Users, TrendingUp, ArrowRight,
  CheckCircle2, XCircle, Clock, LayoutGrid, ShieldCheck,
  Sparkles, CreditCard, Star, Activity,
} from "lucide-react";
import { getAdminBookings, getAdminUsers, getCategories } from "@/actions/dashboard.action";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUserFromServer } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const [user, users, bookings, categories] = await Promise.all([
    getCurrentUserFromServer(),
    getAdminUsers(),
    getAdminBookings(),
    getCategories(),
  ]);

  const confirmed  = bookings.filter((b) => String(b.status ?? "").toUpperCase() === "CONFIRMED").length;
  const completed  = bookings.filter((b) => String(b.status ?? "").toUpperCase() === "COMPLETED").length;
  const cancelled  = bookings.filter((b) => String(b.status ?? "").toUpperCase() === "CANCELLED").length;
  const pending    = bookings.filter((b) => String(b.status ?? "").toUpperCase() === "PENDING").length;
  const students   = users.filter((u) => String(u.role ?? "").toLowerCase() === "student").length;
  const tutors     = users.filter((u) => { const r = String(u.role ?? "").toLowerCase(); return r === "tutor" || r === "trainer"; }).length;
  const admins     = users.filter((u) => String(u.role ?? "").toLowerCase() === "admin").length;
  const banned     = users.filter((u) => ["blocked", "banned"].includes(String(u.status ?? "").toLowerCase())).length;

  const total = bookings.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statCards = [
    {
      icon: Users, label: "Total Users", value: users.length,
      sub: `${students} students · ${tutors} tutors`,
      iconBg: "bg-primary/10", iconColor: "text-primary",
      bar: "bg-primary", barW: "100%", href: "/admin/users",
    },
    {
      icon: BookOpenCheck, label: "Total Bookings", value: bookings.length,
      sub: "All time sessions",
      iconBg: "bg-violet-100 dark:bg-violet-900/30", iconColor: "text-violet-600 dark:text-violet-400",
      bar: "bg-violet-500", barW: "100%", href: "/admin/bookings",
    },
    {
      icon: CheckCircle2, label: "Completed", value: completed,
      sub: `${completionRate}% completion rate`,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30", iconColor: "text-emerald-600 dark:text-emerald-400",
      bar: "bg-emerald-500", barW: total > 0 ? `${completionRate}%` : "0%", href: "/admin/bookings",
    },
    {
      icon: TrendingUp, label: "Confirmed", value: confirmed,
      sub: "Awaiting session",
      iconBg: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400",
      bar: "bg-blue-500", barW: total > 0 ? `${Math.round((confirmed / total) * 100)}%` : "0%", href: "/admin/bookings",
    },
    {
      icon: XCircle, label: "Cancelled", value: cancelled,
      sub: "Sessions cancelled",
      iconBg: "bg-red-100 dark:bg-red-900/30", iconColor: "text-red-600 dark:text-red-400",
      bar: "bg-red-500", barW: total > 0 ? `${Math.round((cancelled / total) * 100)}%` : "0%", href: "/admin/bookings",
    },
    {
      icon: Clock, label: "Pending", value: pending,
      sub: "Awaiting confirmation",
      iconBg: "bg-amber-100 dark:bg-amber-900/30", iconColor: "text-amber-600 dark:text-amber-400",
      bar: "bg-amber-500", barW: total > 0 ? `${Math.round((pending / total) * 100)}%` : "0%", href: "/admin/bookings",
    },
    {
      icon: Tags, label: "Categories", value: categories.length,
      sub: "Subject categories",
      iconBg: "bg-cyan-100 dark:bg-cyan-900/30", iconColor: "text-cyan-600 dark:text-cyan-400",
      bar: "bg-cyan-500", barW: "100%", href: "/admin/categories",
    },
    {
      icon: ShieldCheck, label: "Admins", value: admins,
      sub: "Platform admins",
      iconBg: "bg-amber-100 dark:bg-amber-900/30", iconColor: "text-amber-600 dark:text-amber-400",
      bar: "bg-amber-500", barW: users.length > 0 ? `${Math.round((admins / users.length) * 100)}%` : "0%", href: "/admin/users",
    },
  ];

  const quickLinks = [
    { href: "/admin/users",      label: "Manage Users",      desc: "View & ban platform members",  icon: Users,         bg: "bg-primary/10",                          color: "text-primary"                            },
    { href: "/admin/bookings",   label: "All Bookings",      desc: "View every session booking",   icon: BookOpenCheck, bg: "bg-violet-100 dark:bg-violet-900/30",    color: "text-violet-600 dark:text-violet-400"    },
    { href: "/admin/tutors",     label: "All Tutors",        desc: "Manage tutor profiles",        icon: LayoutGrid,    bg: "bg-indigo-100 dark:bg-indigo-900/30",    color: "text-indigo-600 dark:text-indigo-400"    },
    { href: "/admin/categories", label: "Categories",        desc: "Add & edit subject categories", icon: Tags,         bg: "bg-cyan-100 dark:bg-cyan-900/30",        color: "text-cyan-600 dark:text-cyan-400"        },
    { href: "/admin/payments",   label: "Payments",          desc: "Track all transactions",       icon: CreditCard,    bg: "bg-emerald-100 dark:bg-emerald-900/30",  color: "text-emerald-600 dark:text-emerald-400"  },
    { href: "/admin/featured",   label: "Featured Tutors",   desc: "Highlight top tutors",         icon: Star,          bg: "bg-amber-100 dark:bg-amber-900/30",      color: "text-amber-600 dark:text-amber-400"      },
    { href: "/admin/analytics",  label: "Analytics",         desc: "Platform-wide insights",       icon: Activity,     bg: "bg-rose-100 dark:bg-rose-900/30",        color: "text-rose-600 dark:text-rose-400"        },
    { href: "/admin/moderators", label: "Moderators",        desc: "Invite platform moderators",   icon: ShieldCheck,   bg: "bg-slate-100 dark:bg-slate-900/30",      color: "text-slate-600 dark:text-slate-400"      },
  ];

  return (
    <div className="space-y-6">

      
      <Card className="overflow-hidden">
        <div className="relative bg-linear-to-br from-slate-900 via-primary/90 to-violet-700 p-6 text-white">
          {/* Decorative */}
          <div className="absolute -top-10 -right-10 size-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 right-24 size-28 rounded-full bg-white/5" />
          <div className="absolute top-3 right-52 size-14 rounded-full bg-white/10" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="size-4 text-white/70" />
                <p className="text-sm font-medium text-white/70">Admin Panel</p>
              </div>
              <h1 className="text-2xl font-black tracking-tight">
                {user?.name ?? "Admin"} 👋
              </h1>
              <p className="mt-1 text-sm text-white/70">
                {users.length} users · {bookings.length} bookings · {completionRate}% completion rate
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/users"
                className="flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                <Users className="size-4" /> Users
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <Activity className="size-4" /> Analytics
              </Link>
            </div>
          </div>
        </div>
      </Card>

      
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-primary via-violet-500 to-emerald-500" />
        <CardContent className="p-0">
          <div className="grid divide-y sm:divide-x sm:divide-y-0 sm:grid-cols-4 lg:grid-cols-8">
            {statCards.map(({ icon: Icon, label, value, sub, iconBg, iconColor, bar, barW, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/40 group"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex size-9 items-center justify-center rounded-2xl ${iconBg}`}>
                    <Icon className={`size-4 ${iconColor}`} />
                  </div>
                  <span className="text-2xl font-black tabular-nums">{value}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">{label}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{sub}</p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${bar}`} style={{ width: barW }} />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">

        {/* Booking Summary */}
        <Card className="overflow-hidden">
          <div className="h-[3px] w-full bg-linear-to-r from-violet-500 to-primary" />
          <div className="border-b px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
                <BookOpenCheck className="size-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">Booking Summary</p>
                <p className="text-xs text-muted-foreground">{bookings.length} total sessions</p>
              </div>
            </div>
          </div>
          <CardContent className="p-0">
            {[
              { label: "Confirmed",  value: confirmed,  color: "bg-blue-500",    pct: total > 0 ? Math.round((confirmed / total) * 100) : 0 },
              { label: "Completed",  value: completed,  color: "bg-emerald-500", pct: completionRate },
              { label: "Pending",    value: pending,    color: "bg-amber-500",   pct: total > 0 ? Math.round((pending / total) * 100) : 0 },
              { label: "Cancelled",  value: cancelled,  color: "bg-red-500",     pct: total > 0 ? Math.round((cancelled / total) * 100) : 0 },
            ].map(({ label, value, color, pct }) => (
              <div key={label} className="flex items-center gap-4 border-b px-5 py-3.5 last:border-0">
                <div className={`size-2 shrink-0 rounded-full ${color}`} />
                <span className="flex-1 text-sm font-medium">{label}</span>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-sm font-black tabular-nums">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="overflow-hidden">
          <div className="h-[3px] w-full bg-linear-to-r from-primary to-cyan-500" />
          <div className="border-b px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Quick Actions</p>
                <p className="text-xs text-muted-foreground">Jump to any section</p>
              </div>
            </div>
          </div>
          <CardContent className="space-y-1.5 p-4">
            {quickLinks.map(({ href, label, desc, icon: Icon, bg, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-2xl border p-3 transition-all hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm group"
              >
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`size-4 ${color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-muted-foreground truncate">{desc}</p>
                </div>
                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      
      <Card className="overflow-hidden">
        <div className="h-[3px] w-full bg-linear-to-r from-primary to-violet-500" />
        <div className="border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
              <Users className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">User Breakdown</p>
              <p className="text-xs text-muted-foreground">{users.length} total registered members</p>
            </div>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="grid divide-y sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {[
              { label: "Students",  value: students, pct: users.length > 0 ? Math.round((students / users.length) * 100) : 0, bar: "bg-blue-500",    bg: "bg-blue-50 dark:bg-blue-900/20",    text: "text-blue-600 dark:text-blue-400" },
              { label: "Tutors",    value: tutors,   pct: users.length > 0 ? Math.round((tutors   / users.length) * 100) : 0, bar: "bg-violet-500",  bg: "bg-violet-50 dark:bg-violet-900/20", text: "text-violet-600 dark:text-violet-400" },
              { label: "Admins",    value: admins,   pct: users.length > 0 ? Math.round((admins   / users.length) * 100) : 0, bar: "bg-amber-500",   bg: "bg-amber-50 dark:bg-amber-900/20",  text: "text-amber-600 dark:text-amber-400" },
              { label: "Banned",    value: banned,   pct: users.length > 0 ? Math.round((banned   / users.length) * 100) : 0, bar: "bg-red-500",     bg: "bg-red-50 dark:bg-red-900/20",      text: "text-red-600 dark:text-red-400" },
            ].map(({ label, value, pct, bar, bg, text }) => (
              <div key={label} className="flex flex-col gap-2 p-5">
                <div className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${bg} ${text}`}>
                  {label}
                </div>
                <p className="text-2xl font-black tabular-nums">{value}</p>
                <div className="space-y-1">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{pct}% of total users</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
