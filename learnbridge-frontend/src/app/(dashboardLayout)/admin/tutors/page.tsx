import { getAdminUsers } from "@/actions/dashboard.action";
import { tutorService } from "@/services/tutor.service";
import AllTutorsClient, { type AdminTutor } from "./AllTutorsClient";
import { getAuthHeaders } from "@/services/auth.server";
import { API_V1_URL } from "@/lib/config";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Star, BookOpen, DollarSign, GraduationCap } from "lucide-react";

type R = Record<string, unknown>;
const str = (v: unknown) => (typeof v === "string" ? v : undefined);
const num = (v: unknown) => (typeof v === "number" ? v : undefined);
const rec = (v: unknown): R => (v && typeof v === "object" && !Array.isArray(v) ? (v as R) : {});

async function fetchRawTutorProfiles(): Promise<R[]> {
  try {
    const headers = await getAuthHeaders();
    for (const path of ["/tutors", "/admin/tutors"]) {
      const res = await fetch(`${API_V1_URL}${path}`, { headers, cache: "no-store" });
      if (!res.ok) continue;
      const data = await res.json();
      const inner = rec(data?.data ?? data);
      const list: unknown =
        Array.isArray(data) ? data :
        Array.isArray(data?.data) ? data.data :
        Array.isArray(inner?.tutors) ? inner.tutors :
        Array.isArray(inner?.data) ? inner.data :
        Array.isArray(inner?.items) ? inner.items : [];
      if (Array.isArray(list) && list.length > 0) return list as R[];
    }
    return [];
  } catch { return []; }
}

export default async function AdminTutorsPage() {
  const [rawProfiles, allUsers, featuredRaw] = await Promise.all([
    fetchRawTutorProfiles(),
    getAdminUsers(),
    tutorService.getFeaturedTutors(),
  ]);

  const featuredIds = new Set<string>();
  const featuredUserIds = new Set<string>();
  for (const t of (Array.isArray(featuredRaw) ? featuredRaw : [])) {
    const tr = rec(t);
    const pid = str(tr.id) ?? "";
    const uid = str(tr.userId ?? rec(tr.user).id) ?? "";
    if (pid) featuredIds.add(pid);
    if (uid) featuredUserIds.add(uid);
  }

  const emailToUser = new Map<string, R>();
  const idToUser = new Map<string, R>();
  for (const u of allUsers) {
    const uid = str(u.id ?? u._id ?? "");
    const email = str(u.email ?? "");
    if (email) emailToUser.set(email.toLowerCase(), u as R);
    if (uid) idToUser.set(uid, u as R);
  }

  const seen = new Set<string>();
  const tutors: AdminTutor[] = [];

  for (const raw of rawProfiles) {
    const user = rec(raw.user ?? raw.User);
    const categoryObj = rec(raw.category ?? raw.Category);
    const profileId = str(raw.id ?? raw._id ?? raw.tutorProfileId) ?? "";
    if (!profileId || seen.has(profileId)) continue;
    seen.add(profileId);

    const userId = str(raw.userId ?? raw.user_id ?? user.id ?? user._id) ?? "";
    const email = str(raw.email ?? user.email ?? "");
    const matchedUser: R = rec(
      (userId && idToUser.get(userId)) ??
      (email && emailToUser.get(email.toLowerCase())) ??
      {}
    );
    const resolvedUserId = userId || str(matchedUser.id ?? matchedUser._id) || profileId;
    const category =
      str(categoryObj.name ?? categoryObj.title) ??
      str(raw.category) ?? str(raw.subject) ?? str(raw.specialty);

    tutors.push({
      id: profileId,
      userId: resolvedUserId,
      name: str(raw.name ?? user.name ?? raw.fullName) ?? "Tutor",
      email: email || str(matchedUser.email),
      category,
      price: num(raw.hourlyRate ?? raw.price ?? raw.rate ?? raw.sessionFee),
      rating: num(raw.avgRating ?? raw.rating),
      subjects: Array.isArray(raw.subjects) ? (raw.subjects as string[]) : [],
      profileImage: str(raw.profileImage ?? raw.image ?? user.profileImage ?? user.image),
      bio: str(raw.bio ?? raw.about ?? raw.description),
      isFeatured: featuredIds.has(profileId) || featuredUserIds.has(resolvedUserId),
    });
  }

  for (const u of allUsers) {
    const role = String(u.role ?? "").toLowerCase();
    if (role === "student" || role === "admin" || role === "") continue;
    const uid = str(u.id ?? u._id) ?? "";
    const email = str(u.email ?? "");
    const alreadyAdded = tutors.some(
      (t) => t.userId === uid || (email && t.email?.toLowerCase() === email.toLowerCase())
    );
    if (alreadyAdded) continue;
    if (uid) seen.add(uid);
    tutors.push({
      id: uid,
      userId: uid,
      name: str(u.name) ?? "Tutor",
      email: email || undefined,
      isFeatured: featuredIds.has(uid) || featuredUserIds.has(uid),
    });
  }

  const featuredCount = tutors.filter((t) => t.isFeatured).length;
  const withRating    = tutors.filter((t) => t.rating != null && t.rating > 0).length;
  const avgRating     = withRating > 0
    ? tutors.reduce((s, t) => s + (t.rating ?? 0), 0) / withRating
    : 0;
  const withPrice     = tutors.filter((t) => t.price != null).length;

  const statCards = [
    { icon: Users,         label: "Total Tutors",   value: tutors.length,                          sub: "All registered tutors",      iconBg: "bg-primary/10",                          iconColor: "text-primary",                         bar: "bg-primary",     barW: "100%" },
    { icon: Star,          label: "Featured",        value: featuredCount,                          sub: "Highlighted on homepage",    iconBg: "bg-amber-100 dark:bg-amber-900/30",       iconColor: "text-amber-600 dark:text-amber-400",   bar: "bg-amber-500",   barW: tutors.length > 0 ? `${Math.round((featuredCount / tutors.length) * 100)}%` : "0%" },
    { icon: BookOpen,      label: "With Rating",     value: withRating,                             sub: `Avg ${avgRating.toFixed(1)} stars`,  iconBg: "bg-violet-100 dark:bg-violet-900/30", iconColor: "text-violet-600 dark:text-violet-400", bar: "bg-violet-500",  barW: tutors.length > 0 ? `${Math.round((withRating / tutors.length) * 100)}%` : "0%" },
    { icon: DollarSign,    label: "With Price",      value: withPrice,                              sub: "Have hourly rate set",       iconBg: "bg-emerald-100 dark:bg-emerald-900/30",   iconColor: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", barW: tutors.length > 0 ? `${Math.round((withPrice / tutors.length) * 100)}%` : "0%" },
    { icon: GraduationCap, label: "Standard",        value: tutors.length - featuredCount,          sub: "Not yet featured",           iconBg: "bg-blue-100 dark:bg-blue-900/30",        iconColor: "text-blue-600 dark:text-blue-400",     bar: "bg-blue-500",    barW: tutors.length > 0 ? `${Math.round(((tutors.length - featuredCount) / tutors.length) * 100)}%` : "0%" },
  ];

  return (
    <div className="space-y-6">

      
      <div>
        <h1 className="text-2xl font-black tracking-tight">All Tutors</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tutors.length} tutor{tutors.length !== 1 ? "s" : ""} registered on the platform
        </p>
      </div>

      
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-primary via-amber-500 to-emerald-500" />
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

      
      <AllTutorsClient initialTutors={tutors} />
    </div>
  );
}
