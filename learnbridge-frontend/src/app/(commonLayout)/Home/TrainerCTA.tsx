import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TrainerCTA() {
  return (
    <section className="bg-primary py-20 text-white">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">
          Want to Teach on SkillBridge?
        </h2>
        <p className="mb-6 opacity-90">
          Share your knowledge and earn by teaching thousands of students.
        </p>
        <Button asChild variant="secondary">
          <Link href="/register">Become a Tutor</Link>
        </Button>
      </div>
    </section>
  );
}
