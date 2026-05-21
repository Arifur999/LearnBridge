import Image from "next/image";
import { UserCheck, Briefcase, Calendar, Target } from "lucide-react";
import SectionHeader from "./SectionHeader";

const features = [
  {
    icon: UserCheck,
    title: "Tutors with context",
    description: "Profiles, subjects, rates, and reviews help you choose with fewer guesses.",
  },
  {
    icon: Briefcase,
    title: "Focused sessions",
    description: "Use a live session when a course or video leaves a question hanging.",
  },
  {
    icon: Calendar,
    title: "Flexible booking",
    description: "See available slots and book around your actual week.",
  },
  {
    icon: Target,
    title: "Courses beside tutoring",
    description: "Move between structured courses and one-to-one help when you need both.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative min-h-80 overflow-hidden rounded-2xl shadow-xl lg:min-h-[480px]">
            <Image
              src="/book-with-green-board-background_1150-3837.jpg"
              alt="Books and study tools ready for a learning session"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950/82 via-zinc-950/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Learning in practice
              </p>
              <p className="mt-3 max-w-sm text-2xl font-semibold leading-tight">
                A short session can unblock a week of studying.
              </p>
            </div>
          </div>

          {/* Right content */}
          <div>
            <SectionHeader
              label="Our Advantage"
              title="The parts that make learning feel manageable"
              description="LearnBridge is useful when you want enough structure to move forward and enough human help to get unstuck."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-xl border bg-background p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mb-1 font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
