import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";

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
          {/* Brand col spans 2 */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center">
              <Image
                src={logo}
                alt="LearnBridge"
                width={130}
                height={55}
                priority
                className="brightness-200 contrast-75"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              LearnBridge helps students move between focused tutoring sessions and structured courses without losing the thread.
            </p>

            {/* Contact mini */}
            <ul className="mt-6 space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-indigo-400" />
                support@learnbridge.com
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/tutors"
                className="inline-flex items-center gap-2 border border-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-400 hover:text-white"
              >
                Browse tutors <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 border border-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-400 hover:text-white"
              >
                Explore courses
              </Link>
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
                New tutors, subjects, and features delivered to your inbox.
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-block rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} LearnBridge. All rights reserved.</p>
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
