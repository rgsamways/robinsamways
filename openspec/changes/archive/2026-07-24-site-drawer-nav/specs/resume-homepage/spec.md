## MODIFIED Requirements

### Requirement: Header replicates resume header layout
The homepage header SHALL display a headshot image positioned at the top-right of the header, and a thin horizontal rule dividing the header from the body content below it. The `$ Robin Samways` site title now lives in the navigation drawer, per the `site-navigation` capability, rather than in this header. This header SHALL remain pinned at its natural top offset while the page scrolls beneath it, on every viewport width — not only at the `lg` breakpoint as before — so it never shifts position once the page has loaded.

#### Scenario: Header renders on page load
- **WHEN** a visitor loads the homepage
- **THEN** the header shows a headshot image top-right and a horizontal rule beneath the header, with no separate `$ Robin Samways` title of its own

#### Scenario: Header stays pinned at its natural position while scrolling
- **WHEN** a visitor on any viewport width scrolls down any page
- **THEN** the header remains visible at the same offset from the top of the viewport it started at, rather than scrolling out of view or jumping to a different position
