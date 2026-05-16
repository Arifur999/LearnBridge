import DashPageHeader from "@/components/layout/DashPageHeader";
import { getAllTutorsAdminAction } from "@/actions/admin.action";
import { tutorService } from "@/services/tutor.service";
import AllTutorsClient, { type AdminTutor } from "./AllTutorsClient";

export default async function AdminTutorsPage() {
  const [tutorsResult, featuredRaw] = await Promise.all([
    getAllTutorsAdminAction(),
    tutorService.getFeaturedTutors(),
  ]);

  const rawList = tutorsResult.data as Record<string, unknown>[];

  const featuredIds = new Set(
    (Array.isArray(featuredRaw) ? featuredRaw : []).map(
      (t) => String((t as Record<string, unknown>).id ?? "")
    )
  );

  const tutors: AdminTutor[] = rawList.map((t) => {
    const id = String(t.id ?? t._id ?? "");
    return {
      id,
      name: String(t.title ?? t.name ?? "Tutor"),
      email: t.email ? String(t.email) : undefined,
      category: t.category ? String(t.category) : undefined,
      price: typeof t.price === "number" ? t.price : typeof t.hourlyRate === "number" ? t.hourlyRate : undefined,
      rating: typeof t.rating === "number" ? t.rating : undefined,
      subjects: Array.isArray(t.subjects) ? (t.subjects as string[]) : [],
      profileImage: t.profileImage ? String(t.profileImage) : undefined,
      bio: t.description ? String(t.description) : undefined,
      isFeatured: featuredIds.has(id),
    };
  });

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
