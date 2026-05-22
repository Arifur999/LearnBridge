import Image from "next/image";
import Link from "next/link";
import { Target, Heart, Globe, Award, Users, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    desc: "We exist to make quality education accessible to every learner, everywhere.",
    color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/45 dark:text-indigo-300",
  },
  {
    icon: Heart,
    title: "Student First",
    desc: "Every feature we build starts with a simple question: does this help the student succeed?",
    color: "bg-rose-50 text-rose-600 dark:bg-rose-950/45 dark:text-rose-300",
  },
  {
    icon: Globe,
    title: "Inclusive Learning",
    desc: "We celebrate diverse backgrounds, subjects, and teaching styles on our platform.",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/45 dark:text-emerald-300",
  },
  {
    icon: Award,
    title: "Quality Assured",
    desc: "Clear profile details and reviews help learners make careful choices.",
    color: "bg-amber-50 text-amber-600 dark:bg-amber-950/45 dark:text-amber-300",
  },
];

const team = [
  { name: "Sarah Chen", role: "Co-Founder & CEO", img: "/book-with-green-board-background_1150-3837.jpg" },
  { name: "Marcus Patel", role: "Co-Founder & CTO", img: "/education-learn-study-world-graduated-student-studying-abroad-international-idea_488220-56721.jpg" },
  { name: "Amira Hassan", role: "Head of Education", img: "/front-view-stacked-books-earth-globe-with-graduation-cap-education-day_742418-47637.jpg" },
];

const stats = [
  { value: "10K+", label: "Students", icon: Users, color: "bg-primary/10 text-primary" },
  { value: "120+", label: "Expert Tutors", icon: BookOpen, color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
  { value: "50+", label: "Subjects", icon: Award, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { value: "95%", label: "Satisfaction Rate", icon: Heart, color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero — left-aligned bottom, matching tutors/courses layout */}
      <section className="relative isolate overflow-hidden border-b bg-zinc-950 text-white">
        <Image
          src="/graduation-cap-with-earth-globe-concept-global-business-study-abroad-educational-back-school-education-global-world-study-abroad-business-universities-worldwide-language-study_721781-2163.jpg"
          alt="A graduation cap, books, and a globe"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-zinc-950/52" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950/92 via-zinc-950/65 to-zinc-950/20" />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/55 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[62svh] max-w-7xl flex-col justify-end px-4 py-12 sm:px-6 md:py-16">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-rose-300">
              Our Story
            </p>
            <h1 className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Education feels closer when the right teacher is within reach
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              LearnBridge was built to connect motivated learners with tutors who can turn a
              difficult subject into a clear next step.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="group bg-white font-semibold text-zinc-950 hover:bg-white/90"
              >
                <Link href="/tutors">
                  Explore tutors <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              >
                <Link href="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-muted/20 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border bg-background p-6 text-center shadow-sm"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-primary/20 rounded-t-2xl" />
                  <div className={`flex size-12 items-center justify-center rounded-full ${item.color}`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-3xl font-extrabold tracking-tight text-primary">{item.value}</h3>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                How It Started
              </p>
              <h2 className="mb-5 text-3xl font-bold leading-tight md:text-4xl">
                Built for learners, by educators
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  LearnBridge began when our team felt tutoring should be easier to compare,
                  easier to book, and easier to revisit after a session.
                  They wanted a platform where finding a qualified tutor was as easy as a
                  few taps.
                </p>
                <p>
                  Today, we serve over 10,000 students and 120+ tutors across dozens of
                  subjects. Our platform handles everything from booking to reviews, so tutors
                  can focus on teaching and students can focus on learning.
                </p>
                <p>
                  We keep expanding subjects, listening to learner questions, and improving
                  the booking experience so the platform grows from real study habits.
                </p>
              </div>
              <Button asChild size="lg" className="mt-8">
                <Link href="/tutors">Explore Tutors</Link>
              </Button>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/book-with-green-board-background_1150-3837.jpg"
                  alt="Students learning"
                  width={600}
                  height={420}
                  className="w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 overflow-hidden rounded-2xl border-4 border-background shadow-lg">
                <Image
                  src="/front-view-academic-cap-with-books-pencils_23-2148756619.jpg"
                  alt="Tutoring session"
                  width={180}
                  height={140}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t bg-muted/20 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              What Guides Us
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">Our Core Values</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-2xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className={`mb-4 inline-flex rounded-xl p-3 ${v.color}`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mb-2 font-semibold">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              The People Behind LearnBridge
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">Meet Our Team</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center rounded-2xl border bg-background p-6 text-center shadow-sm"
              >
                <div className="mb-4 size-24 overflow-hidden rounded-full ring-4 ring-primary/10 shadow-md">
                  <Image
                    src={member.img}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative isolate overflow-hidden rounded-3xl bg-zinc-950 px-6 py-20 text-center text-white shadow-2xl sm:px-12">
            <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-transparent to-rose-900/15" />
            <div className="absolute -right-24 -top-24 size-80 rounded-full border border-white/[0.06]" />
            <div className="absolute -right-12 -top-12 size-56 rounded-full border border-white/[0.06]" />
            <div className="absolute -bottom-24 -left-24 size-80 rounded-full border border-white/[0.06]" />

            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-rose-300 ring-1 ring-white/15 backdrop-blur-sm">
                <Sparkles className="size-3.5" />
                Ready to start?
              </div>
              <h2 className="mb-4 text-3xl font-black md:text-4xl">
                Ready to start learning?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-base text-white/75">
                Start with a tutor, a course, or the question already on your desk.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  className="min-w-[160px] bg-white font-semibold text-zinc-950 hover:bg-white/90"
                >
                  <Link href="/register">Get Started Free</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="min-w-[160px] border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
                >
                  <Link href="/contact">Talk to Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
