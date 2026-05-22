"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
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
  },
  {
    title: "Teach with clarity. Grow with LearnBridge.",
    description:
      "Share your expertise with motivated learners, manage availability, and build a tutoring profile students trust.",
    cta: "Become a Tutor",
    ctaHref: "/register",
    overlay: "bg-cyan-950/52",
    image: "/front-view-academic-cap-with-books-pencils_23-2148756619.jpg",
  },
  {
    title: "Courses and sessions for real progress",
    description:
      "Move from a difficult topic to a clear next step with learning support designed around your goals.",
    cta: "Get Started",
    ctaHref: "/register",
    overlay: "bg-slate-950/48",
    image: "/front-view-stacked-books-earth-globe-with-graduation-cap-education-day_742418-47637.jpg",
  },
];

const proofItems = [
  {
    icon: ShieldCheck,
    title: "Trusted profiles",
    description: "Compare tutors before you book.",
    iconColor: "text-emerald-300",
    borderColor: "border-emerald-400/30",
  },
  {
    icon: CalendarClock,
    title: "Clear scheduling",
    description: "Pick learning time that fits.",
    iconColor: "text-amber-300",
    borderColor: "border-amber-400/30",
  },
  {
    icon: BookOpen,
    title: "Course discovery",
    description: "Keep subjects within reach.",
    iconColor: "text-cyan-300",
    borderColor: "border-cyan-400/30",
  },
];

export default function Hero() {
  return (
    <section className="bg-slate-950 text-white">
      <Carousel className="w-full overflow-hidden">
        <CarouselContent>
          {slides.map((slide, index) => {
            return (
              <CarouselItem key={slide.title}>
                <div className="relative min-h-[72svh] w-full overflow-hidden md:min-h-[78svh]">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                    priority={index === 0}
                  />
                  <div className={`absolute inset-0 ${slide.overlay}`} />
                  <div className="absolute inset-0 bg-linear-to-r from-black/92 via-black/60 to-black/20" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />

                  <div className="relative z-10 mx-auto flex min-h-[72svh] max-w-7xl flex-col justify-between px-4 py-12 sm:px-6 md:min-h-[78svh] md:py-16">
                    <div className="max-w-3xl">
                      <h1 className="max-w-4xl text-4xl font-black leading-[1.1] tracking-tight text-white drop-shadow sm:text-5xl lg:text-6xl">
                        {slide.title}
                      </h1>
                      <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                        {slide.description}
                      </p>

                      <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
                        <Button
                          asChild
                          size="lg"
                          className="group bg-white px-7 font-semibold text-slate-950 hover:bg-white/90"
                        >
                          <Link href={slide.ctaHref}>
                            {slide.cta}
                            <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
                        >
                          <Link href="/courses">Explore Courses</Link>
                        </Button>
                      </div>
                    </div>

                    {/* Proof strip — individual rounded cards */}
                    <div className="mt-10 grid gap-3 sm:grid-cols-3">
                      {proofItems.map((item) => {
                        const ProofIcon = item.icon;
                        return (
                          <div
                            key={item.title}
                            className={`rounded-2xl border ${item.borderColor} bg-black/30 px-5 py-4 backdrop-blur-sm`}
                          >
                            <ProofIcon className={`mb-2.5 size-5 ${item.iconColor}`} />
                            <p className="font-semibold">{item.title}</p>
                            <p className="mt-0.5 text-sm text-white/65">{item.description}</p>
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

        <CarouselPrevious className="left-4 top-auto bottom-8 border-white/30 bg-black/35 text-white hover:bg-black/55 md:bottom-auto md:top-1/2" />
        <CarouselNext className="right-4 top-auto bottom-8 border-white/30 bg-black/35 text-white hover:bg-black/55 md:bottom-auto md:top-1/2" />
      </Carousel>
    </section>
  );
}
