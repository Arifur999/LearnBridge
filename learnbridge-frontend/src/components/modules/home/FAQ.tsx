import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeader from "./SectionHeader";

const faqs = [
  {
    question: "How do I find the right tutor?",
    answer:
      "Start with the subject and price filters, then open profiles that feel close to your goal. Reviews and profile details help you narrow the choice.",
  },
  {
    question: "How does the booking process work?",
    answer:
      "Choose a tutor, pick an available slot, and confirm the booking from the flow shown on the profile.",
  },
  {
    question: "Can I cancel or reschedule a session?",
    answer:
      "You can manage bookings from your student dashboard. Check the booking details before changing a scheduled session.",
  },
  {
    question: "Are tutors vetted before joining?",
    answer:
      "Tutor profiles are reviewed by the platform team before they are highlighted for learners.",
  },
  {
    question: "Can I enroll in courses alongside 1-on-1 sessions?",
    answer:
      "Yes. LearnBridge offers both structured courses from institutes and personalized 1-on-1 tutor sessions. You can do both simultaneously.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "All payments are processed via Stripe. We never store your card details on our servers.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-muted/30 py-20 dark:bg-muted/15">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:items-start">
          {/* Left sticky header */}
          <div className="lg:sticky lg:top-24">
            <SectionHeader
              label="FAQ"
              title="Questions before you book"
              description="A few details that help you use LearnBridge with less back-and-forth."
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Still have questions?{" "}
              <a
                href="mailto:support@learnbridge.com"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Email our support team
              </a>{" "}
              and we will reply with the next step.
            </p>
          </div>

          {/* Right accordion */}
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-2xl border bg-background/90 px-5 shadow-sm transition-shadow hover:shadow-md data-[state=open]:border-primary/25 data-[state=open]:shadow-md dark:bg-card"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
