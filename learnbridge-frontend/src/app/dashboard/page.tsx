import { getCurrentUserFromServer } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRedirectPage() {
  const user = await getCurrentUserFromServer();

  if (!user) redirect("/login");

  if (user.role === "admin") redirect("/admin");
  if (user.role === "trainer" || user.role === "tutor") {
    redirect("/tutor/dashboard");
  }

  redirect("/student");
}
