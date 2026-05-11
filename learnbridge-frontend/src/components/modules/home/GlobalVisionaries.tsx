import { ShieldCheck, Clock } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function GlobalVisionaries() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left bento grid */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[420px]">
            <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground mt-1">Expert Tutors</div>
              </div>
            </div>
            <div className="rounded-2xl bg-primary flex items-center justify-center p-6">
              <div className="text-center text-primary-foreground">
                <div className="text-3xl font-bold">20+</div>
                <div className="text-sm mt-1 opacity-80">Partner Institutes</div>
              </div>
            </div>
            <div className="rounded-2xl bg-foreground flex items-center justify-center p-6">
              <p className="text-center text-background text-sm italic leading-relaxed">
                &ldquo;Bridging the gap between theory and global industry mastery.&rdquo;
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-900/30 dark:to-violet-800/20 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-violet-600 dark:text-violet-400">24</div>
                <div className="text-sm text-muted-foreground mt-1">Timezones</div>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div>
            <SectionHeader
              label="World Class"
              title="Master Classes with Global Visionaries"
              description="Learn from industry veterans, designers, and researchers who are actively shaping their fields."
            />
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Rigorous Vetting</h3>
                  <p className="text-sm text-muted-foreground">
                    Only the top 3% of applicants are selected to teach. Every tutor is screened for expertise, communication, and teaching ability.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Global Availability</h3>
                  <p className="text-sm text-muted-foreground">
                    Access world-class knowledge across 24 different timezones — schedule sessions whenever works best for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
