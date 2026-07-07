import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import Callout from "@/components/ops/Callout";
import CodeBlock from "@/components/ops/CodeBlock";
import Steps from "@/components/ops/Steps";
import DnsTable from "@/components/ops/DnsTable";

export const metadata: Metadata = {
  title: "Deployment Runbook · Robin Samways",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DeployRunbookPage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Going live: robinsamways.ca
        deployment manual
      </h1>
      <p className="mt-2 text-sm text-muted">
        A complete, ordered runbook for taking robinsamways.ca from a local
        repo to a live, production site across five services: GoDaddy,
        Cloudflare, Vercel, Railway, and Resend. Written so it can be followed
        start to finish, or handed to someone else to execute.
      </p>
      <p className="mt-1 text-sm text-muted">Last updated: 2026-07-07.</p>

      <section>
        <SectionHeader title="PREREQUISITES" />
        <Steps
          items={[
            <>
              <strong>GoDaddy</strong> account — owns both domains (
              <code>robinsamways.ca</code>, <code>robinsamways.com</code>)
            </>,
            <>
              <strong>Cloudflare</strong> account — same one already used for{" "}
              <code>farpost.ca</code>
            </>,
            <>
              <strong>Vercel</strong> account, connected to the GitHub account
              hosting this repo
            </>,
            <>
              <strong>Railway</strong> account, connected to the same GitHub
              account
            </>,
            <>
              <strong>Resend</strong> account (new — for outbound
              transactional email)
            </>,
            <>
              Repo pushed to GitHub with <code>/api</code> and <code>/web</code>{" "}
              at the root
            </>,
          ]}
        />
      </section>

      <section>
        <SectionHeader title="PART_1_DNS_CUTOVER" />
        <p className="-mt-2 mb-3 text-sm font-bold">
          Move robinsamways.ca&rsquo;s DNS to Cloudflare
        </p>
        <Steps
          items={[
            <>
              In Cloudflare, <strong>Add a site</strong> → enter{" "}
              <code>robinsamways.ca</code>. Choose the Free plan.
            </>,
            <>
              Cloudflare scans the domain&rsquo;s existing DNS records at
              GoDaddy and shows them for review. Note anything worth
              preserving — in this case there&rsquo;s nothing critical yet,
              since email is being rebuilt from scratch in Part 6.
            </>,
            <>
              Cloudflare assigns two nameservers (unique per account, shown
              on screen — something like <code>xxx.ns.cloudflare.com</code>).
            </>,
            <>
              In GoDaddy: <strong>My Domains → robinsamways.ca → DNS →
              Nameservers → Change</strong>{" "}
              → select &quot;Custom&quot; → enter Cloudflare&rsquo;s two
              nameservers → Save.
            </>,
            <>
              Wait for propagation. Cloudflare emails you once it detects the
              delegation and marks the zone <strong>Active</strong> — usually
              well under an hour, occasionally up to 24–48h.
            </>,
          ]}
        />
        <Callout>
          Nothing else in this guide can proceed until this zone shows{" "}
          <strong>Active</strong> in Cloudflare, since every later step adds
          records to it.
        </Callout>
      </section>

      <section>
        <SectionHeader title="PART_2_COM_FORWARDING" />
        <p className="-mt-2 mb-3 text-sm font-bold">
          robinsamways.com: forwarding only
        </p>
        <p className="text-sm leading-relaxed">
          <code>robinsamways.com</code>{" "}
          never touches Cloudflare, Vercel, or Railway — it&rsquo;s a pure
          redirect, handled entirely inside GoDaddy.
        </p>
        <Steps
          items={[
            <>
              GoDaddy → <strong>My Domains → robinsamways.com → Forwarding →
              Add Forwarding</strong>.
            </>,
            <>
              Forward to <code>https://robinsamways.ca</code>.
            </>,
            <>
              Forward type: <strong>Permanent (301)</strong>.
            </>,
            <>
              Setting: <strong>Forward only</strong> (not masked — the
              address bar should show <code>robinsamways.ca</code>, not hide
              behind <code>.com</code>).
            </>,
            <>Save. Test in a private/incognito window once it takes effect.</>,
          ]}
        />
      </section>

      <section>
        <SectionHeader title="PART_3_VERCEL_DEPLOY" />
        <p className="-mt-2 mb-3 text-sm font-bold">Deploy /web to Vercel</p>
        <Steps
          items={[
            <>
              Vercel → <strong>Add New → Project</strong> → import the repo
              from GitHub.
            </>,
            <>
              Set <strong>Root Directory</strong> to <code>web</code>.
            </>,
            <>
              Framework preset should auto-detect as <strong>Next.js</strong>{" "}
              — leave build/output settings on their defaults (this was a
              specific goal of the <code>web-foundation</code> spec:
              zero-config deploy).
            </>,
            <>
              No environment variables are required yet — the homepage
              content is hardcoded, not fetched from the API. (Note for
              later: if <code>/web</code> ever calls <code>/api</code>{" "}
              directly, e.g. for a live Salesforce-backed feature, that&rsquo;s
              when a <code>NEXT_PUBLIC_API_URL</code> variable gets added
              here.)
            </>,
            <>
              Deploy. Confirm the generated <code>*.vercel.app</code> preview
              URL loads the homepage correctly before touching DNS.
            </>,
            <>
              Project → <strong>Settings → Domains</strong> → add{" "}
              <code>robinsamways.ca</code> and <code>www.robinsamways.ca</code>.
            </>,
            <>
              Vercel displays the exact DNS records it needs (typically an{" "}
              <code>A</code> record for the apex and a <code>CNAME</code> for{" "}
              <code>www</code>). <strong>Use whatever Vercel shows on screen
              at setup time</strong> — the values below are illustrative and
              can change:
            </>,
          ]}
        />
        <DnsTable
          rows={[
            { type: "A", name: "@", value: "(IP Vercel displays)" },
            { type: "CNAME", name: "www", value: "cname.vercel-dns.com" },
          ]}
        />
        <Steps
          items={[
            <>
              Add both records in Cloudflare&rsquo;s DNS tab. Set them to{" "}
              <strong>DNS only</strong>{" "}
              (grey cloud, not proxied) for the initial setup — this lets
              Vercel issue and manage its own SSL certificate without
              Cloudflare&rsquo;s proxy in the way. Proxying can be turned on
              later for CDN/DDoS benefits once the domain is confirmed
              stable.
            </>,
            <>
              Wait a few minutes for Vercel to verify the domain and issue a
              certificate automatically.
            </>,
            <>
              Visit <code>https://robinsamways.ca</code> — should load with a
              valid padlock.
            </>,
          ]}
        />
      </section>

      <section>
        <SectionHeader title="PART_4_RAILWAY_POSTGRES" />
        <p className="-mt-2 mb-3 text-sm font-bold">
          Deploy /api + Postgres to Railway
        </p>
        <Steps
          items={[
            <>
              Railway → <strong>New Project → Deploy from GitHub repo</strong>{" "}
              → select this repo.
            </>,
            <>
              Set the service&rsquo;s <strong>Root Directory</strong> to{" "}
              <code>api</code>.
            </>,
            <>
              Railway detects Python via <code>requirements.txt</code> and
              uses the <code>Procfile</code>&rsquo;s start command (
              <code>uvicorn app.main:app --host 0.0.0.0 --port $PORT</code>)
              — no manual build config needed.
            </>,
            <>
              In the same Railway project, <strong>add a Postgres
              service</strong>{" "}
              from Railway&rsquo;s plugin catalog. This provisions a managed
              Postgres instance and generates connection variables (
              <code>PGHOST</code>, <code>PGPORT</code>,{" "}
              <code>PGUSER</code>, <code>PGPASSWORD</code>,{" "}
              <code>PGDATABASE</code>, and a <code>DATABASE_URL</code>).
            </>,
          ]}
        />
        <Callout>
          <strong>Gotcha:</strong> Railway&rsquo;s own <code>DATABASE_URL</code>{" "}
          uses the <code>postgresql://</code> scheme. Our API&rsquo;s{" "}
          <code>api/app/db.py</code> builds an async SQLAlchemy engine and
          expects <code>postgresql+asyncpg://</code> (see{" "}
          <code>api/.env.example</code>). Don&rsquo;t wire Railway&rsquo;s{" "}
          <code>DATABASE_URL</code>{" "}
          straight through — it&rsquo;ll fail to boot with a &quot;can&apos;t
          load plugin: sqlalchemy.dialects:postgresql.None&quot; style
          error.
        </Callout>
        <Steps
          items={[
            <>
              On the <strong>api</strong> service, set an explicit{" "}
              <code>DATABASE_URL</code>{" "}
              environment variable using Railway&rsquo;s variable-reference
              syntax, built with the correct scheme:
            </>,
          ]}
        />
        <CodeBlock>
          {
            "DATABASE_URL=postgresql+asyncpg://${{Postgres.PGUSER}}:${{Postgres.PGPASSWORD}}@${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}"
          }
        </CodeBlock>
        <Steps
          items={[
            <>
              Deploy. Watch the build logs, then hit the generated{" "}
              <code>*.up.railway.app/health</code> URL — should return{" "}
              <code>{'{"status":"ok","database":"ok"}'}</code>.
            </>,
            <>
              Service → <strong>Settings → Networking → Custom Domain</strong>{" "}
              → add <code>api.robinsamways.ca</code>. Railway shows a CNAME
              target.
            </>,
            <>
              Add that CNAME in Cloudflare, again <strong>DNS only</strong>{" "}
              initially, same reasoning as Vercel.
            </>,
            <>
              Wait for Railway to verify and issue a certificate, then
              confirm <code>https://api.robinsamways.ca/health</code> returns
              200 against the real production database.
            </>,
          ]}
        />
      </section>

      <section>
        <SectionHeader title="PART_5_POSTGRES_VERIFICATION" />
        <p className="-mt-2 mb-3 text-sm font-bold">
          Postgres: what&rsquo;s automatic vs. what to watch
        </p>
        <Steps
          items={[
            <>
              <code>api/app/db.py</code>&rsquo;s <code>init_db()</code> calls{" "}
              <code>SQLModel.metadata.create_all()</code>{" "}
              on startup, which auto-creates tables. That&rsquo;s fine for
              the current
              single-table <code>Ping</code> skeleton, but{" "}
              <strong>not a substitute for real migrations</strong> once
              actual business tables show up (e.g. from the Salesforce
              integration change) — auto-create can silently drop or fail to
              alter existing columns. Alembic is the natural next step at
              that point, not now.
            </>,
            <>
              Worth a manual double-check beyond <code>/health</code>:
              Railway&rsquo;s dashboard has a <strong>Connect</strong> button
              that gives a ready-to-paste <code>psql</code> command. Run it
              and <code>\dt</code> to confirm the expected table actually
              exists in production, not just that the connection succeeds.
            </>,
          ]}
        />
      </section>

      <section>
        <SectionHeader title="PART_6_EMAIL" />
        <p className="-mt-2 mb-3 text-sm font-bold">
          Email: Cloudflare Email Routing (inbound) + Resend (outbound)
        </p>
        <p className="text-sm leading-relaxed">
          Moving the domain&rsquo;s nameservers to Cloudflare replaces
          whatever GoDaddy was doing for mail, so both directions need to be
          set up explicitly — nothing here is automatic.
        </p>

        <h3 className="mt-4 font-bold">
          6a. Inbound — Cloudflare Email Routing (free)
        </h3>
        <Steps
          items={[
            <>
              <strong>
                Delete any leftover mail records from the old registrar
                first.
              </strong>{" "}
              If GoDaddy was previously handling mail for the domain (even
              just default parking records), it will have left{" "}
              <code>MX</code> records pointing at{" "}
              <code>smtp.secureserver.net</code> /{" "}
              <code>mailstore1.secureserver.net</code>. These conflict with
              Cloudflare Email Routing and must be deleted from
              Cloudflare&rsquo;s DNS Records page before enabling routing —
              search the records list by type <code>MX</code> to find them.
            </>,
            <>
              Cloudflare → <code>robinsamways.ca</code> →{" "}
              <strong>Email → Email Routing → Enable</strong>. Cloudflare
              adds the necessary MX and SPF/TXT records to the zone
              automatically.
            </>,
            <>
              Add a routing rule: <code>robin@robinsamways.ca</code> (or
              whatever address is wanted) → <strong>forward to</strong>{" "}
              <code>rgsamways@gmail.com</code>.
            </>,
            <>
              Cloudflare sends a verification email to the Gmail address —
              confirm it.
            </>,
          ]}
        />
        <Callout>
          <strong>Gotcha (as of mid-2026):</strong>{" "}
          Cloudflare&rsquo;s new Email Routing UI can leave routing
          &quot;Disabled&quot; even after rules/destinations are configured.
          The Overview page may show a routing rule, a destination address,
          and a domain all configured, yet &quot;Routing status:
          Disabled&quot; — the new UI&rsquo;s own banner admits it&rsquo;s
          incomplete (&quot;You&rsquo;re now using the new Email Routing
          UI... being retired&quot;), and its Settings → DNS records
          sub-page shows records marked &quot;Locked&quot; that aren&rsquo;t
          actually live. If this happens: click{" "}
          <strong>&quot;Use the old UI&quot;</strong>{" "}
          (link at the top of the page) → find the{" "}
          <strong>&quot;Get started with Email Routing&quot;</strong>{" "}
          wizard → click{" "}
          <strong>&quot;Add records and enable&quot;</strong>. That&rsquo;s
          the action that actually writes the MX/TXT records and flips
          status to Enabled — the new UI&rsquo;s setup does not reliably do
          this on its own.
        </Callout>
        <Steps
          items={[
            <>
              Test by sending a real email to the new address and confirming
              it lands in Gmail.{" "}
              <strong>
                Use an account other than the one it forwards to.
              </strong>{" "}
              Sending the test from the same Gmail account the address
              forwards to (a self-addressed loop through a third-party
              relay) can be silently dropped by Gmail with no bounce and no
              spam-folder trace, even when Cloudflare&rsquo;s Activity Log
              shows the message as successfully &quot;Forwarded&quot; with
              SPF/DKIM/ARC all passing — Gmail&rsquo;s own downstream
              filtering is the opaque part, not Cloudflare&rsquo;s relay.
              Test from a different mailbox to get a real signal.
            </>,
          ]}
        />

        <h3 className="mt-6 font-bold">
          6b. Outbound — Resend (transactional email API)
        </h3>
        <p className="mt-1 text-sm leading-relaxed">
          For anything the site or API needs to <em>send</em>{" "}
          programmatically later — a contact form, a notification — not
          needed by anything currently built, but worth setting up now so the
          domain is pre-verified when that feature arrives.
        </p>
        <Steps
          items={[
            <>Sign up at Resend, create an API key.</>,
            <>
              Add a <strong>sending domain</strong>. Recommend a subdomain
              like <code>mail.robinsamways.ca</code> rather than the bare
              domain, so transactional-mail reputation stays separate from
              personal inbound mail on the apex.
            </>,
            <>
              Resend provides DNS records to add: an SPF <code>TXT</code>{" "}
              record, a handful of DKIM <code>CNAME</code> records, and
              optionally a DMARC <code>TXT</code> record. Add all of them in
              Cloudflare.
            </>,
            <>
              Wait for Resend to mark the domain <strong>Verified</strong>{" "}
              (Cloudflare&rsquo;s fast propagation usually makes this quick).
            </>,
            <>
              Store the API key as a Railway environment variable on the{" "}
              <strong>api</strong> service (<code>RESEND_API_KEY</code>) —
              never commit it to the repo. Add a placeholder line to{" "}
              <code>api/.env.example</code> only.
            </>,
            <>
              No send-email code exists in <code>/api</code> yet — this step
              just gets the account and domain pre-verified so a future
              feature can start sending immediately without a DNS detour.
            </>,
          ]}
        />
      </section>

      <section>
        <SectionHeader title="PART_7_VERIFICATION_CHECKLIST" />
        <p className="-mt-2 mb-3 text-sm font-bold">
          End-to-end verification checklist
        </p>
        <Callout>
          <ul className="space-y-1.5">
            <li className="flex gap-2">
              <span aria-hidden>☐</span>
              <span>
                <code>https://robinsamways.ca</code> loads the homepage with
                a valid SSL padlock
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>☐</span>
              <span>
                <code>https://www.robinsamways.ca</code> loads correctly
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>☐</span>
              <span>
                <code>https://robinsamways.com</code> 301-redirects to{" "}
                <code>https://robinsamways.ca</code>
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>☐</span>
              <span>
                <code>https://api.robinsamways.ca/health</code> returns 200
                with <code>database: ok</code> against <strong>
                  production
                </strong>{" "}
                Postgres
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>☐</span>
              <span>
                Menu navigation works in production (Portfolio / Farpost /
                Dev Log placeholder routes)
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>☐</span>
              <span>
                A test email to <code>robin@robinsamways.ca</code> arrives in
                Gmail
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>☐</span>
              <span>Resend shows the sending domain as Verified</span>
            </li>
          </ul>
        </Callout>
      </section>

      <section>
        <SectionHeader title="PART_8_TROUBLESHOOTING" />
        <Callout>
          <ul className="space-y-3">
            <li className="flex gap-2">
              <span aria-hidden>›</span>
              <span>
                <strong>DNS not resolving after the nameserver change:</strong>{" "}
                can take up to 48h though it&rsquo;s usually much faster.
                Cloudflare&rsquo;s dashboard shows <strong>Active</strong>{" "}
                once it recognizes the delegation — check there before
                assuming something&rsquo;s broken.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>›</span>
              <span>
                <strong>
                  Vercel/Railway domain stuck on &quot;pending
                  verification&quot;:
                </strong>{" "}
                re-check the exact record type/value the platform is
                currently asking for (they can differ from what&rsquo;s
                documented here) and confirm Cloudflare isn&rsquo;t proxying
                (orange cloud) if the platform expects direct DNS-only
                resolution.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>›</span>
              <span>
                <strong>
                  API fails to boot on Railway with a dialect/driver error:
                </strong>{" "}
                almost certainly the <code>DATABASE_URL</code> scheme
                mismatch from Part 4 — confirm it starts with{" "}
                <code>postgresql+asyncpg://</code>, not{" "}
                <code>postgresql://</code>.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>›</span>
              <span>
                <strong>Reverting:</strong>{" "}
                nameservers can be pointed back to GoDaddy&rsquo;s defaults at
                any time from GoDaddy&rsquo;s DNS settings. Vercel/Railway
                deployments can be deleted without affecting the domain until
                DNS is repointed away from them.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>›</span>
              <span>
                <strong>
                  Test email to the routed address never arrives, no bounce,
                  no spam folder trace, and Cloudflare&rsquo;s Activity Log
                  shows it as &quot;Forwarded&quot; with SPF/DKIM/ARC
                  passing:
                </strong>{" "}
                this is very likely the self-send loop described in Part 6a,
                not a Cloudflare problem — Gmail can silently drop mail that
                appears to loop back to the same account via a third-party
                relay. Re-test from a different mailbox before assuming
                anything is broken.
              </span>
            </li>
          </ul>
        </Callout>
      </section>

      <footer className="mt-12 border-t border-foreground/20 pt-4 text-xs text-muted">
        <span>// source of truth: docs/deployment-guide.md</span>
      </footer>
    </main>
  );
}
