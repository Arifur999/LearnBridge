"use client";

import { useEffect, useRef, useState } from "react";
import { Users, BookOpen, GraduationCap } from "lucide-react";

const stats = [
  { icon: Users, value: 500, suffix: "+", label: "Expert Tutors", color: "bg-primary/10 text-primary" },
  { icon: BookOpen, value: 10000, suffix: "+", label: "Sessions Completed", color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
  { icon: GraduationCap, value: 50, suffix: "+", label: "Subjects Available", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { rootMargin: "-100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="text-4xl font-bold tracking-tight">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="py-20 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(({ icon: Icon, value, suffix, label, color }) => (
            <div
              key={label}
              className="relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl bg-background p-8 shadow-sm ring-1 ring-border hover:shadow-md hover:-translate-y-0.5 transition-[box-shadow,transform] duration-300"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-primary/20 rounded-t-2xl" />
              <div className={`flex size-14 items-center justify-center rounded-full ${color}`}>
                <Icon className="size-7" />
              </div>
              <Counter target={value} suffix={suffix} />
              <p className="text-center text-muted-foreground font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
