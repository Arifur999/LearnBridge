import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-8 py-20 text-center shadow-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground/80">
            Start Today
          </p>
          <h2 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl">
            Learn at your own{" "}
            <span className="italic text-white/90">convenience</span>
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-primary-foreground/80">
            Join thousands of students learning from expert tutors. Book your
            first session today — no commitment required.
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
    </section>
  );
}
