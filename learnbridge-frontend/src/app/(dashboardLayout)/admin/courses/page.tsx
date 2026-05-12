import DashPageHeader from "@/components/layout/DashPageHeader";
import { getAdminCoursesAction } from "@/actions/dashboard.action";
import AdminCoursesClient from "./AdminCoursesClient";

export default async function AdminCoursesPage() {
  const courses = await getAdminCoursesAction();

  return (
    <div className="space-y-6">
      <DashPageHeader
        title="Course Approvals"
        description="Review, approve or reject courses submitted by tutors."
      />
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
