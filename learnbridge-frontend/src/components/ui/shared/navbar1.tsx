"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
  title: string;
  url: string;
}

interface NavbarProps {
  className?: string;
}

const menu: MenuItem[] = [
  { title: "Home", url: "/" },
  { title: "Courses", url: "/courses" },
  { title: "Pricing", url: "/pricing" },
  { title: "Blog", url: "/blog" },
];

const Navbar = ({ className }: NavbarProps) => {
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
            Learn<span className="text-primary">Bridge</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 lg:flex">
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

        {/* Auth Buttons (Desktop) */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Sign up</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80 px-6">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="text-lg font-extrabold">
                    Learn<span className="text-primary">Bridge</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 flex flex-col gap-6">
                {menu.map((item) => (
                  <Link
                    key={item.title}
                    href={item.url}
                    className="text-base font-medium"
                  >
                    {item.title}
                  </Link>
                ))}

                <div className="mt-6 flex flex-col gap-3">
                  <Button asChild variant="outline">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Sign up</Link>
                  </Button>
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
