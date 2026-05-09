import Image from "next/image";
import Link from "next/link";
import { Target, Heart, Globe, Award, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    desc: "We exist to make quality education accessible to every learner, everywhere.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Heart,
    title: "Student First",
    desc: "Every feature we build starts with a simple question: does this help the student succeed?",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Globe,
    title: "Inclusive Learning",
    desc: "We celebrate diverse backgrounds, subjects, and teaching styles on our platform.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Award,
    title: "Quality Assured",
    desc: "Every tutor is vetted and every review is real — no shortcuts on trust.",
    color: "bg-amber-50 text-amber-600",
  },
];

const team = [
  { name: "Sarah Chen", role: "Co-Founder & CEO", img: "/ed-1.jpg" },
  { name: "Marcus Patel", role: "Co-Founder & CTO", img: "/ed-2.jpg" },
  { name: "Amira Hassan", role: "Head of Education", img: "/ed-3.jpg" },
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
      {/* Hero */}
      <section className="relative overflow-hidden border-b py-24 text-white">
        <Image
          src="/ed-2.jpg"
          alt="About SkillBridge"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-indigo-900/70" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-200">
            Our Story
          </p>
          <h1 className="mb-5 text-4xl font-extrabold leading-tight drop-shadow md:text-5xl">
            Bridging Knowledge Gaps,<br />One Session at a Time
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-indigo-100">
            SkillBridge was founded with a single belief: every student deserves access to
            a great teacher. We connect motivated learners with verified expert tutors — simply,
            reliably, and affordably.
          </p>
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
                  className="flex flex-col items-center gap-2 rounded-2xl border bg-background p-6 text-center shadow-sm"
                >
                  <div className="rounded-xl bg-indigo-50 p-3">
                    <Icon className="size-6 text-indigo-600" />
                  </div>
                  <h3 className="text-3xl font-extrabold tracking-tight text-indigo-700">{item.value}</h3>
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
                  SkillBridge began in 2022 when our founders — frustrated by the lack of
                  reliable, affordable tutoring options — decided to build something better.
                  They wanted a platform where finding a qualified tutor was as easy as a
                  few taps.
                </p>
                <p>
                  Today, we serve over 10,000 students and 120+ tutors across dozens of
                  subjects. Our platform handles everything from booking to reviews, so tutors
                  can focus on teaching and students can focus on learning.
                </p>
                <p>
                  We are continuously expanding our subject catalogue, improving our matching
                  algorithms, and listening to our community — because the best product is one
                  that grows with its users.
                </p>
              </div>
              <Button asChild size="lg" className="mt-8">
                <Link href="/tutors">Explore Tutors</Link>
              </Button>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/ed-1.jpg"
                  alt="Students learning"
                  width={600}
                  height={420}
                  className="w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 overflow-hidden rounded-2xl border-4 border-background shadow-lg">
                <Image
                  src="/ed-3.jpg"
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
                  className="rounded-2xl border bg-background p-6 shadow-sm"
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
              The People Behind SkillBridge
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">Meet Our Team</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center">
                <div className="mb-4 size-28 overflow-hidden rounded-full border-4 border-indigo-100 shadow-md">
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
      <section className="border-t bg-linear-to-br from-indigo-600 to-violet-700 py-16 text-white">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-3 text-2xl font-bold">Ready to start learning?</h2>
          <p className="mb-6 text-indigo-100">
            Join thousands of students already growing with SkillBridge.
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
