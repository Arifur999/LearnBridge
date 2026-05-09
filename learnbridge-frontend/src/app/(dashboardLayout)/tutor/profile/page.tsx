import { getTutorProfileAction } from "@/actions/dashboard.action";
import { getCategories } from "@/actions/course.action";
import TutorProfileForm from "./TutorProfileForm";

export default async function TutorProfilePage() {
  const [profile, categories] = await Promise.all([
    getTutorProfileAction(),
    getCategories(),
  ]);

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

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tutor Profile</h1>
        <p className="text-muted-foreground">
          Keep your profile clear so students know what you teach.
        </p>
      </div>
      <TutorProfileForm
        profile={normalizedProfile}
        categories={normalizedCategories}
      />
    </div>
  );
}
