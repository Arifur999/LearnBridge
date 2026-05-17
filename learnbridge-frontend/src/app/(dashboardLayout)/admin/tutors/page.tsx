import DashPageHeader from "@/components/layout/DashPageHeader";
import { getAuthHeaders } from "@/services/auth.server";
import { API_V1_URL } from "@/lib/config";
import { getAdminUsers } from "@/actions/dashboard.action";
import { tutorService } from "@/services/tutor.service";
import AllTutorsClient, { type AdminTutor } from "./AllTutorsClient";

type R = Record<string, unknown>;
const str = (v: unknown) => (typeof v === "string" ? v : undefined);
const num = (v: unknown) => (typeof v === "number" ? v : undefined);
const rec = (v: unknown): R => (v && typeof v === "object" && !Array.isArray(v) ? (v as R) : {});

async function fetchRawTutorProfiles(): Promise<R[]> {
  try {
    const headers = await getAuthHeaders();
    // try both endpoints
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

  const featuredIds = new Set(
    (Array.isArray(featuredRaw) ? featuredRaw : []).map(
      (t) => str(rec(t).id) ?? ""
    )
  );

  // Build email → user record map from admin/users (for userId lookup)
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

  // Primary: raw tutor profiles (have category, price, bio, etc.)
  for (const raw of rawProfiles) {
    const user = rec(raw.user ?? raw.User);
    const categoryObj = rec(raw.category ?? raw.Category);

    // profile id
    const profileId = str(raw.id ?? raw._id ?? raw.tutorProfileId) ?? "";
    if (!profileId || seen.has(profileId)) continue;
    seen.add(profileId);

    // user id — backend often nests it as raw.userId or raw.user.id
    const userId = str(raw.userId ?? raw.user_id ?? user.id ?? user._id) ?? "";
    const email = str(raw.email ?? user.email ?? "") ;

    // Try to find matching admin user to get userId
    const matchedUser = (userId && idToUser.get(userId))
      ?? (email && emailToUser.get(email.toLowerCase()))
      ?? {};

    const resolvedUserId = userId || str(matchedUser.id ?? matchedUser._id) || profileId;

    const category =
      str(categoryObj.name ?? categoryObj.title) ??
      str(raw.category) ??
      str(raw.subject) ??
      str(raw.specialty);

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
      isFeatured: featuredIds.has(profileId),
    });
  }

  // Secondary: admin users with tutor role not already added
  for (const u of allUsers) {
    const role = String(u.role ?? "").toLowerCase();
    if (role === "student" || role === "admin" || role === "") continue;

    const uid = str(u.id ?? u._id) ?? "";
    const email = str(u.email ?? "");

    // skip if already added via profile
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
      isFeatured: false,
    });
  }

  return (
    <div className="space-y-6">
      <DashPageHeader
        title="All Tutors"
        description={`${tutors.length} tutor${tutors.length !== 1 ? "s" : ""} registered on the platform.`}
      />
      <AllTutorsClient initialTutors={tutors} />
    </div>
  );
}
