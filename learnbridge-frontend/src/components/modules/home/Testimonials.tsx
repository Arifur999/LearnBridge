import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import SectionHeader from "./SectionHeader";
import { getInitials } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    rating: 5,
    quote:
      "LearnBridge matched me with the perfect Python tutor. Within 3 months I landed my first dev job. The quality of tutors is truly exceptional.",
  },
  {
    name: "Marcus Lee",
    role: "Data Science Student",
    rating: 5,
    quote:
      "Having access to industry experts at any time feels like having senior dev mentorship on demand — absolutely invaluable.",
  },
  {
    name: "Priya Sharma",
    role: "UX Designer",
    rating: 5,
    quote:
      "The booking process is seamless and the tutors are incredibly knowledgeable. I improved my design skills dramatically in just weeks.",
  },
  {
    name: "James Carter",
    role: "Marketing Manager",
    rating: 4,
    quote:
      "I booked sessions to learn data analytics and the tutor tailored every session to my pace. Highly recommend to any professional upskilling.",
  },
  {
    name: "Aisha Okafor",
    role: "High School Student",
    rating: 5,
    quote:
      "My SAT scores went up 200 points after just 8 sessions. The tutors here are patient, knowledgeable, and genuinely care about your progress.",
  },
  {
    name: "Tom Williams",
    role: "Startup Founder",
    rating: 5,
    quote:
      "Found a brilliant finance tutor who helped me understand startup accounting. Worth every penny and more.",
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
          title="What Our Students Say"
          description="Real feedback from learners who transformed their skills on LearnBridge."
          centered
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <StarRating rating={t.rating} />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
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
