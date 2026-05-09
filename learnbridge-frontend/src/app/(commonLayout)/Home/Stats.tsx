import { BookOpen, Star, Users, TrendingUp } from "lucide-react";

const stats = [
  { label: "Active Students", value: "10K+", icon: Users, color: "text-indigo-600" },
  { label: "Expert Tutors", value: "120+", icon: BookOpen, color: "text-violet-600" },
  { label: "Sessions Booked", value: "500+", icon: TrendingUp, color: "text-blue-600" },
  { label: "Success Rate", value: "95%", icon: Star, color: "text-amber-500" },
];

export default function Stats() {
  return (
    <section className="border-y bg-white py-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 rounded-2xl border bg-background p-6 text-center shadow-sm"
              >
                <div className={`rounded-xl bg-primary/10 p-3`}>
                  <Icon className={`size-6 ${item.color}`} />
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight">{item.value}</h3>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
