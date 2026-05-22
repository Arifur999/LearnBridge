import { Search, Calendar, BookOpen } from "lucide-react";
import SectionHeader from "./SectionHeader";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Choose a tutor",
    description:
      "Filter by subject, rate, and profile details until someone feels right for the question you have.",
    color: "bg-primary/10 text-primary",
  },
  {
    number: "02",
    icon: Calendar,
    title: "Pick a slot",
    description:
      "Choose a time that fits your schedule and keep the booking details in one place.",
    color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Learn and follow up",
    description:
      "Use the session, course material, and reviews to shape what comes next.",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          label="How It Works"
          title="From question to session"
          description="The flow is simple, but the choice stays yours."
          centered
        />

        <div className="relative grid gap-8 md:grid-cols-3">
          <div className="absolute top-10 left-[16.667%] right-[16.667%] hidden h-px bg-border md:block" />

          {steps.map(({ number, icon: Icon, title, description, color }, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="relative mb-6 z-10">
                <div
                  className={`flex size-20 items-center justify-center rounded-2xl ${color} shadow-sm ring-4 ring-background`}
                >
                  <Icon className="size-9" />
                </div>
                <span className="absolute -top-3 -right-3 flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow">
                  {number}
                </span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
