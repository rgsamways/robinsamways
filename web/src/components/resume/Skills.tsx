const skillRows = [
  { label: "languages", values: ["Python", "TypeScript", "JavaScript"] },
  { label: "frameworks", values: ["FastAPI", "React", "Next.js"] },
  { label: "data", values: ["MongoDB", "PostgreSQL", "NoSQL", "ML / Data"] },
  {
    label: "infra",
    values: ["REST APIs", "Microservices", "Docker", "AWS", "Railway", "Cloudflare"],
  },
  { label: "practice", values: ["Git", "Agile", "Mobile Dev", "UI/UX", "NFC", "Geospatial"] },
];

export default function Skills() {
  return (
    <div className="border-l-4 border-accent bg-skills-bg px-4 py-3 text-sm">
      {skillRows.map((row) => (
        <div key={row.label} className="flex gap-4 py-0.5">
          <span className="w-24 shrink-0 font-semibold text-accent">{row.label}</span>
          <span>{row.values.join(" · ")}</span>
        </div>
      ))}
    </div>
  );
}
