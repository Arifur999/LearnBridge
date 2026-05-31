import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SignupForm } from "@/components/signup-form";

const FEATURES = [
  "Access 120+ verified expert tutors",
  "Book sessions at your own schedule",
  "Learn any subject, any time",
  "Track your progress in real time",
];

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">

      {/* Full-screen background image */}
      <Image
        src="/education-learn-study-world-graduated-student-studying-abroad-international-idea_488220-56721.jpg"
        alt="Students learning"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
      />

      {/* Overlay layers — slightly darker so glass pops */}
      <div className="absolute inset-0 bg-zinc-950/65" />
      <div className="absolute inset-0 bg-linear-to-r from-zinc-950/90 via-zinc-950/50 to-zinc-950/60" />

      {/* Page grid */}
      <div className="relative flex min-h-screen flex-col lg:flex-row">

        
        <div className="flex flex-col justify-between p-8 sm:p-12 lg:w-[55%] lg:p-16 lg:pb-20">

          {/* Logo */}
          <Link href="/" className="inline-flex">
            <Image
              src="/logo.png"
              alt="LearnBridge"
              width={120}
              height={48}
              className="object-contain drop-shadow-lg"
            />
          </Link>

          {/* Hero text — desktop only */}
          <div className="hidden lg:block">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-primary/80">
              Start your journey today
            </p>
            <h1 className="mb-5 text-6xl font-black uppercase leading-[0.92] tracking-tight text-white xl:text-7xl">
              GROW<br />WITHOUT<br />LIMITS
            </h1>
            <p className="max-w-sm text-base leading-relaxed text-white/65">
              Connect with world-class tutors, master new skills, and unlock your full potential — one session at a time.
            </p>

            {/* Feature checklist */}
            <ul className="mt-12 flex flex-col gap-4">
              {FEATURES.map((feat) => (
                <li key={feat} className="flex items-center gap-3">
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  <span className="text-sm text-white/70">{feat}</span>
                </li>
              ))}
            </ul>

          </div>

          {/* Bottom note */}
          <p className="hidden text-xs text-white/30 lg:block">
            © {new Date().getFullYear()} LearnBridge. All rights reserved.
          </p>
        </div>

        
        <div className="flex items-center justify-center p-6 sm:p-10 lg:w-[45%] lg:shrink-0">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
