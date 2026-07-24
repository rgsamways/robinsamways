# siloes/

Full standalone product rebuilds live here — not portfolio demonstration pieces (see `pieces/` and `CLAUDE.md`'s "Portfolio piece isolation" for those).

Each silo:
- gets its own folder (e.g. `siloes/farpost/`)
- is deployed independently, on its own infrastructure
- chooses its own tech stack freely — not constrained to `api/`'s Python or `web/`'s Next.js
- never shares dependencies or runtime with the site's core, with `pieces/`, or with any other silo
- is the *same code* shown as the live working build on that project's silo homepage under the site's "Work" nav — background/context first, then the real thing, not a mockup or separate embed
- follows the shared navigation house style (simple header with brand/UI effects + always-visible sign-in/sign-up/sign-out; footer-based primary nav) established by Vocare and carried forward for consistency across projects

See `CLAUDE.md`'s "Silo isolation" section for the full convention.
