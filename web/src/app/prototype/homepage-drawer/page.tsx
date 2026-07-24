import Farpost from "@/components/Farpost";
import ChatBubble from "@/components/prototype/ChatBubble";
import ComparisonCards from "@/components/prototype/ComparisonCards";
import ConceptBlock from "@/components/prototype/ConceptBlock";
import ContentSurface from "@/components/prototype/ContentSurface";
import DrawerNav from "@/components/prototype/DrawerNav";
import QuickRefEntry from "@/components/prototype/QuickRefEntry";
import ReferenceTable from "@/components/prototype/ReferenceTable";
import RightRail from "@/components/prototype/RightRail";
import SectionHeading from "@/components/prototype/SectionHeading";
import ThemeToggleShell from "@/components/prototype/ThemeToggleShell";
import ContactForm from "@/components/resume/ContactForm";
import Experience from "@/components/resume/Experience";
import Skills from "@/components/resume/Skills";

const PAGE_TOC = [
  { id: "profile", label: "Profile" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "continuing-education", label: "Continuing Education" },
  { id: "contact", label: "Contact" },
  { id: "reference-patterns", label: "Reference Patterns (demo)" },
];

const DEPLOY_CHECKS = [
  { check: "Has DNS actually propagated to Cloudflare yet?", command: "dig robinsamways.ca NS" },
  { check: "Is the Vercel deployment actually live?", command: "vercel ls" },
  { check: "Is the API reachable from the browser?", command: "curl https://api.robinsamways.ca/health" },
];

// Mock only — not linked from real site nav. Escapes the root layout's
// centered `max-w-3xl` wrapper with a full-viewport overlay so the drawer
// scaffold from docs/design-system-handoff.md can be reviewed on its own,
// without editing Header.tsx, HamburgerMenu.tsx, or app/page.tsx.
export default function HomepageDrawerMock() {
  return (
    <ThemeToggleShell>
      <div className="mx-auto flex max-w-6xl">
        <DrawerNav pageToc={PAGE_TOC} />

        <main className="min-w-0 flex-1 px-6 pb-10 pt-16 lg:px-10 lg:pt-10">
          <div className="max-w-2xl">
            <ContentSurface>
              <p className="mb-8 rounded-md border border-accent/40 bg-accent/10 px-4 py-2 text-xs text-muted">
                Mock — left-drawer nav scaffold from{" "}
                <code>docs/design-system-handoff.md</code>, homepage content
                dropped in as-is. Not linked from real site nav.
              </p>

              <section id="profile" className="scroll-mt-10">
                <SectionHeading icon="›">Profile</SectionHeading>
                <p className="text-sm leading-relaxed">
                  Senior application developer with 25 years building
                  production-grade software across pharmaceutical,
                  automotive, industrial, and municipal sectors — now founder
                  and sole developer of <Farpost />, a rural Ontario
                  building-intelligence platform. Architect of enterprise CRM
                  and integration systems. Independent remote developer
                  since 2009, currently shipping full-stack SaaS with
                  Python, FastAPI, and modern cloud infrastructure.
                </p>
              </section>

              <section id="experience" className="mt-10 scroll-mt-10">
                <SectionHeading icon="›">Experience</SectionHeading>
                <Experience />
              </section>

              <section id="skills" className="mt-10 scroll-mt-10">
                <SectionHeading icon="›">Skills</SectionHeading>
                <Skills />
              </section>

              <section id="education" className="mt-10 scroll-mt-10">
                <SectionHeading icon="›">Education</SectionHeading>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="font-bold">
                      Diploma — Computer Programmer / Analyst
                    </h3>
                    <p className="text-sm text-muted">
                      George Brown College, Toronto · 1999–2001
                    </p>
                    <p className="mt-1 text-sm">
                      Graduated top 5% of class · completed the 3-year
                      program in 2 years
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold">
                      Bachelor of Arts — Geography
                    </h3>
                    <p className="text-sm text-muted">
                      University of Windsor · 1993–1998
                    </p>
                    <p className="mt-1 text-sm">
                      Environmental Resource Management · minor in Geology ·
                      coursework in climatology, hydrogeology, mineralogy
                      &amp; sedimentology
                    </p>
                  </div>
                </div>
              </section>

              <section id="continuing-education" className="mt-10 scroll-mt-10">
                <SectionHeading icon="›">Continuing Education</SectionHeading>
                <p className="text-sm text-accent">
                  University of Waterloo · 2025–2026
                </p>
                <p className="mt-1 text-sm">
                  Python for Machine Learning · Supervised ML · Unsupervised
                  ML · Python for Health Data · Back-End Frameworks &amp;
                  Architecture · Security, DB Design &amp; Concurrency ·
                  Cloud Services
                </p>
              </section>

              <section id="contact" className="mt-10 scroll-mt-10">
                <SectionHeading icon="›">Contact</SectionHeading>
                <ContactForm />
              </section>

              <section id="reference-patterns" className="mt-10 scroll-mt-10">
                <SectionHeading icon="⚡">Reference Patterns (demo)</SectionHeading>
                <p className="mb-5 text-sm text-muted">
                  Not real site content — a demo of the handoff&rsquo;s
                  Concept / Quick&nbsp;ref / table components
                  (design-system-handoff.md §2), sized to what a future{" "}
                  <span className="text-accent">Ops → Deploy Runbook</span>{" "}
                  page could actually use. The conversation snippet and
                  comparison cards below demo vocare.ca&rsquo;s chat-bubble
                  idiom and farpost.ca&rsquo;s Without/With pattern the same
                  way.
                </p>

                <ConceptBlock>
                  A flapping DNS record right after cutover reads as
                  &ldquo;the site is down&rdquo; to a visitor, but
                  it&rsquo;s usually just propagation lag — check the record
                  before assuming the deploy failed.
                </ConceptBlock>

                <QuickRefEntry
                  desc="Redeploy the API after an environment variable change"
                  code="railway up --service api"
                />

                <ReferenceTable title="Site not loading after a DNS change" rows={DEPLOY_CHECKS} />

                <div className="mb-6">
                  <ChatBubble from="user">
                    I want to talk about something that&rsquo;s been on my
                    mind lately.
                  </ChatBubble>
                  <ChatBubble from="assistant">
                    I&rsquo;m glad you brought that up. Take your time —
                    what&rsquo;s on your mind?
                  </ChatBubble>
                </div>

                <ComparisonCards
                  without={{
                    label: "Without this template",
                    items: [
                      "Recruiters skim past dense resume text",
                      "No way to demo actual code/config work",
                      "Every page reinvents its own layout",
                    ],
                  }}
                  withThis={{
                    label: "With this template",
                    items: [
                      "Structured sections make scanning easy",
                      "Setup galleries and demos show real work",
                      "One shared drawer + content-block system site-wide",
                    ],
                  }}
                />
              </section>

              <footer className="mt-12 flex flex-wrap justify-between gap-2 border-t border-foreground/20 pt-4 text-xs text-muted">
                <span>// 25 yrs · independent remote developer since 2009</span>
                <span>EN native · FR novice</span>
              </footer>
            </ContentSurface>
          </div>
        </main>

        <RightRail />
      </div>
    </ThemeToggleShell>
  );
}
