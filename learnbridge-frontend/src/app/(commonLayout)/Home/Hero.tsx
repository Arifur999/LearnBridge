"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, GraduationCap, Rocket } from "lucide-react";

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
    title: "Learn Skills. Build Your Future.",
    description:
      "Join SkillBridge and book sessions with verified expert tutors across all subjects.",
    cta: "Browse Tutors",
    ctaHref: "/tutors",
    overlay: "bg-indigo-900/55",
    image: "/ed-1.jpg",
    icon: BookOpen,
    badge: "10,000+ Students",
  },
  {
    title: "Teach. Inspire. Earn.",
    description:
      "Become a tutor on SkillBridge — share your expertise with motivated learners and grow your income.",
    cta: "Become a Tutor",
    ctaHref: "/register",
    overlay: "bg-violet-900/55",
    image: "/ed-2.jpg",
    icon: GraduationCap,
    badge: "120+ Expert Tutors",
  },
  {
    title: "Upgrade Your Career",
    description:
      "Find the right subject expert and book a confirmed session instantly. Zero hassle, maximum learning.",
    cta: "Get Started",
    ctaHref: "/register",
    overlay: "bg-blue-900/55",
    image: "/ed-3.jpg",
    icon: Rocket,
    badge: "95% Success Rate",
  },
];

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <Carousel className="w-full overflow-hidden rounded-2xl">
        <CarouselContent>
          {slides.map((slide, index) => {
            const Icon = slide.icon;
            return (
              <CarouselItem key={index}>
                {/* min-h-[56vh] matches original banner height */}
                <div className="relative min-h-[56vh] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 1280px"
                    className="object-cover object-center"
                    priority={index === 0}
                  />

                  {/* overlay */}
                  <div className={`absolute inset-0 ${slide.overlay}`} />

                  {/* content */}
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 py-16 text-center text-white">
                    <div className="mb-5 inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                      <Icon className="mr-2 size-4" />
                      {slide.badge}
                    </div>

                    <h1 className="mb-4 max-w-3xl text-3xl font-extrabold leading-tight drop-shadow-lg md:text-5xl">
                      {slide.title}
                    </h1>
                    <p className="mb-8 max-w-2xl text-base text-white/90 drop-shadow md:text-lg">
                      {slide.description}
                    </p>

                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                      <Button
                        asChild
                        size="lg"
                        className="bg-white px-8 font-semibold text-indigo-700 hover:bg-white/90"
                      >
                        <Link href={slide.ctaHref}>{slide.cta}</Link>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-white/50 bg-transparent text-white hover:bg-white/10"
                      >
                        <Link href="/login">Sign In</Link>
                      </Button>
                    </div>
                  </div>

                  {/* decorative blobs */}
                  <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/5" />
                  <div className="pointer-events-none absolute -bottom-10 -left-10 size-48 rounded-full bg-white/5" />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-4 border-white/30 bg-white/20 text-white hover:bg-white/30" />
        <CarouselNext className="right-4 border-white/30 bg-white/20 text-white hover:bg-white/30" />
      </Carousel>
    </section>
  );
}
