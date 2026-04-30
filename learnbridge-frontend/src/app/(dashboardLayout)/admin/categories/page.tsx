import { getCategories } from "@/actions/course.action";

const text = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">Manage tutoring subject categories.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No categories found.
          </div>
        ) : (
          categories.map((category) => (
            <div key={text(category.id ?? category._id)} className="rounded-lg border p-4">
              <p className="font-medium">{text(category.name ?? category.title, "Category")}</p>
              <p className="text-sm text-muted-foreground">
                {text(category.description, "Tutor subject category")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
