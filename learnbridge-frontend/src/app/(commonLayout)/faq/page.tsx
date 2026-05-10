import Image from "next/image";
import Link from "next/link";
import { HelpCircle, ChevronDown } from "lucide-react";
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
    color: "bg-indigo-50 text-indigo-700 border-indigo-100",
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
        a: "Absolutely. SkillBridge uses industry-standard encryption and does not store any payment card details on our servers.",
      },
      {
        q: "How do I find a tutor for a specific subject?",
        a: "Use the search and filter tools on the Tutors page. You can filter by subject, hourly rate, and rating to find the perfect match.",
      },
    ],
  },
  {
    category: "For Tutors",
    color: "bg-violet-50 text-violet-700 border-violet-100",
    items: [
      {
        q: "How do I become a tutor on SkillBridge?",
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
    color: "bg-blue-50 text-blue-700 border-blue-100",
    items: [
      {
        q: "Is SkillBridge free to join?",
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
      {/* Hero */}
      <section className="relative min-h-[56vh] overflow-hidden">
        <Image
          src="/ed-3.jpg"
          alt="FAQ"
          fill
          sizes="(max-width: 768px) 100vw, 1280px"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-violet-900/60" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 py-16 text-center text-white">
          <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-full bg-white/20 p-3 backdrop-blur-sm">
            <HelpCircle className="size-8" />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-200">
            Help Center
          </p>
          <h1 className="mb-4 max-w-3xl text-4xl font-extrabold drop-shadow-lg md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-xl text-lg text-indigo-100 drop-shadow">
            Find quick answers to the most common questions about SkillBridge.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20">
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
                    className="rounded-2xl border bg-background px-5 shadow-sm"
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
