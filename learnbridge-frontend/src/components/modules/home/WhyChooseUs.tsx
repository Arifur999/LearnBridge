import { UserCheck, Briefcase, Calendar, Target } from "lucide-react";
import SectionHeader from "./SectionHeader";

const features = [
  {
    icon: UserCheck,
    title: "Tailored Study Paths",
    description: "Personalized learning journeys designed to meet your specific goals.",
  },
  {
    icon: Briefcase,
    title: "Top 3% Professionals",
    description: "All tutors are vetted industry experts with proven track records.",
  },
  {
    icon: Calendar,
    title: "Any Timezone",
    description: "Book sessions that fit your schedule, anywhere in the world.",
  },
  {
    icon: Target,
    title: "Practical Skills",
    description: "Focus on real-world skills that accelerate your career growth.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left image */}
          <div className="relative h-80 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-xl lg:h-[480px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="mb-4 text-6xl font-bold text-primary">3%</div>
                <p className="text-lg font-semibold text-foreground">
                  Only the top 3% of tutor applicants are selected
                </p>
                <p className="mt-2 text-muted-foreground">
                  Rigorous vetting ensures you learn from the best
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/10 to-transparent" />
          </div>

          {/* Right content */}
          <div>
            <SectionHeader
              label="Our Advantage"
              title="Why Students Choose LearnBridge"
              description="We combine top-tier tutors with a seamless booking experience to deliver results."
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
