import SectionHeader from "./SectionHeader";

const partners = [
  { name: "Coursera", color: "#0056D2" },
  { name: "Udemy", color: "#A435F0" },
  { name: "edX", color: "#02262B" },
  { name: "Khan Academy", color: "#14BF96" },
  { name: "freeCodeCamp", color: "#0A0A23" },
  { name: "Codecademy", color: "#1F4056" },
  { name: "LinkedIn Learning", color: "#0A66C2" },
  { name: "Duolingo", color: "#58CC02" },
  { name: "Skillshare", color: "#00B17D" },
  { name: "Pluralsight", color: "#F15B2A" },
  { name: "MasterClass", color: "#1A1A1A" },
  { name: "Alison", color: "#007B5E" },
];

export default function TrustedPartners() {
  const doubled = [...partners, ...partners];

  return (
    <section className="overflow-hidden py-20 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          label="Trusted By"
          title="Our Ecosystem Partners"
          description="Recognized and integrated with the world's leading learning platforms."
          centered
        />
      </div>

      <div className="relative">
        {/* Gradient fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />

        <div className="animate-marquee gap-6 px-6" style={{ width: "max-content" }}>
          {doubled.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="inline-flex min-w-[160px] cursor-default items-center justify-center rounded-xl border bg-background px-6 py-4 mx-3 shadow-sm transition-all hover:shadow-md hover:border-primary/30 hover:grayscale-0 grayscale"
            >
              <span className="text-sm font-semibold" style={{ color: p.color }}>
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
