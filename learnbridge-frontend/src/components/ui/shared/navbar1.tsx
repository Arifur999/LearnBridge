"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  role: "admin" | "trainer" | "tutor" | "student";
}

interface MenuItem {
  title: string;
  url: string;
}

const menu: MenuItem[] = [
  { title: "Home", url: "/" },
  { title: "Tutors", url: "/tutors" },
  { title: "Login", url: "/login" },
];

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
    if (userProp) {
      return;
    }
    if (user) {
      return;
    }

    const loadFromServer = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.user) {
          setUser(data.user as User);
        }
      } catch {
        // ignore
      }
    };

    loadFromServer();
  }, [user, userProp]);

  let dashboardUrl = "/dashboard"; 

  if (user?.role === "admin") {
    dashboardUrl = "/admin";
  } else if (user?.role === "trainer" || user?.role === "tutor") {
    dashboardUrl = "/tutor/dashboard";
  } else if (user?.role === "student") {
    dashboardUrl = "/student";
  }

  const handleLogout = () => {
    authService.logout(); 
    setUser(null);
    window.location.href = "/login"; 
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight">
            <Image height={70} width={120} src={logo} alt="LearnBridge" className="object-contain" />
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {menu.map((item) => (
            <Link key={item.title} href={item.url} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
          
              <Button asChild size="sm" variant="default">
                <Link href={dashboardUrl} className="flex items-center gap-2">
                  <LayoutDashboard className="size-4" />
                  {user.role === "admin" ? "Admin Panel" : user.role === "trainer" || user.role === "tutor" ? "Tutor Board" : "Student Dashboard"}
                </Link>
              </Button>
              
              <Button size="sm" variant="outline" onClick={handleLogout}>
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link href="/login">Login</Link></Button>
              <Button asChild size="sm"><Link href="/register">Sign up</Link></Button>
            </>
          )}
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="size-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 px-6">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/"><Image height={70} width={120} src={logo} alt="LearnBridge" /></Link>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-6">
                {menu.map((item) => (
                  <Link key={item.title} href={item.url} className="text-base font-medium">{item.title}</Link>
                ))}
                
                <div className="mt-6 flex flex-col gap-3">
                  {user ? (
                    <>
                      <Button asChild className="w-full">
                        <Link href={dashboardUrl}>
                            <LayoutDashboard className="mr-2 size-4"/> 
                            {user.role === "admin" ? "Admin Panel" : user.role === "trainer" || user.role === "tutor" ? "Tutor Board" : "Dashboard"}
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" onClick={handleLogout}>
                        <LogOut className="mr-2 size-4" /> Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline"><Link href="/login">Login</Link></Button>
                      <Button asChild><Link href="/register">Sign up</Link></Button>
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
