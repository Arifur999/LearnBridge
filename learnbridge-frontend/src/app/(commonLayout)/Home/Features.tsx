import { BookOpen, Users, Clock, Shield, Star, Zap } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Expert Tutors",
    desc: "Learn from verified subject specialists with real-world experience.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Users,
    title: "Verified Profiles",
    desc: "Every tutor is reviewed and moderated by our admin team.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Clock,
    title: "Instant Booking",
    desc: "Choose a time slot and get a confirmed session in seconds.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Star,
    title: "Honest Reviews",
    desc: "Read real ratings and feedback from verified students.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Zap,
    title: "1-on-1 Sessions",
    desc: "Focused learning with dedicated attention just for you.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    desc: "Your personal data and sessions are fully protected.",
    color: "bg-rose-50 text-rose-600",
  },
];

export default function Features() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Why Choose Us
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">Why SkillBridge?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            We make it easy to connect with the right expert and build skills that matter.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-2xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className={`mb-4 inline-flex rounded-xl p-3 ${f.color}`}>
                  <Icon className="size-6" />
                </div>
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
