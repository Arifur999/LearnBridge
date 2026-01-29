"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <Carousel className="w-full">
        <CarouselContent>
          {[1, 2, 3].map((item) => (
            <CarouselItem key={item}>
              <div className="flex h-[300px] items-center justify-center rounded-xl bg-muted text-4xl font-bold">
                Slide {item}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
