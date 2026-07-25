## ADDED Requirements

### Requirement: /settings is a real page with one section per setting
`/settings` SHALL render its theme, font size, and reduced-motion controls as separate sections on a single page, replacing the earlier "isn't live yet" placeholder.

#### Scenario: Visiting /settings shows real controls
- **WHEN** a visitor loads `/settings`
- **THEN** the page shows working controls for theme, font size, and reduced motion, with no placeholder or "not live yet" messaging

### Requirement: The theme toggle lives on /settings, not the nav rail
The system SHALL provide the light/dark theme toggle as a control on `/settings`, and the nav rail (`RightRail.tsx`) SHALL NOT render a theme toggle button.

#### Scenario: The rail no longer has a theme toggle
- **WHEN** a visitor opens the nav rail on any page
- **THEN** no theme toggle control appears in it

#### Scenario: Toggling theme on /settings still applies site-wide
- **WHEN** a visitor changes the theme on `/settings`
- **THEN** the new theme applies immediately and persists across navigation to any other page

### Requirement: Font size is adjustable and persists across visits
The system SHALL let a visitor choose a font-size scale (Small, Default, Large, Extra Large) on `/settings`, persist that choice, and apply it site-wide on every page load.

#### Scenario: Changing font size scales the site immediately
- **WHEN** a visitor selects a font-size option other than the current one
- **THEN** the site's text visibly rescales immediately, without a page reload

#### Scenario: A chosen font size persists across a reload and across pages
- **WHEN** a visitor who previously chose a non-default font size reloads the site or navigates to a different page
- **THEN** the same font-size scale is still applied

### Requirement: Reduced motion is a real tri-state preference that disables real animation
The system SHALL let a visitor set reduced motion to System (the default, follows the OS `prefers-reduced-motion` setting), On, or Off, and SHALL actually suppress this site's existing animated transitions (the nav rail's slide transition, the page-outline's smooth scroll-to-section) whenever the resolved state is "reduced."

#### Scenario: An explicit "On" override suppresses animation regardless of OS preference
- **WHEN** a visitor sets reduced motion to On, even if their OS preference is not set to reduce motion
- **THEN** the nav rail's slide transition and the page outline's scroll-to-section both occur without animation

#### Scenario: "System" defers to the OS preference
- **WHEN** a visitor leaves reduced motion at System and their OS is set to prefer reduced motion
- **THEN** the same animations are suppressed as if they had explicitly chosen On

#### Scenario: An explicit "Off" override keeps animation even if the OS prefers reduced motion
- **WHEN** a visitor sets reduced motion to Off, even if their OS preference prefers reduced motion
- **THEN** the nav rail's slide transition and the page outline's scroll-to-section both animate normally

### Requirement: Every persisted setting applies on every page load, not only on /settings
The system SHALL apply each visitor's stored theme, font-size, and reduced-motion preferences on every page, regardless of which page they land on or navigate to.

#### Scenario: A stored preference applies on a page other than /settings
- **WHEN** a visitor with a previously stored font-size or reduced-motion preference loads any page other than `/settings`
- **THEN** that preference is already applied on that page, without needing to visit `/settings` first
