import Image from "next/image";
import { ShieldCheck, Clock } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function GlobalVisionaries() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[420px]">
            <div className="relative row-span-2 overflow-hidden rounded-2xl">
              <Image
                src="/education-learn-study-world-graduated-student-studying-abroad-international-idea_488220-56721.jpg"
                alt="An open book and globe prepared for study"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950/70 via-transparent to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-5 text-sm font-medium leading-6 text-white">
                Courses for structure, tutors for the moments you need a real answer.
              </p>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-primary p-6">
              <div className="text-center text-primary-foreground">
                <div className="text-3xl font-bold">500+</div>
                <div className="mt-1 text-sm opacity-80">Tutor profiles</div>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-2xl border bg-background p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">1:1</div>
                <div className="mt-1 text-sm text-muted-foreground">Focused sessions</div>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div>
            <SectionHeader
              label="Learning Support"
              title="Use the platform the way you actually study"
              description="Some days you need a course to follow. Other days you need a tutor to explain one stubborn idea."
            />
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Profiles before promises</h3>
                  <p className="text-sm text-muted-foreground">
                    See the tutor, subjects, rate, and reviews before you spend time on a booking.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Fit learning around life</h3>
                  <p className="text-sm text-muted-foreground">
                    Use availability slots and course browsing to keep moving without forcing one rigid path.
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
