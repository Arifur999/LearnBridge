import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import logo from "../../../../public/logo.png";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  const menuItems: MenuItem[] = [
    {
      title: "Platform",
      links: [
        { text: "Browse Tutors", url: "/tutors" },
        { text: "Become a Student", url: "/register" },
        { text: "Become a Tutor", url: "/register" },
      ],
    },
    {
      title: "Dashboard",
      links: [
        { text: "Student", url: "/student" },
        { text: "Tutor", url: "/tutor/dashboard" },
        { text: "Admin", url: "/admin" },
      ],
    },
  ];

  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center">
              <Image
                src={logo}
                alt="SkillBridge logo"
                width={130}
                height={60}
                priority
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              SkillBridge connects students with verified expert tutors for
              instant booking, reviews, and focused learning sessions.
            </p>
          </div>

          {menuItems.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase text-foreground">
                {section.title}
              </h3>

              <ul className="space-y-3 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.url}
                      className="transition-colors hover:text-primary"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} SkillBridge. All rights reserved.</p>

          <div className="flex gap-6">
            <Link href="#" className="transition hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="transition hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
