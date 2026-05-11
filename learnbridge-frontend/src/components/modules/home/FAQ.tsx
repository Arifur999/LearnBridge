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
      "Use our filter tools to search by subject, category, hourly rate, and availability. Read verified reviews from other students to make an informed choice.",
  },
  {
    question: "How does the booking process work?",
    answer:
      "Choose a tutor, select an available time slot, complete the payment, and receive instant booking confirmation via email.",
  },
  {
    question: "Can I cancel or reschedule a session?",
    answer:
      "Yes. You can cancel or reschedule a session up to 24 hours before the scheduled time from your student dashboard.",
  },
  {
    question: "Are tutors vetted before joining?",
    answer:
      "Absolutely. Every tutor goes through a thorough verification process including background checks, credential reviews, and trial sessions.",
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
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:items-start">
          {/* Left sticky header */}
          <div className="lg:sticky lg:top-24">
            <SectionHeader
              label="FAQ"
              title="Frequently Asked Questions"
              description="Everything you need to know about LearnBridge."
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Still have questions?{" "}
              <a
                href="mailto:support@learnbridge.com"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Email our support team
              </a>{" "}
              — we respond within 24 hours.
            </p>
          </div>

          {/* Right accordion */}
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border bg-background px-5 shadow-sm hover:shadow-md transition-shadow data-[state=open]:shadow-md"
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
