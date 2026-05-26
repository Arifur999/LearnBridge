import { tutorService } from "@/services/tutor.service";
import FeaturedTutorsClient from "./FeaturedTutorsClient";

function extractName(t: Record<string, unknown>): string {
  const user = t.user as Record<string, unknown> | undefined;
  return String(t.name ?? user?.name ?? t.fullName ?? "Tutor");
}

function extractId(t: Record<string, unknown>): string {
  return String(t.id ?? t._id ?? t.tutorProfileId ?? "");
}

export default async function AdminFeaturedPage() {
  const [allResult, featuredRaw] = await Promise.all([
    tutorService.getAllTutors(),
    tutorService.getFeaturedTutors(),
  ]);

  const allTutors: Record<string, unknown>[] = Array.isArray(allResult?.data)
    ? allResult.data
    : [];

  const featuredIds = new Set(
    (Array.isArray(featuredRaw) ? featuredRaw : []).map((t: Record<string, unknown>) =>
      extractId(t)
    )
  );

  const tutors = allTutors
    .filter((t) => extractId(t))
    .map((t) => {
      const user = t.user as Record<string, unknown> | undefined;
      const category = t.category as Record<string, unknown> | undefined;
      const id = extractId(t);
      return {
        id,
        name: extractName(t),
        category:
          typeof category === "object" && category !== null
            ? String(category.name ?? "")
            : String(t.category ?? t.subject ?? ""),
        hourlyRate:
          typeof t.hourlyRate === "number" ? t.hourlyRate :
          typeof t.rate === "number" ? t.rate : undefined,
        avgRating:
          typeof t.avgRating === "number" ? t.avgRating :
          typeof t.rating === "number" ? t.rating : undefined,
        profileImage:
          String(t.profileImage ?? t.image ?? user?.profileImage ?? user?.image ?? ""),
        isFeatured: featuredIds.has(id),
      };
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Featured Tutors</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose which tutors are highlighted on the homepage and courses page
        </p>
      </div>
      <FeaturedTutorsClient tutors={tutors} />
    </div>
  );
}
