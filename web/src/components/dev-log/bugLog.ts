export type BugLogEntry = {
  slug: string;
  title: string;
  date: string;
  theBug: string[];
  theConcept: string[];
};

// A growing list — each entry pairs a real bug hit during development with
// the underlying concept it reveals. Adapted from docs/sreditor/ source
// material, not copied verbatim (that format is written for an internal,
// future-Claude/future-Robin audience; this one is written for a developer
// reading the live site).
export const BUG_LOG_ENTRIES: BugLogEntry[] = [
  {
    slug: "cosmos-db-shared-throughput",
    title: "Cosmos DB rejected my seed script — and the fix wasn't in the error message",
    date: "2026-07-10",
    theBug: [
      "Seeding Farpost Pulse's real Cosmos DB account failed partway through, with an error that at least named exact numbers: it would have pushed total throughput to 1200 RU/s against a 1000 RU/s account cap. Three containers, each silently requesting its own 400 RU/s allocation by default, had quietly stacked up past the limit — nothing in the code, or the Cosmos SDK's own method signatures, hinted this would happen ahead of time.",
      "The fix itself was small — explicitly provision shared throughput at the database level (1000 RU/s), and leave the container-creation calls otherwise untouched, so all three containers draw from one pool instead of each reserving their own. But re-running the script wasn't the end of it: the first, failed attempt had already half-succeeded, leaving two containers already provisioned under the old dedicated-throughput model. A code fix can't retroactively convert an already-existing resource. The database had to be deleted and recreated cleanly, then verified directly in the Azure Portal — not just by trusting a second clean run.",
    ],
    theConcept: [
      "RU/s (Request Units per second) is Cosmos DB's normalized \"cost of doing work\" currency — a blended measure of read/write/query cost, decoupled from CPU, RAM, or disk, that every operation draws from a bounded budget.",
      "Shared vs. dedicated throughput is the provisioning choice that decides whether that budget is per-container or pooled. Leave it unspecified, and each container quietly reserves its own slice by default — fine until enough containers exist to blow past an account's cap, exactly what happened here.",
      "The broader lesson generalizes past Cosmos DB: after applying a fix, check a cloud resource's actual live state directly, not just whether the script ran without an error this time. A partial failure can leave real infrastructure sitting in an inconsistent state that a second, corrected run won't self-heal.",
    ],
  },
  {
    slug: "flex-consumption-zero-functions",
    title: "Azure said the deploy succeeded. The app had zero functions.",
    date: "2026-07-10",
    theBug: [
      "`func azure functionapp publish` reported complete success — every step \"completed,\" and Azure's own Deployment Center independently confirmed \"Succeeded (Active).\" And yet every HTTP endpoint 404'd, and the Function App's dashboard showed zero registered functions, the same screen shown for a brand-new, never-deployed app. Nothing about the deploy command's own output, or the platform's own status, pointed at why.",
      "Working through the obvious candidates first — a routing misconfiguration, a restart, a deeper look at the deployment logs — ruled each one out without finding the actual cause. The real breakthrough came from the live Log stream, watched while triggering a fresh request: the runtime's own startup log showed it actively searching for functions and finding none. Not crashing, not erroring — just quietly finding nothing, which is exactly why none of the deployment-layer checks had surfaced anything.",
      "The root cause, once found, was two things compounding: the deploy had used a local build rather than Azure's own server-side build step, and `.funcignore` excluded `node_modules` from the uploaded package. Locally-built code with its dependencies stripped out means every function file's top-level `require()` call silently fails, which quietly prevents that file from ever registering itself. The fix — removing `node_modules` from `.funcignore` — was confirmed working two ways before even checking the app again: the deploy package jumped from 11.2 KB to 8.2 MB, and the Log stream then showed all four functions actually registering.",
    ],
    theConcept: [
      "A platform reporting \"deployment succeeded\" only confirms the upload/build pipeline finished — it says nothing about whether the runtime can actually load and register anything from what got uploaded. Those are two genuinely separate layers of \"success,\" and only one of them is visible by default.",
      "A build-ignore file's dependency exclusion (`.funcignore`'s `node_modules`, but the same idea applies to `.dockerignore`, `.gitignore`-driven deploy tooling generally) is only safe when something else — a remote/server-side build step — actually reinstalls what got excluded. Skip that step, whether on purpose or by an unnoticed default, and whatever's excluded from the package simply never ships.",
      "The generalizable habit: after a \"successful\" deploy, check the runtime's own live behavior directly — a real log stream, a real request — rather than trusting the deployment platform's own success report as the final word.",
    ],
  },
];
