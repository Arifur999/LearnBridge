import { Search, Calendar, BookOpen } from "lucide-react";
import SectionHeader from "./SectionHeader";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find Your Tutor",
    description:
      "Browse and filter tutors by subject, rating, price, and availability. Read reviews from other students.",
    color: "bg-primary/10 text-primary",
  },
  {
    number: "02",
    icon: Calendar,
    title: "Book a Session",
    description:
      "Select an available time slot that fits your schedule. Get instant booking confirmation.",
    color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Start Learning",
    description:
      "Attend your session and gain practical skills. Leave a review to help other students.",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          label="How It Works"
          title="Get Started in 3 Simple Steps"
          description="Finding the right tutor and booking a session has never been easier."
          centered
        />

        <div className="relative grid gap-8 md:grid-cols-3">
          {steps.map(({ number, icon: Icon, title, description, color }, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div
                  className={`flex size-20 items-center justify-center rounded-2xl ${color} shadow-sm`}
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
