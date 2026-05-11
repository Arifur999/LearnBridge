import DashPageHeader from "@/components/layout/DashPageHeader";
import { tutorService } from "@/services/tutor.service";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default async function AdminFeaturedPage() {
  const tutors = await tutorService.getFeaturedTutors();
  const list = Array.isArray(tutors) ? tutors : [];

  return (
    <div className="space-y-6">
      <DashPageHeader title="Featured Tutors" description="Manage which tutors are highlighted on the platform." />

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">No featured tutors found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((tutor: Record<string, unknown>, i) => {
            const user = tutor?.user as Record<string, unknown> | undefined;
            const category = tutor?.category as Record<string, unknown> | undefined;
            const name = String(user?.name ?? tutor?.name ?? "Tutor");
            const id = String(tutor?.id ?? i);
            return (
              <div key={id} className="rounded-2xl border bg-background p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                    {name.charAt(0)}
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="size-3 fill-yellow-400 text-yellow-400" /> Featured
                  </Badge>
                </div>
                <h3 className="font-semibold">{name}</h3>
                {category?.name != null && <p className="text-xs text-primary mt-0.5">{String(category.name)}</p>}
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  {tutor?.avgRating != null && <span>★ {String(tutor.avgRating)}</span>}
                  {tutor?.hourlyRate != null && <span>${String(tutor.hourlyRate)}/hr</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
