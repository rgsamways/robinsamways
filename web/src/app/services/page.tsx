import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import SectionFilterBar from "@/components/SectionFilterBar";

export const metadata: Metadata = {
  title: "Services · Robin Samways",
};

export default function ServicesPage() {
  const sections = [
    {
      id: "web-sites",
      label: "Web Sites",
      node: (
        <section>
          <SectionHeader title="WEB_SITES" />
          <p className="mb-4 text-sm leading-relaxed">
            A straightforward, hosted website — three starting packages,
            described below. Exact scope and pricing are worked out per
            project; get in touch and I&rsquo;ll follow up with a quote.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="border border-foreground/20 p-4">
              <h3 className="text-sm font-bold text-accent">Starter</h3>
              <p className="mt-2 text-sm leading-relaxed">
                A small brochure or portfolio presence — a handful of pages,
                mobile-responsive, a contact form, deployed and hosted.
              </p>
            </div>
            <div className="border border-foreground/20 p-4">
              <h3 className="text-sm font-bold text-accent">Standard</h3>
              <p className="mt-2 text-sm leading-relaxed">
                A growing business site — more pages, basic content updates,
                on-page SEO basics, and simple third-party integrations like
                booking or email.
              </p>
            </div>
            <div className="border border-foreground/20 p-4">
              <h3 className="text-sm font-bold text-accent">Advanced</h3>
              <p className="mt-2 text-sm leading-relaxed">
                A fully custom site — bespoke design and interactivity,
                deeper integrations such as payments or scheduling, and
                performance/SEO tuning.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            <Link href="/" className="text-accent underline">
              Get in touch about a Web Sites project
            </Link>
          </p>
        </section>
      ),
    },
    {
      id: "web-applications",
      label: "Web Applications",
      node: (
        <section>
          <SectionHeader title="WEB_APPLICATIONS" />
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              More than a website, less than a full platform: logged-in
              accounts, a real database-backed backend, and custom business
              logic or dashboards built around how your business actually
              works, not a generic template.
            </p>
            <p>
              This site is itself an example of the pattern — spec-driven,
              tested, and deployed on real infrastructure (Next.js on
              Vercel, FastAPI and Postgres on Railway). Farpost Pulse, one
              of the pieces showcased on this site&rsquo;s{" "}
              <Link href="/farpost" className="text-accent underline">
                Farpost hub
              </Link>
              , is another: a real Node.js/Azure Functions backend with its
              own database, dashboards, and coaching logic.
            </p>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            <Link href="/" className="text-accent underline">
              Get in touch about a web application
            </Link>
          </p>
        </section>
      ),
    },
    {
      id: "native-applications",
      label: "Native Applications",
      node: (
        <section>
          <SectionHeader title="NATIVE_APPLICATIONS" />
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Native Android development — my current mobile focus (not
              iOS). A real device app when a browser tab isn&rsquo;t the
              right fit: offline capability, hardware access like NFC/RFID,
              or a genuinely native feel.
            </p>
            <p>
              TapLog, an Android RFID-verification app built as part of{" "}
              <Link href="/farpost" className="text-accent underline">
                Farpost&rsquo;s own origin story
              </Link>
              , is a direct example. So is the native, production-line
              mobile software built at Padre Software, deployed onsite at
              manufacturing facilities across Canada and the United States.
            </p>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            <Link href="/" className="text-accent underline">
              Get in touch about a native app
            </Link>
          </p>
        </section>
      ),
    },
    {
      id: "platform",
      label: "Platform",
      node: (
        <section>
          <SectionHeader title="PLATFORM" />
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Larger builds — real platforms, not single apps: multiple
              services, third-party integrations, and cloud infrastructure
              wired together to run a business, not just present it.
            </p>
            <p>
              <Link href="/farpost" className="text-accent underline">
                Farpost
              </Link>{" "}
              itself is the running example — a full-stack building-
              intelligence platform with its own dispatch engine, payments,
              and NFC-anchored records. Across this site&rsquo;s portfolio
              pieces, that same pattern shows up as real, demonstrated
              integrations with Salesforce, Stripe, Twilio, and Azure — not
              just claimed on a resume.
            </p>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            <Link href="/" className="text-accent underline">
              Get in touch about a platform build
            </Link>
          </p>
        </section>
      ),
    },
    {
      id: "hourly",
      label: "Hourly",
      node: (
        <section>
          <SectionHeader title="HOURLY" />
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Contract or hourly work against an existing codebase — bug
              fixes, feature work, or ongoing support for a project
              that&rsquo;s already live. No new build required to get
              started.
            </p>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            <Link href="/" className="text-accent underline">
              Get in touch about hourly/contract rates
            </Link>
          </p>
        </section>
      ),
    },
    {
      id: "field-documentation",
      label: "Field Documentation",
      node: (
        <section>
          <SectionHeader title="FIELD_DOCUMENTATION" />
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Solo drone and ground-level property documentation for the
              North Hastings region — Transport Canada Basic RPAS
              certified, flown on a DJI Mini 4 Pro. The same real-world
              documentation work behind{" "}
              <Link href="/farpost" className="text-accent underline">
                Farpost
              </Link>
              &rsquo;s own building records.
            </p>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            <a
              href="https://field.farpost.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Book field documentation at field.farpost.ca
            </a>
          </p>
        </section>
      ),
    },
  ];

  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Services
      </h1>
      <p className="mt-2 text-sm text-muted">
        Independent developer available for freelance and contract work —
        from a small brochure site to a full custom platform.
      </p>

      <SectionFilterBar sections={sections} ariaLabel="filter services sections" />
    </main>
  );
}
