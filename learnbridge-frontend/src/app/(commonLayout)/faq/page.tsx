import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MessageCircleQuestion, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "For Students",
    color: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/45 dark:text-indigo-200 dark:border-indigo-900",
    items: [
      {
        q: "How do I book a session with a tutor?",
        a: "Simply browse our tutor listings, pick a tutor you like, select an available time slot, and confirm your booking. You'll receive a confirmation instantly.",
      },
      {
        q: "Can I cancel or reschedule a booking?",
        a: "Yes. You can cancel a booking from your Student Dashboard before the session starts. Rescheduling is done by cancelling and rebooking a new available slot.",
      },
      {
        q: "How do I leave a review for my tutor?",
        a: "After your session is marked as 'Completed', you'll be able to leave a star rating and written review from your bookings page.",
      },
      {
        q: "Is my payment information secure?",
        a: "Payments are handled through the platform payment flow. LearnBridge does not ask you to share card details in chat.",
      },
      {
        q: "How do I find a tutor for a specific subject?",
        a: "Use the search and filter tools on the Tutors page. You can filter by subject, hourly rate, and rating to find the perfect match.",
      },
    ],
  },
  {
    category: "For Tutors",
    color: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/45 dark:text-violet-200 dark:border-violet-900",
    items: [
      {
        q: "How do I become a tutor on LearnBridge?",
        a: "Register an account and select 'Tutor' as your role. Once your profile is reviewed and approved by our admin team, you can start creating availability slots and accepting bookings.",
      },
      {
        q: "How do I set my availability?",
        a: "From your Tutor Dashboard, go to 'Availability' and create time slots by specifying the date, start time, and end time. Students can then book these slots.",
      },
      {
        q: "How do I get paid?",
        a: "Earnings are processed automatically after a session is marked as completed. Funds are transferred to your linked bank account within 3–5 business days.",
      },
      {
        q: "Can I set my own hourly rate?",
        a: "Yes. You have full control over your hourly rate. Update it at any time from your profile settings in the Tutor Dashboard.",
      },
    ],
  },
  {
    category: "Platform & General",
    color: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/45 dark:text-blue-200 dark:border-blue-900",
    items: [
      {
        q: "Is LearnBridge free to join?",
        a: "Yes — signing up as a student or tutor is completely free. Students pay per session at the tutor's listed rate.",
      },
      {
        q: "What subjects are available?",
        a: "We cover a wide range of subjects including Mathematics, Science, Programming, Languages, Business, and more. New categories are added regularly.",
      },
      {
        q: "How are tutors verified?",
        a: "Every tutor profile is reviewed by our admin team before being made public. We check credentials, profile completeness, and platform guidelines compliance.",
      },
      {
        q: "How do I contact support?",
        a: "Visit our Contact page or email us at support@skillbridge.com. Our team responds within 24 hours on business days.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative isolate overflow-hidden border-b bg-slate-900 text-white">
        <Image
          src="/front-view-stacked-books-earth-globe-with-graduation-cap-education-day_742418-47637.jpg"
          alt="A globe and graduation cap above an open book"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-slate-950/64" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/55 to-slate-950/35" />

        <div className="relative mx-auto flex min-h-[48svh] max-w-5xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6">
          <div className="mb-5 flex size-14 items-center justify-center border border-white/35 bg-black/20 backdrop-blur-sm">
            <MessageCircleQuestion className="size-7 text-cyan-100" />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.26em] text-cyan-100">
            Help Center
          </p>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl">
            Answers before your next learning step
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
            Get quick guidance for booking, tutoring, payments, and account questions.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-cyan-100 text-slate-950 hover:bg-white">
              <Link href="#faq-answers">
                <Search className="size-4" />
                See answers
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact">Contact support</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/25">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-8 gap-y-3 px-4 py-5 text-sm font-medium text-muted-foreground">
          <p>Student bookings</p>
          <p>Tutor profiles</p>
          <p>Payments and reviews</p>
          <p>Platform support</p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section id="faq-answers" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-4xl px-4 space-y-14">
          {faqs.map((section) => (
            <div key={section.category}>
              <div className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold ${section.color}`}>
                <ChevronDown className="size-3.5" />
                {section.category}
              </div>

              <Accordion type="single" collapsible className="space-y-3">
                {section.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`${section.category}-${i}`}
                  className="border bg-card/90 px-5 shadow-sm data-[state=open]:border-primary/25 dark:bg-card"
                  >
                    <AccordionTrigger className="py-5 text-left text-sm font-semibold hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-lg border bg-background">
            <MessageCircleQuestion className="size-6 text-primary" />
          </div>
          <h2 className="mb-3 text-2xl font-bold">Still have questions?</h2>
          <p className="mb-6 text-muted-foreground">
            Our support team is happy to help. Reach out and we&apos;ll get back to you within 24 hours.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
