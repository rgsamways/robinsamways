# Sreditor — the R&D working log

"Sreditor" is what we call the practice of capturing contemporaneous notes on technological uncertainty as it gets resolved while building this project. It's raw material for Robin's SR&ED (Scientific Research & Experimental Development) tax credit documentation — not a finished claim, and not tax advice.

## What belongs here

CRA's SR&ED program rewards work that resolves *technological uncertainty* through *systematic investigation* — not routine application of documented APIs, frameworks, or established practice. Most day-to-day feature work does not qualify. Good candidates:

- A problem where the standard/documented approach didn't work, and required experimentation to find out why
- A design decision made by testing multiple approaches and comparing results
- Novel integration work where the "right" way genuinely wasn't documented or known in advance

Routine scaffolding, following a library's own docs, or applying a well-known pattern is **not** Sreditor material, even if it took real effort.

## Format

One file per entry: `docs/sreditor/<year>/<date>-<slug>.md`, using `TEMPLATE.md`. Log entries close to when the work actually happens — reconstructed-later notes are far weaker documentation than contemporaneous ones.

## Disclaimer

This log captures raw material only. Whether any given entry is ultimately SR&ED-eligible is for Robin (or his accountant) to determine at claim time — when in doubt, log it anyway; it's cheaper to over-capture now than to reconstruct later.
