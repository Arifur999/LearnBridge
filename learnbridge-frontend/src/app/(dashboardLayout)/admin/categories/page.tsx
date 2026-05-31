import { getCategories } from "@/actions/dashboard.action";
import CategoriesManager from "./CategoriesManager";
import { Card, CardContent } from "@/components/ui/card";
import { Tags, BookOpen, Layers, LayoutGrid } from "lucide-react";

const text = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  const normalizedCategories = categories.map((cat) => ({
    id:          text(cat.id ?? cat._id),
    name:        text(cat.name ?? cat.title, "Category"),
    description: text(cat.description, ""),
  }));

  const total       = normalizedCategories.length;
  const withDesc    = normalizedCategories.filter((c) => c.description && c.description !== "N/A" && c.description.trim() !== "").length;
  const withoutDesc = total - withDesc;

  const statCards = [
    { icon: LayoutGrid, label: "Total Categories", value: total,       sub: "All subject categories",    iconBg: "bg-primary/10",                          iconColor: "text-primary",                         bar: "bg-primary",     barW: "100%" },
    { icon: BookOpen,   label: "With Description", value: withDesc,    sub: "Categories have details",   iconBg: "bg-emerald-100 dark:bg-emerald-900/30",   iconColor: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", barW: total > 0 ? `${Math.round((withDesc    / total) * 100)}%` : "0%" },
    { icon: Layers,     label: "Without Desc",     value: withoutDesc, sub: "No description added",      iconBg: "bg-amber-100 dark:bg-amber-900/30",       iconColor: "text-amber-600 dark:text-amber-400",   bar: "bg-amber-500",   barW: total > 0 ? `${Math.round((withoutDesc / total) * 100)}%` : "0%" },
    { icon: Tags,       label: "Active",           value: total,       sub: "All categories are active", iconBg: "bg-violet-100 dark:bg-violet-900/30",     iconColor: "text-violet-600 dark:text-violet-400", bar: "bg-violet-500",  barW: "100%" },
  ];

  return (
    <div className="space-y-6">

      
      <div>
        <h1 className="text-2xl font-black tracking-tight">Category &amp; Subjects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage tutoring subject categories on the platform
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

      
      <CategoriesManager initialCategories={normalizedCategories} />
    </div>
  );
}
