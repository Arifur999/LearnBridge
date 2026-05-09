import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, CheckCircle } from "lucide-react";

const perks = [
  "Set your own hourly rate",
  "Manage your own schedule",
  "Reach thousands of students",
  "Get ratings and grow your brand",
];

export default function TrainerCTA() {
  return (
    <section className="bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-800 py-20 text-white">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4 inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <GraduationCap className="mr-2 size-4" />
              For Educators
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Want to Teach on SkillBridge?
            </h2>
            <p className="mb-6 text-lg text-white/85">
              Share your knowledge, set your own availability, and earn by
              teaching thousands of motivated students.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white font-semibold text-indigo-700 hover:bg-white/90"
            >
              <Link href="/register">Become a Tutor Today</Link>
            </Button>
          </div>

          <div className="w-full max-w-xs rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
            <p className="mb-4 font-semibold text-white/90">What you get:</p>
            <ul className="space-y-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-sm text-white/85">
                  <CheckCircle className="size-4 shrink-0 text-green-300" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
