import { getAdminCoursesAction } from "@/actions/dashboard.action";
import AdminCoursesClient from "./AdminCoursesClient";

export default async function AdminCoursesPage() {
  const courses = await getAdminCoursesAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Course Approvals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review, approve or reject courses submitted by tutors
        </p>
      </div>
      <AdminCoursesClient initialCourses={courses as unknown as AdminCourse[]} />
    </div>
  );
}

export interface AdminCourse {
  id: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  image?: string | null;
  status: string;
  createdAt?: string;
  trainer?: { id: string; name: string; email: string };
  _count?: { enrollments: number };
}
