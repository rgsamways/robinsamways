# Going live: robinsamways.ca deployment manual

A complete, ordered runbook for taking robinsamways.ca from a local repo to a live, production site — the five core services (GoDaddy, Cloudflare, Vercel, Railway, Resend), plus each promoted portfolio piece's own infrastructure as one gets added (see Part 8). Written so it can be followed start to finish, or handed to someone else to execute.

Last updated: 2026-07-10.

## Prerequisites

- **GoDaddy** account — owns both domains (`robinsamways.ca`, `robinsamways.com`)
- **Cloudflare** account — same one already used for `farpost.ca`
- **Vercel** account, connected to the GitHub account hosting this repo
- **Railway** account, connected to the same GitHub account
- **Resend** account (new — for outbound transactional email)
- Repo pushed to GitHub with `/api` and `/web` at the root

## Part 1 — Move robinsamways.ca's DNS to Cloudflare

1. In Cloudflare, **Add a site** → enter `robinsamways.ca`. Choose the Free plan.
2. Cloudflare scans the domain's existing DNS records at GoDaddy and shows them for review. Note anything worth preserving — in this case there's nothing critical yet, since email is being rebuilt from scratch in Part 6.
3. Cloudflare assigns two nameservers (unique per account, shown on screen — something like `xxx.ns.cloudflare.com`).
4. In GoDaddy: **My Domains → robinsamways.ca → DNS → Nameservers → Change** → select "Custom" → enter Cloudflare's two nameservers → Save.
5. Wait for propagation. Cloudflare emails you once it detects the delegation and marks the zone **Active** — usually well under an hour, occasionally up to 24–48h.

Nothing else in this guide can proceed until this zone shows **Active** in Cloudflare, since every later step adds records to it.

## Part 2 — robinsamways.com: forwarding only

`robinsamways.com` never touches Cloudflare, Vercel, or Railway — it's a pure redirect, handled entirely inside GoDaddy.

1. GoDaddy → **My Domains → robinsamways.com → Forwarding → Add Forwarding**.
2. Forward to `https://robinsamways.ca`.
3. Forward type: **Permanent (301)**.
4. Setting: **Forward only** (not masked — the address bar should show `robinsamways.ca`, not hide behind `.com`).
5. Save. Test in a private/incognito window once it takes effect.

## Part 3 — Deploy `/web` to Vercel

1. Vercel → **Add New → Project** → import the repo from GitHub.
2. Set **Root Directory** to `web`.
3. Framework preset should auto-detect as **Next.js** — leave build/output settings on their defaults (this was a specific goal of the `web-foundation` spec: zero-config deploy).
4. **Set `NEXT_PUBLIC_API_URL` = `https://api.robinsamways.ca` as a Production environment variable** (Project → Settings → Environment Variables — note this is a different page from "Environments"). This became required once `/web` started calling `/api` directly (first landed with the `contact-form` change) — without it, the app falls back to `http://localhost:8000`, which fails with a CORS error in production. **Environment variable changes don't apply to existing deployments — trigger a new deploy after adding it.**
5. Deploy. Confirm the generated `*.vercel.app` preview URL loads the homepage correctly before touching DNS.
6. Project → **Settings → Domains** → add `robinsamways.ca` and `www.robinsamways.ca`.
7. Vercel displays the exact DNS records it needs (typically an `A` record for the apex and a `CNAME` for `www`). **Use whatever Vercel shows on screen at setup time** — the values below are illustrative and can change:

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | *(IP Vercel displays)* |
   | CNAME | `www` | `cname.vercel-dns.com` |

8. Add both records in Cloudflare's DNS tab. Set them to **DNS only** (grey cloud, not proxied) for the initial setup — this lets Vercel issue and manage its own SSL certificate without Cloudflare's proxy in the way. Proxying can be turned on later for CDN/DDoS benefits once the domain is confirmed stable.
9. Wait a few minutes for Vercel to verify the domain and issue a certificate automatically.
10. Visit `https://robinsamways.ca` — should load with a valid padlock.

## Part 4 — Deploy `/api` + Postgres to Railway

1. Railway → **New Project → Deploy from GitHub repo** → select this repo.
2. Set the service's **Root Directory** to `api`.
3. Railway detects Python via `requirements.txt` and uses the `Procfile`'s start command (`uvicorn app.main:app --host 0.0.0.0 --port $PORT`) — no manual build config needed.
4. In the same Railway project, **add a Postgres service** from Railway's plugin catalog. This provisions a managed Postgres instance and generates connection variables (`PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, and a `DATABASE_URL`).

   > **Gotcha:** Railway's own `DATABASE_URL` uses the `postgresql://` scheme. Our API's `api/app/db.py` builds an async SQLAlchemy engine and expects `postgresql+asyncpg://` (see `api/.env.example`). Don't wire Railway's `DATABASE_URL` straight through — it'll fail to boot with a "can't load plugin: sqlalchemy.dialects:postgresql.None" style error.

5. On the **api** service, set an explicit `DATABASE_URL` environment variable using Railway's variable-reference syntax, built with the correct scheme:

   ```
   DATABASE_URL=postgresql+asyncpg://${{Postgres.PGUSER}}:${{Postgres.PGPASSWORD}}@${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
   ```

6. Deploy. Watch the build logs, then hit the generated `*.up.railway.app/health` URL — should return `{"status":"ok","database":"ok"}`.
7. Service → **Settings → Networking → Custom Domain** → add `api.robinsamways.ca`. Railway shows a CNAME target.
8. Add that CNAME in Cloudflare, again **DNS only** initially, same reasoning as Vercel.
9. Wait for Railway to verify and issue a certificate, then confirm `https://api.robinsamways.ca/health` returns 200 against the real production database.

## Part 5 — Postgres: what's automatic vs. what to watch

- `api/app/db.py`'s `init_db()` calls `SQLModel.metadata.create_all()` on startup, which auto-creates tables. That's fine for the current single-table `Ping` skeleton, but **not a substitute for real migrations** once actual business tables show up (e.g. from the Salesforce integration change) — auto-create can silently drop or fail to alter existing columns. Alembic is the natural next step at that point, not now.
- Worth a manual double-check beyond `/health`: Railway's dashboard has a **Connect** button that gives a ready-to-paste `psql` command. Run it and `\dt` to confirm the expected table actually exists in production, not just that the connection succeeds.

## Part 6 — Email: Cloudflare Email Routing (inbound) + Resend (outbound)

Moving the domain's nameservers to Cloudflare replaces whatever GoDaddy was doing for mail, so both directions need to be set up explicitly — nothing here is automatic.

### 6a. Inbound — Cloudflare Email Routing (free)

1. **Delete any leftover mail records from the old registrar first.** If GoDaddy was previously handling mail for the domain (even just default parking records), it will have left `MX` records pointing at `smtp.secureserver.net` / `mailstore1.secureserver.net`. These conflict with Cloudflare Email Routing and must be deleted from Cloudflare's DNS Records page before enabling routing — search the records list by type `MX` to find them.
2. Cloudflare → `robinsamways.ca` → **Email → Email Routing → Enable**. Cloudflare adds the necessary MX and SPF/TXT records to the zone automatically.
3. Add a routing rule: `robin@robinsamways.ca` (or whatever address is wanted) → **forward to** `rgsamways@gmail.com`.
4. Cloudflare sends a verification email to the Gmail address — confirm it.
5. **Gotcha (as of mid-2026): Cloudflare's new Email Routing UI can leave routing "Disabled" even after rules/destinations are configured.** The Overview page may show a routing rule, a destination address, and a domain all configured, yet "Routing status: Disabled" — the new UI's own banner admits it's incomplete ("You're now using the new Email Routing UI... being retired"), and its Settings → DNS records sub-page shows records marked "Locked" that aren't actually live. If this happens: click **"Use the old UI"** (link at the top of the page) → find the **"Get started with Email Routing"** wizard → click **"Add records and enable"**. That's the action that actually writes the MX/TXT records and flips status to Enabled — the new UI's setup does not reliably do this on its own.
6. Test by sending a real email to the new address and confirming it lands in Gmail. **Use an account other than the one it forwards to.** Sending the test from the same Gmail account the address forwards to (a self-addressed loop through a third-party relay) can be silently dropped by Gmail with no bounce and no spam-folder trace, even when Cloudflare's Activity Log shows the message as successfully "Forwarded" with SPF/DKIM/ARC all passing — Gmail's own downstream filtering is the opaque part, not Cloudflare's relay. Test from a different mailbox to get a real signal.

### 6b. Outbound — Resend (transactional email API)

For anything the site or API needs to *send* programmatically — the homepage contact form's notification email is the first real user of this (see the `contact-form` OpenSpec change).

1. Sign up at Resend, create an API key.
2. Add a **sending domain**. Recommend a subdomain like `mail.robinsamways.ca` rather than the bare domain, so transactional-mail reputation stays separate from personal inbound mail on the apex.
3. Resend provides DNS records to add: an SPF `TXT` record, a handful of DKIM `CNAME` records, and optionally a DMARC `TXT` record. Add all of them in Cloudflare.
4. Wait for Resend to mark the domain **Verified** (Cloudflare's fast propagation usually makes this quick).
5. Store the API key as a Railway environment variable on the **api** service (`RESEND_API_KEY`) — never commit it to the repo. Add a placeholder line to `api/.env.example` only.
6. Store the same key on `/web` only if a build-time need arises — as of the contact-form change, only `/api` sends email, so `/web` never needs this key.

## Part 7 — End-to-end verification checklist

- [ ] `https://robinsamways.ca` loads the homepage with a valid SSL padlock
- [ ] `https://www.robinsamways.ca` loads correctly
- [ ] `https://robinsamways.com` 301-redirects to `https://robinsamways.ca`
- [ ] `https://api.robinsamways.ca/health` returns 200 with `database: ok` against **production** Postgres
- [ ] Menu navigation works in production (Home / Method / Narrative / Farpost / Dev Log)
- [ ] Once a portfolio piece is deployed per Part 8, its page on `robinsamways.ca` loads real data from its own live infrastructure, not local/mock data
- [ ] A test email to `robin@robinsamways.ca`, sent from an account other than `rgsamways@gmail.com`, arrives in Gmail (see the self-send caveat in Part 6a)
- [ ] Resend shows the sending domain as **Verified**

## Part 8 — Portfolio piece deployments

Some portfolio pieces need their own separate infrastructure beyond the five core services above (see `CLAUDE.md`'s "Portfolio piece isolation" convention). Each one gets its own numbered subsection here as it's promoted, documenting exactly what needs configuring for it to actually work in production. Every promoted piece follows the same shape: its own cloud resources (provisioned manually, same as the core services above), CORS configured to allow `robinsamways.ca` (and `localhost` during development), and its secrets held entirely on its own platform — never committed to this repo, never exposed to the browser. `web/` only ever holds a public base-URL reference to it, via a `NEXT_PUBLIC_<PIECE>_API_URL` environment variable in Vercel — never an actual secret.

### 8a. Farpost Pulse (Azure)

Resources already provisioned by Robin directly in the Azure Portal (not through this repo):
- Resource Group: `farpost-pulse-rg` (East US)
- Cosmos DB account: `farpost-pulse-cosmos` (NoSQL API, free tier)
- Function App: `farpost-pulse-func` (Flex Consumption, Node.js 22 LTS)
- Azure OpenAI (Foundry project): `rgsamways-0644` / resource `rgsamways-0644-resource` — model deployment pending a quota increase as of 2026-07-10; the app runs against a mocked coaching-tip function until it clears

1. Deploy `pieces/farpost-pulse-func/`'s source to the `farpost-pulse-func` Function App (`func azure functionapp publish farpost-pulse-func` from within that folder, or via the Azure Portal's deployment center — whichever's more convenient at deploy time).
2. On the Function App, set application settings (Azure Portal → Function App → Configuration) for the Cosmos DB connection string and, once wired in, the Azure OpenAI key — never commit either to this repo, never expose either to the browser.
3. Configure CORS on the Function App (Azure Portal → Function App → CORS) to allow `https://robinsamways.ca` and `http://localhost:3000`.
4. In Vercel, set `NEXT_PUBLIC_FARPOST_PULSE_API_URL` to the Function App's public base URL (Project → Settings → Environment Variables, same page used for `NEXT_PUBLIC_API_URL` in Part 3). **Trigger a new deploy after adding it** — env var changes don't apply to existing deployments, same gotcha as Part 3.
5. Confirm `https://robinsamways.ca/narrative/farpost-pulse` loads real data from the live Function App, not local/mock data.

## Part 9 — Troubleshooting

- **DNS not resolving after the nameserver change:** can take up to 48h though it's usually much faster. Cloudflare's dashboard shows **Active** once it recognizes the delegation — check there before assuming something's broken.
- **Vercel/Railway domain stuck on "pending verification":** re-check the exact record type/value the platform is currently asking for (they can differ from what's documented here) and confirm Cloudflare isn't proxying (orange cloud) if the platform expects direct DNS-only resolution.
- **API fails to boot on Railway with a dialect/driver error:** almost certainly the `DATABASE_URL` scheme mismatch from Part 4 — confirm it starts with `postgresql+asyncpg://`, not `postgresql://`.
- **Reverting:** nameservers can be pointed back to GoDaddy's defaults at any time from GoDaddy's DNS settings. Vercel/Railway deployments can be deleted without affecting the domain until DNS is repointed away from them.
- **Test email to the routed address never arrives, no bounce, no spam folder trace, and Cloudflare's Activity Log shows it as "Forwarded" with SPF/DKIM/ARC passing:** this is very likely the self-send loop described in Part 6a, not a Cloudflare problem — Gmail can silently drop mail that appears to loop back to the same account via a third-party relay. Re-test from a different mailbox before assuming anything is broken.
