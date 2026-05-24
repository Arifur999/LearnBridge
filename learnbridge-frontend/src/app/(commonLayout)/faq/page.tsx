import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Globe,
  ChevronRight,
  MessageCircleQuestion,
  Mail,
  Sparkles,
  Users,
  Star,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ─── FAQ data ─────────────────────────────────────────────────────────── */
const faqs = [
  {
    category: "For Students",
    icon: GraduationCap,
    accent: "from-indigo-500 to-violet-600",
    chipBg: "bg-indigo-50 dark:bg-indigo-950/40",
    chipText: "text-indigo-700 dark:text-indigo-300",
    chipBorder: "border-indigo-200 dark:border-indigo-800",
    dotColor: "#6366f1",
    items: [
      {
        q: "How do I book a session with a tutor?",
        a: "Browse our tutor listings, pick a tutor you like, select an available time slot, and confirm your booking. You'll receive a confirmation instantly.",
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
    icon: BookOpen,
    accent: "from-violet-500 to-purple-600",
    chipBg: "bg-violet-50 dark:bg-violet-950/40",
    chipText: "text-violet-700 dark:text-violet-300",
    chipBorder: "border-violet-200 dark:border-violet-800",
    dotColor: "#8b5cf6",
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
    icon: Globe,
    accent: "from-cyan-500 to-blue-600",
    chipBg: "bg-cyan-50 dark:bg-cyan-950/40",
    chipText: "text-cyan-700 dark:text-cyan-300",
    chipBorder: "border-cyan-200 dark:border-cyan-800",
    dotColor: "#06b6d4",
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

const stats = [
  { icon: Users,  value: "10K+",  label: "Happy students"   },
  { icon: Star,   value: "4.9",   label: "Average rating"   },
  { icon: Clock,  value: "24h",   label: "Support response" },
  { icon: BookOpen, value: "50+", label: "Subjects covered" },
];

/* ─── Page ─────────────────────────────────────────────────────────────── */
export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
        <Image
          src="/front-view-stacked-books-earth-globe-with-graduation-cap-education-day_742418-47637.jpg"
          alt="Books and graduation cap"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-zinc-950/65" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950/95 via-zinc-950/75 to-zinc-950/30" />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/60 via-transparent to-transparent" />

        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-32 -top-32 size-[500px] rounded-full border border-white/[0.04]" />
        <div className="pointer-events-none absolute -right-16 -top-16 size-[320px] rounded-full border border-white/[0.06]" />

        <div className="relative mx-auto flex min-h-[62svh] max-w-7xl flex-col justify-end px-4 pb-14 pt-12 sm:px-6">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary/90 ring-1 ring-white/15 backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              Help Center
            </div>

            <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
              GOT<br />QUESTIONS?
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              Everything you need to know about booking sessions, tutor profiles, payments, and platform support — all in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary font-semibold hover:bg-primary/90">
                <Link href="#faq-answers">
                  Browse answers
                  <ChevronRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild size="lg" variant="outline"
                className="border-white/25 bg-white/8 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
              >
                <Link href="/contact">
                  <Mail className="mr-1.5 size-4" />
                  Contact support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────────────────────── */}
      <section className="border-b bg-zinc-950">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/8 px-4 sm:grid-cols-4 sm:px-6">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 py-7">
              <Icon className="mb-1 size-4 text-primary/70" />
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-xs text-white/45">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ Sections ────────────────────────────────────────────────── */}
      <section id="faq-answers" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">

          {/* Section intro */}
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Frequently asked
            </p>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              Find your answer
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
              Browse by category below. Click any question to expand the answer.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-16">
            {faqs.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.category}>
                  {/* Category header */}
                  <div className="mb-6 flex items-center gap-3">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${section.accent} shadow-sm`}
                    >
                      <Icon className="size-4 text-white" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight">{section.category}</h3>
                    <div className="h-px flex-1 bg-border/60" />
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${section.chipBg} ${section.chipText} ${section.chipBorder}`}
                    >
                      {section.items.length} questions
                    </span>
                  </div>

                  {/* Accordion */}
                  <Accordion type="single" collapsible className="space-y-3">
                    {section.items.map((item, i) => (
                      <AccordionItem
                        key={i}
                        value={`${section.category}-${i}`}
                        className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-lg data-[state=open]:shadow-xl"
                        style={{
                          borderColor: undefined,
                        }}
                      >
                        {/* Coloured top accent bar — always visible */}
                        <div
                          className="h-[3px] w-full opacity-0 transition-opacity duration-300 group-hover:opacity-60 group-data-[state=open]:opacity-100"
                          style={{ background: `linear-gradient(to right, ${section.dotColor}, ${section.dotColor}88)` }}
                        />

                        <AccordionTrigger className="group/trigger flex items-start gap-4 px-6 py-5 text-left hover:no-underline [&>svg]:mt-0.5 [&>svg]:shrink-0 [&>svg]:text-muted-foreground [&>svg]:transition-colors group-data-[state=open]:[&>svg]:text-primary">

                          {/* Number badge */}
                          <span
                            className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white shadow-sm transition-transform duration-200 group-hover/trigger:scale-110"
                            style={{ background: `linear-gradient(135deg, ${section.dotColor}ee, ${section.dotColor}99)` }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>

                          <span className="flex-1 text-[15px] font-semibold leading-snug tracking-tight transition-colors duration-200 group-data-[state=open]:text-primary">
                            {item.q}
                          </span>
                        </AccordionTrigger>

                        <AccordionContent className="px-6 pb-6 pt-0">
                          {/* Answer area with left accent line */}
                          <div className="ml-11 flex gap-4">
                            <div
                              className="w-[3px] shrink-0 rounded-full"
                              style={{ background: `linear-gradient(to bottom, ${section.dotColor}99, transparent)` }}
                            />
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {item.a}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="pb-24 pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative isolate overflow-hidden rounded-3xl bg-zinc-950 px-8 py-20 text-center text-white shadow-2xl sm:px-16">
            {/* Background glow */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-violet-900/20" />

            {/* Decorative rings */}
            <div className="pointer-events-none absolute -right-28 -top-28 size-96 rounded-full border border-white/[0.05]" />
            <div className="pointer-events-none absolute -right-14 -top-14 size-60 rounded-full border border-white/[0.07]" />
            <div className="pointer-events-none absolute -bottom-28 -left-28 size-96 rounded-full border border-white/[0.05]" />
            <div className="pointer-events-none absolute -bottom-14 -left-14 size-60 rounded-full border border-white/[0.07]" />

            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-primary/90 ring-1 ring-white/15 backdrop-blur-sm">
                <MessageCircleQuestion className="size-3.5" />
                Still have questions?
              </div>
              <h2 className="mb-4 text-3xl font-black tracking-tight md:text-4xl">
                We&apos;re always here to help
              </h2>
              <p className="mx-auto mb-10 max-w-md text-base text-white/65">
                Our support team responds within 24 hours on business days. Don't hesitate to reach out.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button
                  asChild size="lg"
                  className="min-w-[160px] bg-white font-semibold text-zinc-950 hover:bg-white/90"
                >
                  <Link href="/contact">
                    <Mail className="mr-1.5 size-4" />
                    Contact support
                  </Link>
                </Button>
                <Button
                  asChild size="lg" variant="outline"
                  className="min-w-[160px] border-white/25 bg-white/8 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
                >
                  <Link href="/tutors">Browse tutors</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
