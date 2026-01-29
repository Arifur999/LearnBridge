export default function Stats() {
  const stats = [
    { label: "Students", value: "10K+" },
    { label: "Courses", value: "500+" },
    { label: "Trainers", value: "120+" },
    { label: "Success Rate", value: "95%" },
  ];

  return (
    <section className="bg-muted py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="text-center">
            <h3 className="text-3xl font-extrabold">{item.value}</h3>
            <p className="text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
