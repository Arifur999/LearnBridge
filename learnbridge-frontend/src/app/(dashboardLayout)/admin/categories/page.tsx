import { getCategories } from "@/actions/dashboard.action";
import CategoriesManager from "./CategoriesManager";

const text = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  const normalizedCategories = categories.map((cat) => ({
    id: text(cat.id ?? cat._id),
    name: text(cat.name ?? cat.title, "Category"),
    description: text(cat.description, ""),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">
          Manage tutoring subject categories on the platform.
        </p>
      </div>
      <CategoriesManager initialCategories={normalizedCategories} />
    </div>
  );
}
