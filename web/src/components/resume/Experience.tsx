import Farpost from "@/components/Farpost";

type Role = {
  title: string;
  company: string;
  isFarpost?: boolean;
  location: string;
  dates: string;
  bullets: string[];
};

const roles: Role[] = [
  {
    title: "Founder & Lead Developer",
    company: "Farpost",
    isFarpost: true,
    location: "Maynooth, ON",
    dates: "2025 — Present",
    bullets: [
      "Architected and shipped a full-stack building-intelligence platform: FastAPI / Python backend (deployed on Railway), React / Next.js front end, and NFC-anchored pre-loss property documentation",
      "Designed the event-driven data model and professional-reputation graph serving adjusters, inspectors, contractors, agents, and building owners",
      "Built Stripe Connect payments with an application-fee revenue model; drove design and build through a CLI-based, spec-driven workflow",
      "Operate Farpost Field Documentation — solo drone and ground-level capture for the North Hastings region (Transport Canada Basic RPAS certified, DJI Mini 4 Pro)",
    ],
  },
  {
    title: "Senior Application Developer",
    company: "Impres Pharma",
    location: "Cambridge, ON",
    dates: "2012 — 2025",
    bullets: [
      "Lead developer of a proprietary web-based CRM for pharmaceutical sales and marketing operations across Canada",
      "Integrated Google Maps, email, PDF, fax, VOIP, Quickbase, and AWS across a multi-module platform",
      "Built offline-capable field applications for representatives working in low-connectivity environments",
      "Team lead managing the full product lifecycle across 13 years of continuous operation",
    ],
  },
  {
    title: "Senior Application Developer",
    company: "FileTrack Solutions",
    location: "Waterloo, ON",
    dates: "2009 — 2012",
    bullets: [
      "Developed RFID-based file-tracking and warehousing systems for law offices and sensitive-records facilities",
      "Built front-end applications on ASP.NET Web Forms with JavaScript and Microsoft SQL Server; integrated document-management (DMS) workflows",
    ],
  },
  {
    title: "Senior Developer",
    company: "Padre Software",
    location: "Waterloo, ON",
    dates: "2004 — 2009",
    bullets: [
      "Maintained and extended integrated legacy applications for Toyota's shop-floor environment",
      "Deployed onsite at manufacturing facilities across Canada and the United States",
      "Developed and maintained native mobile applications for production-line environments",
    ],
  },
  {
    title: "Junior / Intermediate Developer",
    company: "Concept Interactive",
    location: "Cambridge, ON",
    dates: "2001 — 2004",
    bullets: [
      "Deployed and customized Plumtree portal software for Union Gas (lead role)",
      "Integrated Microsoft Content Management Server for the Municipality of Chatham-Kent",
      "Integrated multiple portal platforms for Deloitte & Touche; achieved Microsoft .NET certification in web-based development",
    ],
  },
  {
    title: "Instructor — Web Development",
    company: "George Brown College, Toronto",
    location: "",
    dates: "c. 2000",
    bullets: [
      "Designed and taught a hands-on web-development course covering Microsoft FrontPage, JavaScript, and CSS",
      "Guided students through building a complete demonstration website that exercised the platform's core features end to end",
    ],
  },
];

export default function Experience() {
  return (
    <div className="space-y-8">
      {roles.map((role) => (
        <div key={`${role.company}-${role.dates}`}>
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h3 className="font-bold">{role.title}</h3>
              <p className="text-sm text-muted">
                {role.isFarpost ? <Farpost /> : role.company}
                {role.location ? ` · ${role.location}` : ""}
              </p>
            </div>
            <span className="shrink-0 text-sm text-accent">{role.dates}</span>
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {role.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span aria-hidden>›</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
