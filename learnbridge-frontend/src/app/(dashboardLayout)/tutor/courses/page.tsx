import DashPageHeader from "@/components/layout/DashPageHeader";
import { getTutorCoursesAction } from "@/actions/tutor.action";
import TutorCoursesClient from "./TutorCoursesClient";

export default async function TutorCoursesPage() {
  const courses = await getTutorCoursesAction();
  const list = Array.isArray(courses) ? courses : [];

  return (
    <div className="space-y-6">
      <DashPageHeader
        title="My Courses"
        description="Create and manage your courses."
      />
      <TutorCoursesClient initialCourses={list} />
    </div>
  );
}
