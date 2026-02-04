import { Footer } from "@/components/ui/shared/footer2";
import { Navbar } from "@/components/ui/shared/navbar1";
import { getCurrentUserFromServer } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserFromServer();
  console.log("SERVER USER", user);

  return (
    <>
      <Navbar user={user} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
