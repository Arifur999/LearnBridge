import { BookOpen, Users, Clock, Shield } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: BookOpen,
      title: "Industry Focused Courses",
      desc: "Learn skills companies actually need",
    },
    {
      icon: Users,
      title: "Verified Trainers",
      desc: "All trainers are admin approved",
    },
    {
      icon: Clock,
      title: "Learn Anytime",
      desc: "Self-paced learning experience",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      desc: "Your data is safe with us",
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h2 className="mb-12 text-3xl font-bold">Why LearnBridge?</h2>

        <div className="grid gap-8 md:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border p-6">
              <f.icon className="mx-auto mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
