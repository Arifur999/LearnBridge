import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { SignupForm } from "@/components/signup-form";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">

      {/* Full-screen background image */}
      <Image
        src="/front-view-academic-cap-with-books-pencils_23-2148756619.jpg"
        alt="Learning environment"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
      />

      {/* Overlay layers */}
      <div className="absolute inset-0 bg-zinc-950/60" />
      <div className="absolute inset-0 bg-linear-to-r from-zinc-950/85 via-zinc-950/45 to-zinc-950/65" />

      {/* Page grid */}
      <div className="relative flex min-h-screen flex-col lg:flex-row">

        {/* ── Left — brand hero ─────────────────────────── */}
        <div className="flex flex-1 flex-col justify-between p-8 sm:p-12 lg:p-16 lg:pb-20">

          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-lg">
              <BookOpen className="size-[18px] text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">LearnBridge</span>
          </Link>

          {/* Hero text — hidden on small screens */}
          <div className="hidden lg:block">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-primary/80">
              Start your journey
            </p>
            <h1 className="mb-5 text-6xl font-black uppercase leading-[0.92] tracking-tight text-white xl:text-7xl">
              GROW<br />WITHOUT<br />LIMITS
            </h1>
            <p className="max-w-xs text-base leading-relaxed text-white/65">
              Connect with expert tutors, track your progress, and unlock your full potential with personalised sessions.
            </p>

            {/* Feature list */}
            <div className="mt-12 flex flex-col gap-4">
              {[
                { icon: "✦", text: "Access 120+ verified expert tutors" },
                { icon: "✦", text: "Book sessions at your own pace" },
                { icon: "✦", text: "Learn any subject, any time" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="text-primary">{icon}</span>
                  <span className="text-sm text-white/65">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom note */}
          <p className="hidden text-xs text-white/30 lg:block">
            © {new Date().getFullYear()} LearnBridge. All rights reserved.
          </p>
        </div>

        {/* ── Right — glass form panel ───────────────────── */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:w-[480px] lg:shrink-0">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
