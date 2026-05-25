import { getTutorCoursesAction } from "@/actions/tutor.action";
import TutorCoursesClient from "./TutorCoursesClient";

export default async function TutorCoursesPage() {
  const courses = await getTutorCoursesAction();
  const list = Array.isArray(courses) ? courses : [];

  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-2xl font-black tracking-tight">My Courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create, manage and track all your published courses
        </p>
      </div>
      <TutorCoursesClient initialCourses={list} />
    </div>
  );
}
