import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          label="Testimonials"
          title="Small wins learners remember"
          description="The useful moments are often simple: a clear answer, a better example, or a slot that fits the week."
          centered
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="border-border/80 bg-card/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg dark:bg-card"
            >
              <CardContent className="p-6">
                <StarRating rating={t.rating} />
                <p className="mt-4 min-h-24 text-sm leading-7 text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {getInitials(t.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
