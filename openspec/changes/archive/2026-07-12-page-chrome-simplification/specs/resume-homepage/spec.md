## MODIFIED Requirements

### Requirement: Header replicates resume header layout
The homepage header SHALL display a literal `$` prompt immediately before the text "Robin Samways", a circular or rounded-square headshot image positioned at the top-right of the header, and a thin horizontal rule dividing the header from the body content below it. The `$` SHALL be rendered in the site's single accent color; the rest of the header text SHALL be in the default dark body text color. On viewports at or above Tailwind's `lg` breakpoint (1024px), the header SHALL remain pinned to the top of the viewport while the page scrolls beneath it, with an opaque background so scrolled content does not show through. Below `lg`, the header SHALL scroll normally with the rest of the page.

#### Scenario: Header renders on page load
- **WHEN** a visitor loads the homepage
- **THEN** the header shows `$ Robin Samways` with the `$` in the accent color, a headshot image top-right, and a horizontal rule beneath the header

#### Scenario: Header stays pinned while scrolling on a wide viewport
- **WHEN** a visitor on a viewport at least 1024px wide scrolls down any page
- **THEN** the header remains visible at the top of the viewport, with an opaque background, rather than scrolling out of view

#### Scenario: Header scrolls normally on a narrow viewport
- **WHEN** a visitor on a viewport narrower than 1024px scrolls down any page
- **THEN** the header scrolls out of view along with the rest of the page content
