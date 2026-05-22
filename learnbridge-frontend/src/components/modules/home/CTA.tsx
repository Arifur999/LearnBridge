import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative isolate overflow-hidden rounded-3xl bg-zinc-950 px-6 py-24 text-center text-white shadow-2xl sm:px-12">
          <Image
            src="/graduation-cap-with-earth-globe-concept-global-business-study-abroad-educational-back-school-education-global-world-study-abroad-business-universities-worldwide-language-study_721781-2163.jpg"
            alt="Books and graduation cap prepared for study"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-zinc-950/78" />
          <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-transparent to-violet-900/15" />

          {/* Decorative rings */}
          <div className="absolute -right-24 -top-24 size-80 rounded-full border border-white/[0.06]" />
          <div className="absolute -right-12 -top-12 size-56 rounded-full border border-white/[0.06]" />
          <div className="absolute -bottom-24 -left-24 size-80 rounded-full border border-white/[0.06]" />
          <div className="absolute -bottom-12 -left-12 size-56 rounded-full border border-white/[0.06]" />

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-emerald-300 ring-1 ring-white/15 backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              Start Today
            </div>

            <h2 className="mb-5 text-4xl font-black leading-tight tracking-tight md:text-5xl">
              Bring one question.
              <br />
              <span className="text-primary">Leave with a clearer next step.</span>
            </h2>

            <p className="mx-auto mb-10 max-w-xl text-base leading-7 text-white/75 md:text-lg">
              Browse tutors, compare courses, and start with the learning
              support that fits where you are now.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="group min-w-[160px] bg-white font-semibold text-zinc-950 hover:bg-white/90"
              >
                <Link href="/register">
                  Get Started
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="min-w-[160px] border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              >
                <Link href="/tutors">Browse Tutors</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
