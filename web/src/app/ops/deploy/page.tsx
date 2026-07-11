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
        repo to a live, production site — the five core services (GoDaddy,
        Cloudflare, Vercel, Railway, Resend), plus each promoted portfolio
        piece&rsquo;s own infrastructure as one gets added (see Part 8).
        Written so it can be followed start to finish, or handed to someone
        else to execute.
      </p>
      <p className="mt-1 text-sm text-muted">
        Last updated: 2026-07-11 (Farpost Atlas deployed live to Railway).
      </p>

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
              <strong>
                Set <code>NEXT_PUBLIC_API_URL</code> ={" "}
                <code>https://api.robinsamways.ca</code> as a Production
                environment variable
              </strong>{" "}
              (Project → Settings → Environment Variables — note this is a
              different page from &quot;Environments&quot;). This became
              required once <code>/web</code> started calling{" "}
              <code>/api</code> directly (first landed with the{" "}
              <code>contact-form</code> change) — without it, the app falls
              back to <code>http://localhost:8000</code>, which fails with a
              CORS error in production.{" "}
              <strong>
                Environment variable changes don&rsquo;t apply to existing
                deployments — trigger a new deploy after adding it.
              </strong>
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
          programmatically — the homepage contact form&rsquo;s notification
          email is the first real user of this (see the{" "}
          <code>contact-form</code> OpenSpec change).
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
              Store the same key on <code>/web</code> only if a build-time
              need arises — as of the <code>contact-form</code> change, only{" "}
              <code>/api</code> sends email, so <code>/web</code> never needs
              this key.
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
                Menu navigation works in production (Home / Method /
                Narrative / Farpost / Dev Log)
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>☐</span>
              <span>
                Once a portfolio piece is deployed per Part 8, its page on{" "}
                <code>robinsamways.ca</code> loads real data from its own live
                infrastructure, not local/mock data
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>☐</span>
              <span>
                A test email to <code>robin@robinsamways.ca</code>, sent from
                an account other than <code>rgsamways@gmail.com</code>,
                arrives in Gmail (see the self-send caveat in Part 6a)
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
        <SectionHeader title="PART_8_PORTFOLIO_PIECE_DEPLOYMENTS" />
        <p className="-mt-2 mb-3 text-sm leading-relaxed">
          Some portfolio pieces need their own separate infrastructure beyond
          the five core services above (see <code>CLAUDE.md</code>&rsquo;s
          &quot;Portfolio piece isolation&quot; convention). Each one gets its
          own numbered subsection here as it&rsquo;s promoted, documenting
          exactly what needs configuring for it to actually work in
          production. Every promoted piece follows the same shape: its own
          cloud resources (provisioned manually, same as the core services
          above), CORS configured to allow <code>robinsamways.ca</code> (and{" "}
          <code>localhost</code> during development), and its secrets held
          entirely on its own platform — never committed to this repo, never
          exposed to the browser. <code>web/</code> only ever holds a public
          base-URL reference to it, via a{" "}
          <code>NEXT_PUBLIC_&lt;PIECE&gt;_API_URL</code> environment variable
          in Vercel — never an actual secret.
        </p>

        <h3 className="mt-4 font-bold">8a. Farpost Pulse (Azure)</h3>
        <p className="mt-1 text-sm leading-relaxed">
          Resources already provisioned by Robin directly in the Azure
          Portal (not through this repo):
        </p>
        <Steps
          items={[
            <>
              Resource Group: <code>farpost-pulse-rg</code> (East US)
            </>,
            <>
              Cosmos DB account: <code>farpost-pulse-cosmos</code> (NoSQL
              API, free tier)
            </>,
            <>
              Function App: <code>farpost-pulse-func</code> (Flex
              Consumption, Node.js 22 LTS)
            </>,
            <>
              Azure OpenAI (Foundry project):{" "}
              <code>rgsamways-0644</code> / resource{" "}
              <code>rgsamways-0644-resource</code> — model deployment
              pending a quota increase as of 2026-07-10; the app runs
              against a mocked coaching-tip function until it clears
            </>,
          ]}
        />
        <Steps
          items={[
            <>
              Get the Cosmos DB connection string: Azure Portal →{" "}
              <code>farpost-pulse-cosmos</code> →{" "}
              <strong>Settings → Keys</strong> → copy the Primary Connection
              String.
            </>,
            <>
              Locally, in <code>pieces/farpost-pulse-func/</code>:{" "}
              <code>cp local.settings.json.example local.settings.json</code>,
              fill in <code>COSMOS_CONNECTION_STRING</code>{" "}
              with the real value from the previous step (never commit this
              file — it&rsquo;s already gitignored), then{" "}
              <code>npm run seed</code>. This writes the actual seed data
              (techs, jobs, patterned per <code>design.md</code>) directly to
              the real Cosmos DB. Skipping this step means the app deploys
              successfully but returns an empty roster — there&rsquo;s no
              seed-triggering endpoint on the deployed Function App itself,
              seeding only happens from this local script.
            </>,
            <>
              Deploy <code>pieces/farpost-pulse-func/</code>&rsquo;s source
              to the <code>farpost-pulse-func</code> Function App (
              <code>func azure functionapp publish farpost-pulse-func</code>{" "}
              from within that folder, or via the Azure Portal&rsquo;s
              deployment center — whichever&rsquo;s more convenient at
              deploy time).
            </>,
            <>
              On the Function App, set application settings (Azure Portal →
              Function App → Configuration) for{" "}
              <code>COSMOS_CONNECTION_STRING</code> and{" "}
              <code>COSMOS_DATABASE_NAME</code> (same values as{" "}
              <code>local.settings.json</code>) and, once wired in, the
              Azure OpenAI key — never commit any of these to this repo,
              never expose them to the browser.
            </>,
            <>
              Configure CORS on the Function App (Azure Portal → Function
              App → CORS) to allow <code>https://robinsamways.ca</code> and{" "}
              <code>http://localhost:3000</code>.
            </>,
            <>
              In Vercel, set <code>NEXT_PUBLIC_FARPOST_PULSE_API_URL</code>{" "}
              to the Function App&rsquo;s public base URL (Project →
              Settings → Environment Variables, same page used for{" "}
              <code>NEXT_PUBLIC_API_URL</code> in Part 3).{" "}
              <strong>Trigger a new deploy after adding it</strong>{" "}
              — env var changes don&rsquo;t apply to existing deployments,
              same gotcha as Part 3.
            </>,
            <>
              Confirm{" "}
              <code>https://robinsamways.ca/narrative/farpost-pulse</code>{" "}
              loads real data from the live Function App, not local/mock
              data.
            </>,
          ]}
        />

        <h3 className="mt-6 font-bold">8b. Farpost Atlas (Railway)</h3>
        <p className="mt-1 text-sm leading-relaxed">
          Live as of 2026-07-11 — deployed as its own Railway project
          (separate from <code>/api</code>&rsquo;s), Postgres seeded with
          all 13 real tracked buildings, confirmed working end to end at{" "}
          <code>https://robinsamways.ca/narrative/farpost-atlas</code>.
        </p>
        <Steps
          items={[
            <>
              Railway → <strong>New Project → Deploy from GitHub repo</strong>
              , same repo as <code>/api</code>, but set{" "}
              <strong>Root Directory</strong> to{" "}
              <code>pieces/farpost-atlas-geo</code>{" "}
              (Root Directory is set
              from that service&rsquo;s <strong>Settings</strong> tab after
              creation, not always offered on the initial creation screen).
            </>,
            <>
              Add a Postgres database to the same Railway project (
              <strong>New → Database → PostgreSQL</strong>). Railway&rsquo;s
              Postgres plugin exposes its own connection variables (
              <code>DATABASE_URL</code>, <code>DATABASE_PUBLIC_URL</code>,{" "}
              <code>PGUSER</code>, <code>PGPASSWORD</code>,{" "}
              <code>PGHOST</code>, <code>PGPORT</code>,{" "}
              <code>PGDATABASE</code>) on the{" "}
              <strong>Postgres service itself</strong> — these are{" "}
              <em>not</em>{" "}
              automatically injected into other services in the project;
              the app service needs its own explicit{" "}
              <code>DATABASE_URL</code> variable (next step).
            </>,
            <>
              On the <strong>app service itself</strong> (not Postgres), add
              a <code>DATABASE_URL</code>{" "}
              variable referencing
              Postgres&rsquo;s private network values, rewritten with the{" "}
              <code>+asyncpg</code> scheme SQLAlchemy&rsquo;s asyncpg driver
              needs (Railway&rsquo;s own <code>DATABASE_URL</code> uses
              plain <code>postgresql://</code> — same gotcha already
              documented for <code>/api</code>&rsquo;s own Postgres in Part
              5):
            </>,
          ]}
        />
        <CodeBlock>
          {
            "DATABASE_URL=postgresql+asyncpg://${{Postgres.PGUSER}}:${{Postgres.PGPASSWORD}}@${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}"
          }
        </CodeBlock>
        <Callout>
          <strong>Gotcha actually hit:</strong> if you paste a{" "}
          <code>KEY=value</code> line into a variable&rsquo;s{" "}
          <em>value</em> field (rather than typing it into separate key/value
          fields), the literal <code>DATABASE_URL=</code>{" "}
          prefix ends up inside the value itself — producing{" "}
          <code>
            sqlalchemy.exc.ArgumentError: Could not parse SQLAlchemy URL from
            given URL string
          </code>{" "}
          on boot, since the value no longer starts with a valid scheme.
          Check the value field directly if this happens; the fix is
          deleting the stray <code>DATABASE_URL=</code> text from the front
          of it.
        </Callout>
        <Steps
          items={[
            <>
              Once the service is live, seed it — but from your own machine,
              you need the <strong>public</strong> connection string, not
              the private one from the previous step (
              <code>.railway.internal</code>{" "}
              addresses aren&rsquo;t reachable
              outside Railway&rsquo;s network). Copy{" "}
              <code>DATABASE_PUBLIC_URL</code>{" "}
              from the Postgres
              service&rsquo;s Variables tab, rewrite its scheme the same
              way, then from <code>pieces/farpost-atlas-geo/</code>:
            </>,
          ]}
        />
        <CodeBlock>
          {
            'pip install -r requirements.txt\n$env:DATABASE_URL = "<DATABASE_PUBLIC_URL, with postgresql+asyncpg:// scheme>"\npython -m scripts.seed'
          }
        </CodeBlock>
        <Callout>
          <strong>Gotcha actually hit:</strong> running{" "}
          <code>python scripts/seed.py</code> directly (as a file path)
          fails with{" "}
          <code>ModuleNotFoundError: No module named &apos;app&apos;</code>{" "}
          — Python only adds the script&rsquo;s own directory to its import
          path that way, not the package root. Run it as a module (
          <code>python -m scripts.seed</code>) instead, from{" "}
          <code>pieces/farpost-atlas-geo/</code>. Should print{" "}
          <code>Seeded 13 buildings, 36 tracked records.</code>
        </Callout>
        <Steps
          items={[
            <>
              Configure CORS: this piece&rsquo;s <code>app/main.py</code>{" "}
              already lists <code>https://robinsamways.ca</code>,{" "}
              <code>https://www.robinsamways.ca</code>, and{" "}
              <code>http://localhost:3000</code> in its{" "}
              <code>CORSMiddleware</code>{" "}
              — no separate portal configuration
              step needed here, unlike Azure Functions&rsquo; CORS (8a step
              5), since FastAPI&rsquo;s CORS is set in application code, not
              platform config.
            </>,
            <>
              Get the app service&rsquo;s public URL:{" "}
              <strong>Settings → Networking → Generate Domain</strong>{" "}
              if
              one isn&rsquo;t already listed, giving a{" "}
              <code>*.up.railway.app</code> address.
            </>,
            <>
              In Vercel, set{" "}
              <code>NEXT_PUBLIC_FARPOST_ATLAS_API_URL</code>{" "}
              to that Railway URL (Project → Settings → Environment
              Variables).{" "}
              <strong>Trigger a new deploy after adding it</strong> — same
              env var gotcha as Parts 3 and 8a.
            </>,
            <>
              Confirm{" "}
              <code>https://robinsamways.ca/narrative/farpost-atlas</code>{" "}
              loads the real seeded buildings and the rural-density overlay,
              not local/mock data.
            </>,
          ]}
        />
        <Callout>
          A <code>SetupGallery</code> component for this piece (real
          screenshots of the Railway/Postgres provisioning, per{" "}
          <code>CLAUDE.md</code>&rsquo;s &quot;Setup galleries&quot;
          convention) is a reasonable follow-up now that the above is
          actually done — not part of this note, same precedent as Farpost
          Pulse&rsquo;s own still-pending Azure setup gallery.
        </Callout>
      </section>

      <section>
        <SectionHeader title="PART_9_TROUBLESHOOTING" />
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
                <strong>
                  API fails to boot on Railway with{" "}
                  <code>
                    sqlalchemy.exc.ArgumentError: Could not parse SQLAlchemy
                    URL from given URL string
                  </code>
                  :
                </strong>{" "}
                different from the scheme-mismatch error above — this means
                the value itself isn&rsquo;t a URL at all. Check the
                variable&rsquo;s value field directly for a stray{" "}
                <code>DATABASE_URL=</code>{" "}
                (or similar) prefix left over from pasting a{" "}
                <code>KEY=value</code> line into the value box instead of
                typing the value alone.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>›</span>
              <span>
                <strong>
                  A Python service&rsquo;s own scripts fail with{" "}
                  <code>ModuleNotFoundError</code> for a local package (e.g.{" "}
                  <code>app</code>) when run directly (
                  <code>python scripts/seed.py</code>):
                </strong>{" "}
                running a script by file path only adds that script&rsquo;s
                own directory to Python&rsquo;s import path, not the package
                root. Run it as a module instead (
                <code>python -m scripts.seed</code>), from the
                package&rsquo;s own root directory.
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
