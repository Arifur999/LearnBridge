import Image from "next/image";
import { ShieldCheck, Clock, MessageCircle, Users } from "lucide-react";
import SectionHeader from "./SectionHeader";

const features = [
  {
    icon: ShieldCheck,
    title: "Profiles before promises",
    description:
      "See the tutor, subjects, rate, and reviews before you spend time on a booking.",
  },
  {
    icon: Clock,
    title: "Fit learning around life",
    description:
      "Use availability slots and course browsing to keep moving without forcing one rigid path.",
  },
  {
    icon: MessageCircle,
    title: "Sessions that stay focused",
    description:
      "Every 1-on-1 session is built around your specific question, not a general curriculum.",
  },
];

export default function GlobalVisionaries() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left image grid */}
          <div className="grid h-[440px] grid-cols-2 grid-rows-2 gap-4">
            <div className="relative row-span-2 overflow-hidden rounded-2xl">
              <Image
                src="/education-learn-study-world-graduated-student-studying-abroad-international-idea_488220-56721.jpg"
                alt="Student studying with globe and books"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-5 text-sm font-medium leading-6 text-white">
                Courses for structure, tutors for the moments you need a real
                answer.
              </p>
            </div>

            {/* Stat tile 1 */}
            <div className="relative overflow-hidden rounded-2xl bg-primary p-6">
              <div className="absolute -bottom-4 -right-4 size-24 rounded-full bg-white/10" />
              <Users className="mb-3 size-5 text-primary-foreground/70" />
              <div className="text-3xl font-black text-primary-foreground">500+</div>
              <div className="mt-1 text-sm font-medium text-primary-foreground/75">
                Tutor profiles
              </div>
            </div>

            {/* Stat tile 2 */}
            <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border bg-background p-6">
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/8 to-transparent" />
              <div className="text-center">
                <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                  1:1
                </div>
                <div className="mt-1 text-sm font-medium text-muted-foreground">
                  Focused sessions
                </div>
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
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
