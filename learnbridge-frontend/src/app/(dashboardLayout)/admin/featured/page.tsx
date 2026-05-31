import { tutorService } from "@/services/tutor.service";
import FeaturedTutorsClient from "./FeaturedTutorsClient";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Star, Users, TrendingUp } from "lucide-react";

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
    ? allResult.data : [];

  const featuredIds = new Set(
    (Array.isArray(featuredRaw) ? featuredRaw : []).map((t: Record<string, unknown>) => extractId(t))
  );

  const tutors = allTutors
    .filter((t) => extractId(t))
    .map((t) => {
      const user     = t.user     as Record<string, unknown> | undefined;
      const category = t.category as Record<string, unknown> | undefined;
      const id       = extractId(t);
      return {
        id,
        name: extractName(t),
        category:
          typeof category === "object" && category !== null
            ? String(category.name ?? "")
            : String(t.category ?? t.subject ?? ""),
        hourlyRate:
          typeof t.hourlyRate === "number" ? t.hourlyRate :
          typeof t.rate       === "number" ? t.rate       : undefined,
        avgRating:
          typeof t.avgRating === "number" ? t.avgRating :
          typeof t.rating    === "number" ? t.rating    : undefined,
        profileImage: String(t.profileImage ?? t.image ?? user?.profileImage ?? user?.image ?? ""),
        isFeatured:   featuredIds.has(id),
      };
    });

  const total    = tutors.length;
  const featured = tutors.filter((t) => t.isFeatured).length;
  const standard = total - featured;
  const withRate = tutors.filter((t) => t.avgRating != null && t.avgRating > 0).length;

  const statCards = [
    { icon: GraduationCap, label: "Total Tutors",   value: total,    sub: "All registered tutors",       iconBg: "bg-primary/10",                          iconColor: "text-primary",                           bar: "bg-primary",    barW: "100%"  },
    { icon: Star,          label: "Featured",        value: featured, sub: "Highlighted on homepage",     iconBg: "bg-violet-100 dark:bg-violet-900/30",     iconColor: "text-violet-600 dark:text-violet-400",   bar: "bg-violet-500", barW: total > 0 ? `${Math.round((featured / total) * 100)}%` : "0%" },
    { icon: Users,         label: "Standard",        value: standard, sub: "Not yet featured",            iconBg: "bg-blue-100 dark:bg-blue-900/30",         iconColor: "text-blue-600 dark:text-blue-400",       bar: "bg-blue-500",   barW: total > 0 ? `${Math.round((standard / total) * 100)}%` : "0%" },
    { icon: TrendingUp,    label: "With Rating",     value: withRate, sub: "Have student reviews",        iconBg: "bg-emerald-100 dark:bg-emerald-900/30",   iconColor: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500",barW: total > 0 ? `${Math.round((withRate / total) * 100)}%` : "0%" },
  ];

  return (
    <div className="space-y-6">

      
      <div>
        <h1 className="text-2xl font-black tracking-tight">Featured Tutors</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose which tutors are highlighted on the homepage and courses page
        </p>
      </div>

      
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-primary via-violet-500 to-emerald-500" />
        <CardContent className="p-0">
          <div className="grid divide-y sm:divide-x sm:divide-y-0 sm:grid-cols-4">
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

      
      <FeaturedTutorsClient tutors={tutors} />
    </div>
  );
}
