import SectionHeader from "./SectionHeader";

const subjects = [
  "Programming",
  "Mathematics",
  "Design",
  "Data Skills",
  "Science",
  "Business",
  "Languages",
  "Exam Prep",
  "Writing",
  "Career Skills",
];

export default function TrustedPartners() {
  const doubled = [...subjects, ...subjects];

  return (
    <section className="overflow-hidden border-y bg-muted/20 py-20 dark:bg-muted/15">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          label="Browse by Interest"
          title="Subjects learners return to"
          description="The platform stays practical: start with the topic you need today, then widen the path from there."
          centered
        />
      </div>

      <div className="relative">
        {/* Gradient fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />

        <div className="animate-marquee gap-6 px-6" style={{ width: "max-content" }}>
          {doubled.map((subject, i) => (
            <div
              key={`${subject}-${i}`}
              className="mx-3 inline-flex min-w-[160px] cursor-default items-center justify-center border bg-background/90 px-6 py-4 shadow-sm transition-all hover:border-primary/30 hover:bg-background hover:shadow-md dark:bg-card/80"
            >
              <span className="text-sm font-semibold text-foreground">
                {subject}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
