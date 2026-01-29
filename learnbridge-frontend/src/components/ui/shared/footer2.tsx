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
        { text: "Browse Courses", url: "/courses" },
        { text: "Become a Student", url: "/register" },
        { text: "Become a Trainer", url: "/register" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About Us", url: "#" },
        { text: "Contact", url: "#" },
        { text: "Careers", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Help Center", url: "#" },
        { text: "Blog", url: "#" },
        { text: "Community", url: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { text: "Privacy Policy", url: "#" },
        { text: "Terms & Conditions", url: "#" },
      ],
    },
  ];

  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="mx-auto max-w-7xl px-4 py-20">
        {/* Top Section */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center">
              <Image
                src={logo}
                alt="LearnBridge logo"
                width={130}
                height={60}
                priority
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              LearnBridge is a modern learning platform connecting students
              with verified trainers to build real-world skills.
            </p>
          </div>

          {/* Menu Sections */}
          {menuItems.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
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

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} LearnBridge. All rights reserved.
          </p>

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
