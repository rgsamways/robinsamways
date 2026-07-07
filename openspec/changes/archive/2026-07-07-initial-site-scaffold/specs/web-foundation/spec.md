## ADDED Requirements

### Requirement: Next.js app skeleton with TypeScript and Tailwind
The `/web` directory SHALL contain a Next.js application configured with TypeScript and Tailwind CSS, buildable via a standard `npm run build` (or equivalent) command with no errors.

#### Scenario: Web app builds successfully
- **WHEN** `npm run build` is run inside `/web`
- **THEN** the build completes without errors and produces a deployable output

#### Scenario: Web app runs locally in dev mode
- **WHEN** `npm run dev` is run inside `/web`
- **THEN** the homepage is served locally and reachable in a browser

### Requirement: Vercel deployment readiness
The `/web` app SHALL be structured so it can be deployed to Vercel with zero additional configuration beyond linking the repo and setting the project root to `/web` (e.g. no custom build steps required outside what Vercel's Next.js preset provides).

#### Scenario: Vercel auto-detects the framework
- **WHEN** the `/web` directory is imported into Vercel as a project with root directory `/web`
- **THEN** Vercel auto-detects it as a Next.js app and the default build/output settings apply without manual overrides

### Requirement: Monospace font self-hosted via next/font
The web app SHALL load its monospace font (JetBrains Mono) using `next/font`, avoiding external font requests at runtime.

#### Scenario: Font loads without external network request
- **WHEN** the homepage is loaded
- **THEN** the monospace font is served from the app's own origin rather than a third-party font CDN
