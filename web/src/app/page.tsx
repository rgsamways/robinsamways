import Farpost from "@/components/Farpost";
import SectionHeader from "@/components/SectionHeader";
import ContactForm from "@/components/resume/ContactForm";
import Experience from "@/components/resume/Experience";
import Skills from "@/components/resume/Skills";

export default function Home() {
  return (
    <main>
      <section>
        <SectionHeader title="PROFILE" />
        <p className="text-sm leading-relaxed">
          Senior application developer with 25 years building production-grade
          software across pharmaceutical, automotive, industrial, and
          municipal sectors — now founder and sole developer of <Farpost />, a
          rural Ontario building-intelligence platform. Architect of
          enterprise CRM and integration systems. Independent remote developer
          since 2009, currently shipping full-stack SaaS with Python, FastAPI,
          and modern cloud infrastructure.
        </p>
      </section>

      <section>
        <SectionHeader title="EXPERIENCE" />
        <Experience />
      </section>

      <section>
        <SectionHeader title="SKILLS" />
        <Skills />
      </section>

      <section>
        <SectionHeader title="EDUCATION" />
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-bold">
              Diploma — Computer Programmer / Analyst
            </h3>
            <p className="text-sm text-muted">
              George Brown College, Toronto · 1999–2001
            </p>
            <p className="mt-1 text-sm">
              Graduated top 5% of class · completed the 3-year program in 2
              years
            </p>
          </div>
          <div>
            <h3 className="font-bold">Bachelor of Arts — Geography</h3>
            <p className="text-sm text-muted">
              University of Windsor · 1993–1998
            </p>
            <p className="mt-1 text-sm">
              Environmental Resource Management · minor in Geology ·
              coursework in climatology, hydrogeology, mineralogy &amp;
              sedimentology
            </p>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="CONTINUING_EDUCATION" />
        <p className="text-sm text-accent">University of Waterloo · 2025–2026</p>
        <p className="mt-1 text-sm">
          Python for Machine Learning · Supervised ML · Unsupervised ML ·
          Python for Health Data · Back-End Frameworks &amp; Architecture ·
          Security, DB Design &amp; Concurrency · Cloud Services
        </p>
      </section>

      <section>
        <SectionHeader title="CONTACT" />
        <ContactForm />
      </section>

      <footer className="mt-12 flex flex-wrap justify-between gap-2 border-t border-foreground/20 pt-4 text-xs text-muted">
        <span>// 25 yrs · independent remote developer since 2009</span>
        <span>EN native · FR novice</span>
      </footer>
    </main>
  );
}
