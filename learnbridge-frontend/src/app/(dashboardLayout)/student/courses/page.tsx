import { redirect } from "next/navigation";

export default function StudentCoursesRedirectPage() {
  redirect("/tutors");
}
