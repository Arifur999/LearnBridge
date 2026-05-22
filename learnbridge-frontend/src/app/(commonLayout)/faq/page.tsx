import Image from "next/image";
import Link from "next/link";
import { MessageCircleQuestion, Search } from "lucide-react";
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
        a: "Visit our Contact page or email us at support@learnbridge.com. Our team responds within 24 hours on business days.",
      },
    ],
  },
];

const quickLinks = [
  "Student bookings",
  "Tutor profiles",
  "Payments & reviews",
  "Platform support",
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero — left-aligned bottom, consistent with all other pages */}
      <section className="relative isolate overflow-hidden border-b bg-zinc-950 text-white">
        <Image
          src="/front-view-stacked-books-earth-globe-with-graduation-cap-education-day_742418-47637.jpg"
          alt="A globe and graduation cap above an open book"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-zinc-950/60" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/20" />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/50 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[58svh] max-w-7xl flex-col justify-end px-4 py-12 sm:px-6 md:py-16">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              Help Center
            </p>
            <h1 className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Answers before your next learning step
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Get quick guidance for booking, tutoring, payments, and account questions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="group bg-white font-semibold text-zinc-950 hover:bg-white/90"
              >
                <Link href="#faq-answers">
                  <Search className="mr-1 size-4" />
                  See answers
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              >
                <Link href="/contact">Contact support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick-nav pills */}
      <section className="border-b bg-muted/25">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-4 sm:px-6">
          {quickLinks.map((label) => (
            <span
              key={label}
              className="rounded-full border bg-background px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* FAQ Sections */}
      <section id="faq-answers" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-4xl space-y-14 px-4">
          {faqs.map((section) => (
            <div key={section.category}>
              <div
                className={`mb-6 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold ${section.color}`}
              >
                {section.category}
              </div>

              <Accordion type="single" collapsible className="space-y-3">
                {section.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`${section.category}-${i}`}
                    className="rounded-2xl border bg-card/90 px-5 shadow-sm transition-shadow hover:shadow-md data-[state=open]:border-primary/25 data-[state=open]:shadow-md dark:bg-card"
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

      {/* CTA — premium rounded-3xl style */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative isolate overflow-hidden rounded-3xl bg-zinc-950 px-6 py-20 text-center text-white shadow-2xl sm:px-12">
            <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-transparent to-cyan-900/15" />
            <div className="absolute -right-24 -top-24 size-80 rounded-full border border-white/[0.06]" />
            <div className="absolute -right-12 -top-12 size-56 rounded-full border border-white/[0.06]" />
            <div className="absolute -bottom-24 -left-24 size-80 rounded-full border border-white/[0.06]" />

            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-cyan-300 ring-1 ring-white/15 backdrop-blur-sm">
                <MessageCircleQuestion className="size-3.5" />
                Still have questions?
              </div>
              <h2 className="mb-4 text-3xl font-black md:text-4xl">
                We&apos;re here to help
              </h2>
              <p className="mx-auto mb-8 max-w-md text-base text-white/75">
                Our support team responds within 24 hours on business days. Reach out anytime.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  className="min-w-[160px] bg-white font-semibold text-zinc-950 hover:bg-white/90"
                >
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="min-w-[160px] border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
                >
                  <Link href="/tutors">Browse Tutors</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
