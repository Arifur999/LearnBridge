"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/layout/ModeToggle";
import logo from "../../../../public/logo.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authService } from "@/services/auth.service";

interface User {
  name: string;
  email: string;
  role: string;
}

interface MenuItem {
  title: string;
  url: string;
}

const menu: MenuItem[] = [
  { title: "Home", url: "/" },
  { title: "Tutors", url: "/tutors" },
  { title: "Courses", url: "/courses" },
  { title: "About", url: "/about" },
  { title: "FAQ", url: "/faq" },
];

function getDashboardUrl(role: string): string {
  const r = role.toLowerCase();
  if (r === "admin")                 return "/admin/analytics";
  if (r === "tutor" || r === "trainer") return "/tutor/dashboard";
  if (r === "institute")             return "/institute/dashboard";
  if (r === "mentor")                return "/mentor/dashboard";
  if (r === "moderator")             return "/moderator/dashboard";
  return "/dashboard";
}

function getDashboardLabel(role: string): string {
  const r = role.toLowerCase();
  if (r === "admin")                    return "Admin Panel";
  if (r === "tutor" || r === "trainer") return "Tutor Board";
  if (r === "institute")                return "Institute";
  if (r === "mentor")                   return "Mentor Panel";
  if (r === "moderator")                return "Moderation";
  return "Dashboard";
}

const Navbar = ({
  className,
  user: userProp,
}: {
  className?: string;
  user?: User | null;
}) => {
  const [user, setUser] = useState<User | null>(
    userProp ?? (authService.getCurrentUser() as User | null)
  );

  useEffect(() => {
    if (userProp || user) return;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.user) setUser(data.user as User); })
      .catch(() => {});
  }, [user, userProp]);

  const dashboardUrl = user ? getDashboardUrl(user.role) : "/dashboard";
  const dashboardLabel = user ? getDashboardLabel(user.role) : "Dashboard";

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image height={60} width={110} src={logo} alt="LearnBridge" className="object-contain" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {menu.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Desktop auth + theme */}
        <div className="hidden items-center gap-2 lg:flex">
          <ModeToggle />
          {user ? (
            <>
              <Button asChild size="sm" variant="default">
                <Link href={dashboardUrl} className="flex items-center gap-2">
                  <LayoutDashboard className="size-4" />
                  {dashboardLabel}
                </Link>
              </Button>
              <Button size="sm" variant="outline" onClick={handleLogout}>
                <LogOut className="size-4 mr-1.5" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 px-6">
              <SheetHeader>
                <SheetTitle asChild>
                  <Link href="/">
                    <Image height={60} width={110} src={logo} alt="LearnBridge" />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-5">
                {menu.map((item) => (
                  <Link key={item.title} href={item.url} className="text-base font-medium hover:text-primary transition-colors">
                    {item.title}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-3">
                  {user ? (
                    <>
                      <Button asChild className="w-full">
                        <Link href={dashboardUrl}>
                          <LayoutDashboard className="mr-2 size-4" />
                          {dashboardLabel}
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" onClick={handleLogout}>
                        <LogOut className="mr-2 size-4" /> Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/register">Sign up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export { Navbar };
