import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { getCurrentUserFromServer } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { User } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
  admin,
  tutor,
  student,
  institute,
  mentor,
  moderator,
}: {
  children: React.ReactNode;
  admin?: React.ReactNode;
  tutor?: React.ReactNode;
  student?: React.ReactNode;
  institute?: React.ReactNode;
  mentor?: React.ReactNode;
  moderator?: React.ReactNode;
}) {
  // Suppress unused-variable warnings — slots are required by Next.js for @-directories
  void admin; void tutor; void student; void institute; void mentor; void moderator;

  const user = await getCurrentUserFromServer();

  if (!user) {
    redirect("/login");
  }

  const sidebarUser: User = {
    id: user.id ?? "",
    name: user.name ?? "User",
    email: user.email ?? "",
    role: user.role ?? "student",
  };

  return (
    <SidebarProvider>
      <AppSidebar user={sidebarUser} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {user.name ?? "Dashboard"}
            </span>
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6 pt-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
