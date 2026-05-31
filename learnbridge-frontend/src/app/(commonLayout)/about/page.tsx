import Image from "next/image";
import Link from "next/link";
import {
  Target, Heart, Globe, Award,
  Users, BookOpen, ArrowRight, Sparkles,
  BadgeCheck, Rocket, GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    num: "01",
    icon: Target,
    title: "Mission-Driven",
    desc: "We exist to make quality education accessible to every learner, everywhere.",
    from: "#6366f1", to: "#818cf8",
    chip: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300",
  },
  {
    num: "02",
    icon: Heart,
    title: "Student First",
    desc: "Every feature we build starts with a simple question: does this help the student succeed?",
    from: "#f43f5e", to: "#fb7185",
    chip: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300",
  },
  {
    num: "03",
    icon: Globe,
    title: "Inclusive Learning",
    desc: "We celebrate diverse backgrounds, subjects, and teaching styles on our platform.",
    from: "#10b981", to: "#34d399",
    chip: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  {
    num: "04",
    icon: Award,
    title: "Quality Assured",
    desc: "Clear profile details and reviews help learners make careful choices.",
    from: "#f59e0b", to: "#fbbf24",
    chip: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300",
  },
];

const team = [
  {
    name: "Sarah Chen",
    role: "Co-Founder & CEO",
    bio: "Passionate about democratising education through smart technology.",
    img: "/book-with-green-board-background_1150-3837.jpg",
    from: "#6366f1", to: "#818cf8",
  },
  {
    name: "Marcus Patel",
    role: "Co-Founder & CTO",
    bio: "Building the infrastructure that keeps every session running smoothly.",
    img: "/education-learn-study-world-graduated-student-studying-abroad-international-idea_488220-56721.jpg",
    from: "#0ea5e9", to: "#38bdf8",
  },
  {
    name: "Amira Hassan",
    role: "Head of Education",
    bio: "Ensuring every course and tutor meets our quality promise.",
    img: "/front-view-stacked-books-earth-globe-with-graduation-cap-education-day_742418-47637.jpg",
    from: "#10b981", to: "#34d399",
  },
];

const stats = [
  { value: "10K+", label: "Students", icon: Users,           sub: "and growing every week" },
  { value: "120+", label: "Expert Tutors", icon: BookOpen,   sub: "across 50+ subjects" },
  { value: "50+",  label: "Subjects", icon: GraduationCap,   sub: "from code to languages" },
  { value: "95%",  label: "Satisfaction", icon: Heart,        sub: "based on session reviews" },
];

const milestones = [
  { year: "2021", icon: Rocket,       title: "Founded",          desc: "LearnBridge launched with a single goal: make tutoring as easy as a few taps." },
  { year: "2022", icon: Users,        title: "1K Students",      desc: "Our first thousand learners joined, validating the need for a better booking experience." },
  { year: "2023", icon: BookOpen,     title: "50 Tutors onboard",desc: "We crossed 50 verified tutors and expanded into programming, languages, and sciences." },
  { year: "2024", icon: GraduationCap,title: "10K+ Community",   desc: "Today LearnBridge serves a thriving community of learners and educators worldwide." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">

      
      <section className="relative isolate overflow-hidden border-b bg-zinc-950 text-white">
        <Image
          src="/graduation-cap-with-earth-globe-concept-global-business-study-abroad-educational-back-school-education-global-world-study-abroad-business-universities-worldwide-language-study_721781-2163.jpg"
          alt="A graduation cap, books, and a globe"
          fill sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-zinc-950/55" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950/95 via-zinc-950/65 to-zinc-950/15" />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/55 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[65svh] max-w-7xl flex-col justify-end px-4 py-14 sm:px-6 md:py-18">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-rose-300 ring-1 ring-white/15 backdrop-blur-sm">
              <Sparkles className="size-3" />
              Our Story
            </div>
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Education feels closer when the right teacher is within reach
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              LearnBridge was built to connect motivated learners with tutors who can turn a
              difficult subject into a clear next step.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="group bg-white font-semibold text-zinc-950 hover:bg-white/90">
                <Link href="/tutors">
                  Explore tutors
                  <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline"
                className="border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white">
                <Link href="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      
      <section className="border-b bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 divide-x divide-white/8 md:grid-cols-4">
            {stats.map(({ value, label, icon: Icon, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1 px-6 py-10 text-center">
                <Icon className="mb-2 size-5 text-white/40" />
                <p className="text-4xl font-black tracking-tight text-white">{value}</p>
                <p className="text-sm font-semibold text-white/80">{label}</p>
                <p className="text-xs text-white/40">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* Text */}
            <div>
              <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                How It Started
              </p>
              <h2 className="mb-6 text-3xl font-black leading-tight tracking-tight md:text-4xl">
                Built for learners,<br />
                <span className="text-primary">by educators</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  LearnBridge began when our team felt tutoring should be easier to compare,
                  easier to book, and easier to revisit after a session. They wanted a platform
                  where finding a qualified tutor was as easy as a few taps.
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

              {/* Trust chips */}
              <div className="mt-8 flex flex-wrap gap-2">
                {["Verified tutors", "Instant booking", "Session reviews", "Student support"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                    <BadgeCheck className="size-3 text-primary" />
                    {t}
                  </span>
                ))}
              </div>

              <Button asChild size="lg" className="mt-8">
                <Link href="/tutors">Explore Tutors <ArrowRight className="ml-1 size-4" /></Link>
              </Button>
            </div>

            {/* Image stack */}
            <div className="relative pb-14 pl-4">
              {/* Decorative blur blob */}
              <div className="pointer-events-none absolute -inset-10 rounded-full bg-primary/5 blur-3xl" />

              {/* Main image */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/book-with-green-board-background_1150-3837.jpg"
                  alt="Students learning"
                  width={600}
                  height={440}
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-linear-to-tr from-primary/15 via-transparent to-transparent" />

                {/* Stat card — top-right, inside the image */}
                <div className="absolute right-4 top-4 flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-900/90">
                  <div className="flex size-9 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                    <Users className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">10,000+</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Active students</p>
                  </div>
                </div>
              </div>

              {/* Small image — outside overflow-hidden, sticks out from bottom-left */}
              <div className="absolute bottom-0 left-0 z-10 overflow-hidden rounded-2xl border-4 border-background shadow-2xl">
                <Image
                  src="/front-view-academic-cap-with-books-pencils_23-2148756619.jpg"
                  alt="Tutoring session"
                  width={168}
                  height={136}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="border-y bg-muted/20 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-14 text-center">
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              How We Got Here
            </p>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">Our Journey</h2>
          </div>

          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Connector line (desktop) */}
            <div className="pointer-events-none absolute top-8 left-[12.5%] right-[12.5%] hidden h-px bg-border lg:block" />

            {milestones.map(({ year, icon: Icon, title, desc }, i) => (
              <div key={year} className="relative flex flex-col items-center text-center">
                {/* Step circle */}
                <div className="relative z-10 mb-4 flex size-16 items-center justify-center rounded-full border-2 border-primary/20 bg-background shadow-sm">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  {/* Step number */}
                  <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <p className="mb-1 text-xs font-bold text-primary">{year}</p>
                <h3 className="mb-2 font-bold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-14 text-center">
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              What Guides Us
            </p>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">Our Core Values</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Top accent bar */}
                  <div
                    className="absolute inset-x-0 top-0 h-1 rounded-t-3xl"
                    style={{ background: `linear-gradient(to right, ${v.from}, ${v.to})` }}
                  />

                  {/* Large background number */}
                  <p className="pointer-events-none absolute right-4 top-3 select-none text-6xl font-black text-foreground/[0.04]">
                    {v.num}
                  </p>

                  {/* Icon */}
                  <div className={`mb-4 inline-flex rounded-2xl p-3 ${v.chip}`}>
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mb-2 font-bold tracking-tight">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      
      <section className="border-t bg-muted/15 py-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-14 text-center">
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              The People Behind LearnBridge
            </p>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">Meet Our Team</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              A small team with a big mission — making great education reachable for everyone.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="group relative w-64 overflow-hidden rounded-3xl border border-border/50 bg-card shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
              >
                {/* Hover ring */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 ring-1 ring-primary/20 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Wave header */}
                <div className="relative flex h-44 flex-col items-center justify-center overflow-hidden bg-muted/30 dark:bg-muted/10">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-violet-400/5" />

                  {/* Avatar */}
                  <div className="relative z-10 mb-2">
                    <Image
                      src={member.img}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="size-20 rounded-full object-cover ring-4 ring-background shadow-lg transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border/50">
                      <BadgeCheck className="size-3.5 text-primary" />
                    </div>
                  </div>

                  {/* Wave SVG */}
                  <div className="absolute bottom-0 left-0 right-0 h-14 overflow-hidden">
                    <svg viewBox="0 0 500 56" preserveAspectRatio="none"
                      className="absolute bottom-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0,36 C55,18 110,50 165,32 C220,14 275,48 330,30 C385,14 440,44 500,26 L500,56 L0,56 Z"
                        fill="rgba(34,211,238,0.10)" />
                      <path d="M0,36 C55,18 110,50 165,32 C220,14 275,48 330,30 C385,14 440,44 500,26"
                        fill="none" stroke="rgba(34,211,238,0.55)" strokeWidth="1.4" />
                      <path d="M0,44 C70,26 150,56 230,42 C310,28 390,54 500,40 L500,56 L0,56 Z"
                        fill="rgba(139,92,246,0.09)" />
                      <path d="M0,44 C70,26 150,56 230,42 C310,28 390,54 500,40"
                        fill="none" stroke="rgba(139,92,246,0.60)" strokeWidth="1.4" />
                      <path d="M0,50 C80,36 160,56 250,46 C340,36 420,56 500,48 L500,56 L0,56 Z"
                        fill="rgba(99,102,241,0.12)" />
                      <path d="M0,50 C80,36 160,56 250,46 C340,36 420,56 500,48"
                        fill="none" stroke="rgba(99,102,241,0.70)" strokeWidth="1.8" />
                    </svg>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 text-center">
                  <h3 className="font-bold tracking-tight">{member.name}</h3>
                  <p className="mt-0.5 text-xs font-semibold text-primary">{member.role}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative isolate overflow-hidden rounded-3xl bg-zinc-950 px-6 py-24 text-center text-white shadow-2xl sm:px-12">
            <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-transparent to-rose-900/15" />
            <div className="absolute -right-24 -top-24 size-80 rounded-full border border-white/[0.06]" />
            <div className="absolute -right-12 -top-12 size-56 rounded-full border border-white/[0.06]" />
            <div className="absolute -bottom-24 -left-24 size-80 rounded-full border border-white/[0.06]" />
            <div className="absolute -bottom-12 -left-12 size-56 rounded-full border border-white/[0.06]" />

            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-rose-300 ring-1 ring-white/15 backdrop-blur-sm">
                <Sparkles className="size-3.5" />
                Ready to start?
              </div>
              <h2 className="mb-4 text-3xl font-black tracking-tight md:text-5xl">
                Ready to start learning?
              </h2>
              <p className="mx-auto mb-10 max-w-md text-base text-white/70">
                Start with a tutor, a course, or the question already on your desk.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button asChild size="lg"
                  className="min-w-[160px] bg-white font-semibold text-zinc-950 hover:bg-white/90">
                  <Link href="/register">Get Started Free</Link>
                </Button>
                <Button asChild size="lg" variant="outline"
                  className="min-w-[160px] border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white">
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
