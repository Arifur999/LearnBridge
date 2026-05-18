import { redirect } from "next/navigation";
import { getCurrentUserFromServer } from "@/lib/auth";
import CheckoutContent from "./CheckoutContent";

export default async function CheckoutPage() {
  const user = await getCurrentUserFromServer();

  if (!user) {
    redirect("/login?returnUrl=/tutors");
  }

  return <CheckoutContent />;
}
