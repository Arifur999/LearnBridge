import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative isolate overflow-hidden border bg-zinc-950 px-6 py-20 text-center text-white shadow-2xl sm:px-8">
          <Image
            src="/graduation-cap-with-earth-globe-concept-global-business-study-abroad-educational-back-school-education-global-world-study-abroad-business-universities-worldwide-language-study_721781-2163.jpg"
            alt="Books and graduation cap prepared for study"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-zinc-950/72" />
          <div className="absolute inset-0 bg-linear-to-r from-zinc-950/92 via-zinc-950/62 to-zinc-950/80" />
          <div className="relative">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100">
              Start Today
            </p>
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              Bring one question. Leave with a clearer next step.
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-base leading-7 text-white/80 md:text-lg">
              Browse tutors, compare courses, and start with the learning support that fits where you are now.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="min-w-[160px] font-semibold"
              >
                <Link href="/register">
                  Get Started <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="min-w-[160px] border-white/30 bg-transparent text-white hover:bg-white/10"
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
