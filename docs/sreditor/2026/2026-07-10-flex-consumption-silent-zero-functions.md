# Azure Functions Flex Consumption reported a successful deployment while loading zero functions, with no direct error pointing at the cause

**Date:** 2026-07-10
**Project change:** openspec/changes/archive/2026-07-10-farpost-pulse-build
**Time invested (approx):** roughly an hour from first noticing the 404 to a fully verified fix, most of it spent ruling out wrong hypotheses before finding the actual diagnostic signal.

## Technological uncertainty

`func azure functionapp publish farpost-pulse-func` completed its entire Kudu deployment pipeline successfully — every step reporting "completed," and Azure's own Deployment Center later independently confirming the deployment as "Succeeded (Active)." Despite this, every HTTP endpoint returned 404, and the Function App's Overview page showed zero registered functions ("Create functions in your preferred environment," the same UI shown for a brand-new, never-deployed app). Nothing in the deploy command's own output, the Deployment Center, or the app's host status (`"state": "Running"`) indicated why a genuinely successful deployment produced a runtime with no functions loaded — the platform-level and application-runtime-level signals actively disagreed with each other, and only one of them was visible by default.

## Hypothesis / approach

Worked through several plausible causes in order of how easy each was to check, rather than guessing at the actual mechanism first: a routing/`host.json` misconfiguration, then a general "try restarting" pass, then checking Azure's own deployment record for a hidden failure the CLI output might have masked. Only once those were ruled out did the investigation move to checking the *runtime's own startup behavior* directly, rather than deployment-layer signals.

## Investigation

- Checked `host.json` for a custom `routePrefix` override — none found, ruled out a routing mismatch.
- Restarted the Function App directly (Azure Portal) — no change in behavior.
- Checked the Deployment Center's Logs tab — confirmed the deployment itself genuinely showed "Succeeded (Active)," ruling out a failed/partial upload as the cause.
- Checked the live Log stream while triggering a fresh request — this was the actual diagnostic breakthrough. The host's own startup log showed `Reading functions metadata (Custom)` → `0 functions found (Custom)` → `0 functions loaded`: the runtime was actively attempting to discover functions and finding none, not crashing or erroring outright, which is why none of the earlier, deployment-layer checks surfaced anything.
- Cross-referenced this against the original deploy command's own output, which had earlier (easy to miss in the moment, buried among "completed" lines) shown `remotebuild = false` and `Skipping oryx build (remotebuild = false)` — meaning the deploy used local build, not Azure's own server-side `npm install`.
- Checked `.funcignore` directly and found `node_modules` explicitly excluded from the deployed package. With local build (no server-side install) *and* `node_modules` excluded from the local zip, the deployed package contained the four function source files but none of their actual dependencies (`@azure/functions`, `@azure/cosmos`) — every function file's top-level `require()` call would fail, silently preventing that file's `app.http(...)` registration from ever running, which matches "0 functions found" exactly.
- Fix: removed `node_modules` from `.funcignore`. Redeployed — package size jumped from 11.2 KB to 8.2 MB, an independent confirmation that dependencies were now actually included, before even checking the runtime again.
- Verified via the Log stream: all four functions registered with real invoke URLs. Verified via `curl` against the live endpoint: real seeded data returned with a 200 status.

## Outcome

The fix worked and was verified at multiple independent layers (package size, Log stream function count, and live endpoint response) rather than trusting any single signal.

## Knowledge gained

Azure Functions' Flex Consumption plan can report a fully successful deployment at the platform level (Deployment Center, the `func publish` command's own success message, "Running" host status) while the actual Functions runtime silently fails to load any function from the deployed package — none of those platform-level signals are sufficient on their own to confirm the app is actually functional. The only signal that surfaced the real problem was the live Log stream's function-discovery output, checked while triggering a fresh request. Separately: `.funcignore`'s `node_modules` exclusion is only safe when remote/Oryx build is genuinely enabled server-side; with local build (the default for `func azure functionapp publish` unless `--build remote` is passed), dependencies must ship as part of the local package, or every function silently fails to load with no direct error message pointing at the cause. For any future Azure Functions deployment work — Flex Consumption specifically, but plausibly other newer Azure hosting models too — the real verification step after a "successful" deploy is checking the runtime's own live behavior directly, not the deployment platform's own success reporting.
