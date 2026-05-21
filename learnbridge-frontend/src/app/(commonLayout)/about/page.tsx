import Image from "next/image";
import Link from "next/link";
import { Target, Heart, Globe, Award, Users, BookOpen, ArrowRight } from "lucide-react";
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
  { value: "10K+", label: "Students", icon: Users },
  { value: "120+", label: "Expert Tutors", icon: BookOpen },
  { value: "50+", label: "Subjects", icon: Award },
  { value: "95%", label: "Satisfaction Rate", icon: Heart },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative isolate overflow-hidden border-b bg-zinc-950 text-white">
        <Image
          src="/graduation-cap-with-earth-globe-concept-global-business-study-abroad-educational-back-school-education-global-world-study-abroad-business-universities-worldwide-language-study_721781-2163.jpg"
          alt="A graduation cap, books, and a globe"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-zinc-950/50" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950/88 via-zinc-950/60 to-transparent" />

        <div className="relative mx-auto flex min-h-[64svh] max-w-7xl items-center px-4 py-14 sm:px-6">
          <div className="max-w-2xl border-l border-white/30 pl-5 sm:pl-8">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.26em] text-rose-100">
              Our Story
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Education feels closer when the right teacher is within reach
            </h1>
            <p className="mt-6 text-base leading-7 text-white/82 sm:text-lg">
              LearnBridge was built to connect motivated learners with tutors who can turn a difficult subject into a clear next step.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-rose-100 text-zinc-950 hover:bg-white">
                <Link href="/tutors">
                  Explore tutors <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white"
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
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 border bg-card/90 p-6 text-center shadow-sm dark:bg-card"
                >
                  <div className="bg-indigo-50 p-3 dark:bg-indigo-950/45">
                    <Icon className="size-6 text-indigo-600 dark:text-indigo-300" />
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
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                How It Started
              </p>
              <h2 className="mb-5 text-3xl font-bold md:text-4xl">
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
      <section className="border-t bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              What Guides Us
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">Our Core Values</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="border bg-card/90 p-6 shadow-sm dark:bg-card"
                >
                  <div className={`mb-4 inline-flex rounded-xl p-3 ${v.color}`}>
                    <Icon className="size-6" />
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
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              The People Behind LearnBridge
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">Meet Our Team</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center">
                <div className="mb-4 size-28 overflow-hidden rounded-full border-4 border-indigo-100 shadow-md dark:border-indigo-950">
                  <Image
                    src={member.img}
                    alt={member.name}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-zinc-950 py-16 text-white">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-3 text-2xl font-bold">Ready to start learning?</h2>
          <p className="mb-6 text-indigo-100">
            Start with a tutor, a course, or the question already on your desk.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-white/90">
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
              <Link href="/contact">Talk to Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
