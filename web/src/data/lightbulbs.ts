export type LightbulbEntry = {
  slug: string;
  title: string;
  summary: string;
  dateLogged: string;
  graduatedTo?: { label: string; href: string };
};

// Adapted from docs/lightbulbs/rsw-lb-index.md for a public reader — the
// internal index is the source of truth; only entries whose own file
// explicitly notes a graduation ("Status: scoped — became the X change")
// get a graduatedTo pointer here, not entries known to have shipped but not
// yet annotated as such internally.
export const LIGHTBULB_ENTRIES: LightbulbEntry[] = [
  {
    slug: "sreditor",
    title: "Sreditor",
    summary:
      "A portfolio piece teaching other developers to run their own SR&ED tax-credit documentation practice, using this project's own R&D log as the working example.",
    dateLogged: "2026-07-07",
  },
  {
    slug: "rural-demographics-api",
    title: "Rural Demographics API",
    summary:
      "A standalone public API serving rural Ontario demographic data, tied to Farpost's long-horizon population thesis.",
    dateLogged: "2026-07-07",
  },
  {
    slug: "farpost-origin-story",
    title: "Farpost's Real Origin Story",
    summary:
      "Open the Farpost page with Robin's real founder story — a rural adjuster's dispatch problem, an Android side-project that collided with a competitor, and the RFID-tag idea salvaged into Farpost's building-intelligence platform.",
    dateLogged: "2026-07-07",
    graduatedTo: { label: "See it live on the Farpost page", href: "/farpost" },
  },
  {
    slug: "layman-terms-glossary",
    title: "Plain-Language Glossary",
    summary:
      "A growing \"X, in layman's terms\" glossary translating technical terms used elsewhere on this site for non-technical readers, without losing the substance.",
    dateLogged: "2026-07-08",
  },
  {
    slug: "ideatia",
    title: "Ideatia",
    summary:
      "An idea-incubator portfolio project at the already-purchased ideatia.ca — niche deliberately not yet chosen, since the space is crowded and needs real differentiation first.",
    dateLogged: "2026-07-08",
  },
  {
    slug: "trademark-ai-assistant",
    title: "AI-Assisted Trademark Filing",
    summary:
      "Research-first idea on AI-assisted trademark search/filing — the DIY-filing and examiner-side lanes look crowded, but an AI-intake-then-human-broker-handoff angle doesn't, based on one quick pass.",
    dateLogged: "2026-07-08",
  },
  {
    slug: "small-trusted-network-thesis",
    title: "The Small, Trusted Network Thesis",
    summary:
      "A thesis-level insight, sparked by a real conversation about white-collar legal referrals: the internet serves mass-scale platforms and one-off tools well, but has largely ignored infrastructure for small, closed, trust-based networks that deliberately resist visibility — the same structural logic Farpost independently arrived at first.",
    dateLogged: "2026-07-08",
  },
  {
    slug: "testing-rig-dev-log-entry",
    title: "A Real Testing & Verification Story",
    summary:
      "Turn this project's testing/verification practice into Dev Log's first real entry — an honest engineering-practice showcase for a reader deciding whether to trust this site's engineering.",
    dateLogged: "2026-07-10",
  },
  {
    slug: "public-dev-metrics-dashboard",
    title: "A Public Dev-Metrics Dashboard",
    summary:
      "A running chart on Dev Log showing real development metrics over time (lines of code, complexity, duplication) — a live \"building in public\" signal rather than a static case study.",
    dateLogged: "2026-07-10",
  },
  {
    slug: "ru-throughput-dev-log-entry",
    title: "A Real-Bug-Plus-Concept Bug Log",
    summary:
      "A recurring Dev Log category pairing a real bug with the underlying concept it reveals, starting with a Cosmos DB throughput bug hit while deploying Farpost Pulse.",
    dateLogged: "2026-07-10",
  },
  {
    slug: "farpost-atlas",
    title: "Farpost Atlas",
    summary:
      "A geospatial map of tracked buildings with staleness indicators and a rural-density overlay — proves GIS/spatial-data skills genuinely distinct from this site's other pieces, directly portable to the real Farpost product.",
    dateLogged: "2026-07-10",
    graduatedTo: { label: "See it live as Farpost Atlas", href: "/farpost/farpost-atlas" },
  },
  {
    slug: "farpost-dispatch",
    title: "Farpost Dispatch",
    summary:
      "A Salesforce Experience Cloud partner portal matching field professionals to jobs across rural coverage areas — a direct callback to Farpost's real founding story, proving building inside Salesforce rather than just integrating with it.",
    dateLogged: "2026-07-10",
  },
  {
    slug: "sreditor-tool-integration-bugs",
    title: "Sreditor's Tool-Integration Bugs",
    summary:
      "A bug-log entry on real subprocess/ANSI-output/buffer-overflow bugs hit while building Sreditor's own corroborating-signals feature — including Sreditor's own judgment engine correctly ruling that work SR&ED-ineligible when run against itself.",
    dateLogged: "2026-07-11",
  },
  {
    slug: "sreditor-farpost-scale-bugs",
    title: "Sreditor at Farpost's Real Scale",
    summary:
      "A different batch of Sreditor bugs — token-limit crashes, missing reasoning output, run-to-run inconsistency — surfaced only by testing against Farpost's real, much larger change history.",
    dateLogged: "2026-07-11",
  },
  {
    slug: "azure-client-credentials-flow",
    title: "OAuth Against Microsoft Entra ID",
    summary:
      "A second Tech/Stacks-style piece demonstrating the same OAuth 2.0 Client Credentials Flow already shown against Salesforce, this time against Microsoft Entra ID.",
    dateLogged: "2026-07-11",
  },
  {
    slug: "project-silos",
    title: "Project Siloes",
    summary:
      "Each of Robin's own projects (Farpost, Vocare, Sreditor, ...) gets its own \"silo\" under this site's Work group, showcasing all of them from one place.",
    dateLogged: "2026-07-24",
  },
  {
    slug: "vocare-farpost-desktop-scaffolding",
    title: "Desktop Scaffolding for Vocare and Farpost's Real Apps",
    summary:
      "Apply the left-drawer/right-rail large-screen layout proven on this site to Vocare's and Farpost's own real applications, not just their pages here.",
    dateLogged: "2026-07-24",
  },
  {
    slug: "ai-interview-format-mismatch-dev-log-entry",
    title: "What a Timed AI Interview Actually Measures",
    summary:
      "An honest Dev Log entry on the mismatch between learning by building and what a timed AI-interviewer format measures, using Farpost itself as counter-evidence of real capability.",
    dateLogged: "2026-07-24",
  },
  {
    slug: "role-modeled-twice-dev-log-entry",
    title: "The Same Concept, Modeled Twice",
    summary:
      "A Dev Log entry on discovering Farpost had modeled \"role\" twice because a good later fix landed on an old skeleton instead of replacing it — a generalizable design-drift lesson, not specific to Farpost.",
    dateLogged: "2026-07-24",
  },
  {
    slug: "fastify-vs-express-dev-log-entry",
    title: "Choosing Fastify Over Express",
    summary:
      "A Dev Log entry documenting the researched, against-the-grain choice of Fastify over Express for the Farpost rebuild.",
    dateLogged: "2026-07-24",
  },
  {
    slug: "own-stack-discovery-dev-log-entry",
    title: "Finding a Stack Already Converged On",
    summary:
      "A Dev Log entry on discovering Vocare had already converged on its real stack before that combination was consciously named — an evidence-based origin story for Robin's own tech-stack choices.",
    dateLogged: "2026-07-24",
  },
  {
    slug: "golden-path-backstage-parallel-dev-log-entry",
    title: "An Accidental Industry Parallel",
    summary:
      "A Dev Log entry drawing the parallel, discovered after the fact, between this project's own setup and real industry patterns like Spotify's \"golden path\" and Backstage.",
    dateLogged: "2026-07-24",
  },
  {
    slug: "vocare-pricing-history-dev-log-entry",
    title: "Vocare's Real Pricing History",
    summary:
      "Vocare's real pricing iteration in three days — a one-time lifetime fee, raised once, and a recurring model under internal consideration — as an honest pricing-judgment story.",
    dateLogged: "2026-07-24",
  },
  {
    slug: "billing-model-convergence-dev-log-entry",
    title: "Two Projects, the Same Idea Independently",
    summary:
      "A second \"found it in my own code\" discovery: an unbuilt Farpost idea and a separately-conceived Vocare idea turned out to be the identical purchase pattern, arrived at independently.",
    dateLogged: "2026-07-24",
  },
];
