import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import logo from "../../../../public/logo.png";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("border-t bg-slate-950 text-slate-300", className)}>
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Top grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand col — spans 2 */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center">
              <Image
                src={logo}
                alt="SkillBridge"
                width={130}
                height={55}
                priority
                className="brightness-200 contrast-75"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              SkillBridge connects students with verified expert tutors for instant booking,
              honest reviews, and focused 1-on-1 learning sessions.
            </p>

            {/* Contact mini */}
            <ul className="mt-6 space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-indigo-400" />
                support@skillbridge.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-indigo-400" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-indigo-400" />
                San Francisco, CA 94102
              </li>
            </ul>

            {/* Socials */}
            <div className="mt-6 flex gap-3">
              {[
                { label: "X / Twitter", href: "#", svg: <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                { label: "LinkedIn", href: "#", svg: <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                { label: "GitHub", href: "#", svg: <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg> },
                { label: "YouTube", href: "#", svg: <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
              ].map(({ label, href, svg }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition hover:bg-indigo-600 hover:text-white"
                >
                  {svg}
                </Link>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-200">
              Platform
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { text: "Browse Tutors", url: "/tutors" },
                { text: "Become a Tutor", url: "/register" },
                { text: "About Us", url: "/about" },
                { text: "FAQ", url: "/faq" },
                { text: "Contact", url: "/contact" },
                { text: "Privacy Policy", url: "/privacy" },
                { text: "Terms of Service", url: "/terms" },
              ].map((link) => (
                <li key={link.text}>
                  <Link
                    href={link.url}
                    className="transition-colors hover:text-indigo-400"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-200">
              Dashboards
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { text: "Student Dashboard", url: "/student" },
                { text: "Student Bookings", url: "/student/bookings" },
                { text: "Tutor Dashboard", url: "/tutor/dashboard" },
                { text: "Tutor Availability", url: "/tutor/availability" },
                { text: "Admin Panel", url: "/admin" },
                { text: "Admin Users", url: "/admin/users" },
              ].map((link) => (
                <li key={link.text}>
                  <Link
                    href={link.url}
                    className="transition-colors hover:text-indigo-400"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-200">
              Account
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { text: "Login", url: "/login" },
                { text: "Sign Up", url: "/register" },
                { text: "Tutor Profile", url: "/tutor/profile" },
              ].map((link) => (
                <li key={link.text}>
                  <Link
                    href={link.url}
                    className="transition-colors hover:text-indigo-400"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter blurb */}
            <div className="mt-8 rounded-xl bg-slate-900 p-4">
              <p className="mb-1 text-xs font-semibold text-slate-200">Stay updated</p>
              <p className="text-xs text-slate-500">
                New tutors, subjects, and features — delivered to your inbox.
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-block rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
              >
                Subscribe →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/faq" className="transition hover:text-indigo-400">
              FAQ
            </Link>
            <Link href="/privacy" className="transition hover:text-indigo-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-indigo-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
