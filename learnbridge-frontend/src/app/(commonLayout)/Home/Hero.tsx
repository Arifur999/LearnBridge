"use client";

import Image, { StaticImageData } from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import ed_1 from "../../../../public/ed-1.jpg";
import ed_2 from "../../../../public/ed-2.jpg";
import ed_3 from "../../../../public/ed-3.jpg";

interface Slide {
  title: string;
  description: string;
  image: StaticImageData;
  cta: string;
}

const slides: Slide[] = [
  {
    title: "Learn Skills. Build Your Future.",
    description:
      "Join SkillBridge and book sessions with verified expert tutors.",
    image: ed_1,
    cta: "Browse Tutors",
  },
  {
    title: "Teach. Inspire. Earn.",
    description:
      "Become a tutor and share your knowledge with motivated learners.",
    image: ed_2,
    cta: "Become a Tutor",
  },
  {
    title: "Upgrade Your Career",
    description:
      "Find the right subject expert and book a session instantly.",
    image: ed_3,
    cta: "Get Started",
  },
];

export default function Home() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-10">
      <Carousel className="relative w-full overflow-hidden rounded-2xl">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[60vh] w-full">
                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
                  <h1 className="mb-4 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
                    {slide.title}
                  </h1>
                  <p className="mb-6 max-w-2xl text-base text-gray-200 md:text-lg">
                    {slide.description}
                  </p>
                  <Button asChild size="lg" className="px-8">
                    <Link href={index === 1 ? "/register" : "/tutors"}>
                      {slide.cta}
                    </Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Controls */}
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
}
