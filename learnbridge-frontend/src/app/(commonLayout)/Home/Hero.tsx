"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  GraduationCap,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

interface Slide {
  title: string;
  description: string;
  cta: string;
  ctaHref: string;
  overlay: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
}

const slides: Slide[] = [
  {
    title: "LearnBridge tutoring for your next breakthrough",
    description:
      "Book focused sessions with expert tutors, compare courses, and keep learning moving with confidence.",
    cta: "Browse Tutors",
    ctaHref: "/tutors",
    overlay: "bg-indigo-950/52",
    image: "/book-with-green-board-background_1150-3837.jpg",
    icon: BookOpen,
    badge: "10,000+ Students",
  },
  {
    title: "Teach with clarity. Grow with LearnBridge.",
    description:
      "Share your expertise with motivated learners, manage availability, and build a tutoring profile students trust.",
    cta: "Become a Tutor",
    ctaHref: "/register",
    overlay: "bg-cyan-950/52",
    image: "/front-view-academic-cap-with-books-pencils_23-2148756619.jpg",
    icon: GraduationCap,
    badge: "120+ Expert Tutors",
  },
  {
    title: "Courses and sessions for real progress",
    description:
      "Move from a difficult topic to a clear next step with learning support designed around your goals.",
    cta: "Get Started",
    ctaHref: "/register",
    overlay: "bg-slate-950/48",
    image: "/front-view-stacked-books-earth-globe-with-graduation-cap-education-day_742418-47637.jpg",
    icon: Rocket,
    badge: "95% Success Rate",
  },
];

const proofItems = [
  {
    icon: ShieldCheck,
    title: "Trusted profiles",
    description: "Compare tutors before you book.",
    color: "text-emerald-200",
  },
  {
    icon: CalendarClock,
    title: "Clear scheduling",
    description: "Pick learning time that fits.",
    color: "text-amber-200",
  },
  {
    icon: BookOpen,
    title: "Course discovery",
    description: "Keep subjects within reach.",
    color: "text-cyan-200",
  },
];

export default function Hero() {
  return (
    <section className="bg-slate-950 text-white">
      <Carousel className="w-full overflow-hidden">
        <CarouselContent>
          {slides.map((slide, index) => {
            const Icon = slide.icon;

            return (
              <CarouselItem key={slide.title}>
                <div className="relative min-h-[72svh] w-full overflow-hidden md:min-h-[76svh]">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                    priority={index === 0}
                  />

                  <div className={`absolute inset-0 ${slide.overlay}`} />
                  <div className="absolute inset-0 bg-linear-to-r from-black/88 via-black/56 to-black/18" />

                  <div className="relative z-10 mx-auto flex min-h-[72svh] max-w-7xl flex-col justify-between px-4 py-12 sm:px-6 md:min-h-[76svh] md:py-16">
                    <div className="max-w-3xl">
                      <div className="mb-5 inline-flex items-center border-l-2 border-cyan-300 pl-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">
                        <Icon className="mr-2 size-4" />
                        {slide.badge}
                      </div>

                      <h1 className="max-w-4xl text-4xl font-black leading-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
                        {slide.title}
                      </h1>
                      <p className="mt-5 max-w-2xl text-base leading-7 text-white/86 sm:text-lg">
                        {slide.description}
                      </p>

                      <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
                        <Button
                          asChild
                          size="lg"
                          className="bg-white px-7 font-semibold text-slate-950 hover:bg-white/90"
                        >
                          <Link href={slide.ctaHref}>
                            {slide.cta}
                            <ArrowRight className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="border-white/35 bg-black/10 text-white hover:bg-white/10 hover:text-white"
                        >
                          <Link href="/courses">Explore Courses</Link>
                        </Button>
                      </div>
                    </div>

                    <div className="mt-10 grid gap-px overflow-hidden border border-white/18 bg-white/18 sm:grid-cols-3">
                      {proofItems.map((item) => {
                        const ProofIcon = item.icon;

                        return (
                          <div key={item.title} className="bg-black/35 px-4 py-4 backdrop-blur-sm sm:px-5">
                            <ProofIcon className={`mb-3 size-5 ${item.color}`} />
                            <p className="font-semibold">{item.title}</p>
                            <p className="mt-1 text-sm text-white/70">{item.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="left-4 top-auto bottom-6 border-white/30 bg-black/35 text-white hover:bg-black/55 md:bottom-auto md:top-1/2" />
        <CarouselNext className="right-4 top-auto bottom-6 border-white/30 bg-black/35 text-white hover:bg-black/55 md:bottom-auto md:top-1/2" />
      </Carousel>
    </section>
  );
}
