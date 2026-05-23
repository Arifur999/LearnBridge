import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">

      {/* Full-screen background image */}
      <Image
        src="/front-view-stacked-books-earth-globe-with-graduation-cap-education-day_742418-47637.jpg"
        alt="Learning environment"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
      />

      {/* Overlay layers */}
      <div className="absolute inset-0 bg-zinc-950/55" />
      <div className="absolute inset-0 bg-linear-to-r from-zinc-950/80 via-zinc-950/40 to-zinc-950/70" />

      {/* Page grid */}
      <div className="relative flex min-h-screen flex-col lg:flex-row">

        {/* ── Left — brand hero ─────────────────────────── */}
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

          {/* Hero text — hidden on small screens */}
          <div className="hidden lg:block">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-primary/80">
              Your learning platform
            </p>
            <h1 className="mb-5 text-6xl font-black uppercase leading-[0.92] tracking-tight text-white xl:text-7xl">
              LEARN<br />BEYOND<br />LIMITS
            </h1>
            <p className="max-w-xs text-base leading-relaxed text-white/65">
              Where every subject has a tutor who makes it click. Book focused sessions and build real confidence.
            </p>

            {/* Stats row */}
            <div className="mt-12 flex gap-10">
              {[
                { value: "10K+", label: "Active students" },
                { value: "120+", label: "Expert tutors" },
                { value: "50+",  label: "Subjects" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="text-xs text-white/50">{label}</p>
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
        <div className="flex items-center justify-center p-6 sm:p-10 lg:w-[45%] lg:shrink-0">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
