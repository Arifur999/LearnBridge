import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SectionHeader from "./SectionHeader";
import { getInitials } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Learning Python",
    rating: 5,
    quote:
      "I used a session after getting stuck on Python loops for days. The explanation was calm, specific, and I could finish the exercise that night.",
  },
  {
    name: "Marcus Lee",
    role: "Data science student",
    rating: 5,
    quote:
      "The tutor did not rush through formulas. We worked through one example slowly and that helped the next chapter make sense.",
  },
  {
    name: "Priya Sharma",
    role: "Design learner",
    rating: 5,
    quote:
      "I liked being able to read the profile first and book only when I knew what feedback I needed on my design work.",
  },
  {
    name: "James Carter",
    role: "Upskilling after work",
    rating: 4,
    quote:
      "The evening slots made it realistic for me. We kept each session focused on a small analytics question instead of covering too much.",
  },
  {
    name: "Aisha Okafor",
    role: "School student",
    rating: 5,
    quote:
      "I asked the questions I usually skip in class. That changed how confident I felt before the next test.",
  },
  {
    name: "Tom Williams",
    role: "Business basics",
    rating: 5,
    quote:
      "A finance tutor helped me separate the terms I kept mixing up. It was practical and easy to revisit afterward.",
  },
];

const cardStyles = [
  { from: "from-primary/5",     avatar: "bg-primary/15 text-primary" },
  { from: "from-violet-500/5",  avatar: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  { from: "from-emerald-500/5", avatar: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { from: "from-amber-500/5",   avatar: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  { from: "from-cyan-500/5",    avatar: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  { from: "from-rose-500/5",    avatar: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted-foreground/20 text-muted-foreground/20"
          }`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          label="Testimonials"
          title="Small wins learners remember"
          description="The useful moments are often simple: a clear answer, a better example, or a slot that fits the week."
          centered
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => {
            const style = cardStyles[i];
            return (
              <div
                key={t.name}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-linear-to-br ${style.from} to-transparent p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg`}
              >
                {/* Decorative large quote mark */}
                <span className="pointer-events-none absolute right-5 top-3 select-none font-serif text-8xl leading-none text-foreground/[0.04]">
                  &ldquo;
                </span>

                <StarRating rating={t.rating} />

                <p className="relative mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-4">
                  <Avatar className="size-9 shrink-0">
                    <AvatarFallback className={`text-xs font-semibold ${style.avatar}`}>
                      {getInitials(t.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
