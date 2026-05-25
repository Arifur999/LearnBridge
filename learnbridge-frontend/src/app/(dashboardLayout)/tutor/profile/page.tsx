import { getTutorProfileAction } from "@/actions/dashboard.action";
import { getCategories } from "@/actions/course.action";
import { getCurrentUserFromServer } from "@/lib/auth";
import { redirect } from "next/navigation";
import TutorProfileClient from "./TutorProfileClient";
import { Mail, Shield, DollarSign, Tag } from "lucide-react";

export default async function TutorProfilePage() {
  const [user, profile, categories] = await Promise.all([
    getCurrentUserFromServer(),
    getTutorProfileAction(),
    getCategories(),
  ]);

  if (!user) redirect("/login");

  const normalizedProfile = profile
    ? {
        bio: String(profile.bio ?? profile.description ?? ""),
        subjects: Array.isArray(profile.subjects)
          ? (profile.subjects as string[]).join(", ")
          : String(profile.subjects ?? ""),
        hourlyRate: Number(profile.hourlyRate ?? profile.rate ?? 0),
        category:
          typeof profile.category === "object" && profile.category !== null
            ? String((profile.category as { name?: unknown }).name ?? "")
            : String(profile.category ?? ""),
        profileImage: String(profile.profileImage ?? ""),
      }
    : null;

  const normalizedCategories = (categories as unknown[]).map((c) => {
    const cat = c as Record<string, unknown>;
    return {
      id: String(cat.id ?? cat._id ?? ""),
      name: String(cat.name ?? cat.title ?? "Category"),
    };
  });

  const userImage =
    typeof (user as Record<string, unknown>)?.image === "string"
      ? ((user as Record<string, unknown>).image as string)
      : normalizedProfile?.profileImage ?? "";

  const subjectList = normalizedProfile?.subjects
    ? normalizedProfile.subjects.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const subjectsDisplay =
    subjectList.length > 0
      ? subjectList.slice(0, 3).join(", ") + (subjectList.length > 3 ? ` +${subjectList.length - 3}` : "")
      : "Not set";

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
      value:
        String(user.role ?? "Tutor").charAt(0).toUpperCase() +
        String(user.role ?? "Tutor").slice(1).toLowerCase(),
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: DollarSign,
      label: "Session Price",
      value: normalizedProfile?.hourlyRate ? `৳${normalizedProfile.hourlyRate}` : "Not set",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Tag,
      label: "Subjects",
      value: subjectsDisplay,
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 py-4">

      {/* Title */}
      <div className="w-full text-center">
        <h1 className="text-2xl font-black tracking-tight">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your teaching profile and account settings
        </p>
      </div>

      {/* Profile card */}
      <div className="w-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg">
        {/* Banner */}
        <div className="relative h-28 w-full bg-linear-to-r from-primary via-violet-500 to-indigo-600">
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -left-6 -bottom-6 size-24 rounded-full bg-white/8" />
        </div>

        {/* Avatar + edit — overlaps banner */}
        <div className="flex flex-col items-center px-6 pb-6" style={{ marginTop: "-48px" }}>
          <TutorProfileClient
            initialName={user.name ?? ""}
            initialImage={userImage}
            userRole={String(user.role ?? "Tutor")}
            profile={normalizedProfile}
            categories={normalizedCategories}
          />
        </div>
      </div>

      {/* Info cards — 2×2 */}
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
