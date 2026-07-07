# Going live: robinsamways.ca deployment manual

A complete, ordered runbook for taking robinsamways.ca from a local repo to a live, production site across five services: GoDaddy, Cloudflare, Vercel, Railway, and Resend. Written so it can be followed start to finish, or handed to someone else to execute.

Last updated: 2026-07-07.

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
4. No environment variables are required yet — the homepage content is hardcoded, not fetched from the API. (Note for later: if `/web` ever calls `/api` directly, e.g. for a live Salesforce-backed feature, that's when a `NEXT_PUBLIC_API_URL` variable gets added here.)
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

1. Cloudflare → `robinsamways.ca` → **Email → Email Routing → Enable**. Cloudflare adds the necessary MX and SPF/TXT records to the zone automatically.
2. Add a routing rule: `robin@robinsamways.ca` (or whatever address is wanted) → **forward to** `rgsamways@gmail.com`.
3. Cloudflare sends a verification email to the Gmail address — confirm it.
4. Test by sending a real email to the new address and confirming it lands in Gmail.

### 6b. Outbound — Resend (transactional email API)

For anything the site or API needs to *send* programmatically later — a contact form, a notification — not needed by anything currently built, but worth setting up now so the domain is pre-verified when that feature arrives.

1. Sign up at Resend, create an API key.
2. Add a **sending domain**. Recommend a subdomain like `mail.robinsamways.ca` rather than the bare domain, so transactional-mail reputation stays separate from personal inbound mail on the apex.
3. Resend provides DNS records to add: an SPF `TXT` record, a handful of DKIM `CNAME` records, and optionally a DMARC `TXT` record. Add all of them in Cloudflare.
4. Wait for Resend to mark the domain **Verified** (Cloudflare's fast propagation usually makes this quick).
5. Store the API key as a Railway environment variable on the **api** service (`RESEND_API_KEY`) — never commit it to the repo. Add a placeholder line to `api/.env.example` only.
6. No send-email code exists in `/api` yet — this step just gets the account and domain pre-verified so a future feature can start sending immediately without a DNS detour.

## Part 7 — End-to-end verification checklist

- [ ] `https://robinsamways.ca` loads the homepage with a valid SSL padlock
- [ ] `https://www.robinsamways.ca` loads correctly
- [ ] `https://robinsamways.com` 301-redirects to `https://robinsamways.ca`
- [ ] `https://api.robinsamways.ca/health` returns 200 with `database: ok` against **production** Postgres
- [ ] Menu navigation works in production (Portfolio / Farpost / Dev Log placeholder routes)
- [ ] A test email to `robin@robinsamways.ca` arrives in Gmail
- [ ] Resend shows the sending domain as **Verified**

## Part 8 — Troubleshooting

- **DNS not resolving after the nameserver change:** can take up to 48h though it's usually much faster. Cloudflare's dashboard shows **Active** once it recognizes the delegation — check there before assuming something's broken.
- **Vercel/Railway domain stuck on "pending verification":** re-check the exact record type/value the platform is currently asking for (they can differ from what's documented here) and confirm Cloudflare isn't proxying (orange cloud) if the platform expects direct DNS-only resolution.
- **API fails to boot on Railway with a dialect/driver error:** almost certainly the `DATABASE_URL` scheme mismatch from Part 4 — confirm it starts with `postgresql+asyncpg://`, not `postgresql://`.
- **Reverting:** nameservers can be pointed back to GoDaddy's defaults at any time from GoDaddy's DNS settings. Vercel/Railway deployments can be deleted without affecting the domain until DNS is repointed away from them.
