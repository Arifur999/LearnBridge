import { getCurrentUserFromServer } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Mail, Shield, CalendarDays, UserCircle2 } from "lucide-react";
import StudentProfileClient from "@/app/(dashboardLayout)/student/profile/StudentProfileClient";

export default async function StudentProfilePage() {
  const user = await getCurrentUserFromServer();
  if (!user) redirect("/login");

  const userImage =
    typeof (user as Record<string, unknown>)?.image === "string"
      ? ((user as Record<string, unknown>).image as string)
      : "";

  const joinedDate = (user as Record<string, unknown>)?.createdAt
    ? new Date(String((user as Record<string, unknown>).createdAt)).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "LearnBridge Member";

  const infoCards = [
    {
      icon: Mail,
      label: "Email Address",
      value: user.email ?? "N/A",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: Shield,
      label: "Account Role",
      value: String(user.role ?? "Student").charAt(0).toUpperCase() + String(user.role ?? "Student").slice(1).toLowerCase(),
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: CalendarDays,
      label: "Member Since",
      value: joinedDate,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: UserCircle2,
      label: "Account Status",
      value: "Active",
      iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
      iconColor: "text-cyan-600 dark:text-cyan-400",
    },
  ];

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 py-4">

      {/* Page title */}
      <div className="w-full text-center">
        <h1 className="text-2xl font-black tracking-tight">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Profile card */}
      <div className="w-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg">

        {/* Banner */}
        <div className="relative h-28 w-full bg-linear-to-r from-primary via-violet-500 to-indigo-600">
          {/* decorative circles */}
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -left-6 -bottom-6 size-24 rounded-full bg-white/8" />
        </div>

        {/* Avatar + info — overlaps banner */}
        <div className="flex flex-col items-center px-6 pb-8" style={{ marginTop: "-48px" }}>
          <StudentProfileClient
            initialName={user.name ?? ""}
            initialImage={userImage}
            userRole={String(user.role ?? "Student")}
          />
        </div>
      </div>

      {/* Info cards */}
      <div className="grid w-full grid-cols-2 gap-3">
        {infoCards.map(({ icon: Icon, label, value, iconBg, iconColor }) => (
          <div
            key={label}
            className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`inline-flex size-9 items-center justify-center rounded-xl ${iconBg}`}>
              <Icon className={`size-4 ${iconColor}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <p className="mt-0.5 truncate text-sm font-semibold">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
