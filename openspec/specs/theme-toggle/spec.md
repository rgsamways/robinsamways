# theme-toggle Specification

## Purpose
TBD - created by archiving change site-theme-toggle. Update Purpose after archive.
## Requirements
### Requirement: A lightbulb toggle switches the whole site between light and dark
The site header SHALL include a lightbulb-icon toggle button, rendered directly below the hamburger menu toggle, present on every page. Activating it SHALL switch the entire site between a light and a dark color scheme instantly, without a page reload, by re-theming the site's existing color tokens rather than any single page or section.

#### Scenario: Toggle is present in the header on every page
- **WHEN** a visitor loads any page of the site
- **THEN** the header shows the lightbulb toggle directly below the hamburger menu toggle

#### Scenario: Activating the toggle switches the whole page's theme
- **WHEN** a visitor in light mode activates the toggle
- **THEN** the page's background, text, and accent colors switch to their dark-mode values immediately, without a page reload

#### Scenario: Toggle reflects the current theme state
- **WHEN** a visitor activates the toggle
- **THEN** the toggle's own visual state (e.g. lit vs. dimmed) and `aria-pressed` value reflect whichever theme is now active

### Requirement: Theme defaults to system preference, then remembers an explicit choice
On a visitor's first visit, with no stored preference, the site SHALL render in whichever theme matches the visitor's OS-level `prefers-color-scheme` setting. Once a visitor activates the toggle, that explicit choice SHALL persist across page loads and future visits, overriding the OS-level preference.

#### Scenario: First-time visitor with a dark OS preference sees dark mode
- **WHEN** a visitor with no stored theme preference and an OS-level dark-mode setting loads the site
- **THEN** the site renders in dark mode by default

#### Scenario: An explicit toggle persists across a reload
- **WHEN** a visitor activates the toggle and then reloads the page
- **THEN** the site renders in the theme the visitor last chose, regardless of OS-level preference

### Requirement: No flash of the wrong theme on initial load
The resolved theme (from a stored preference or, absent one, the OS-level preference) SHALL be applied before the page's first paint, so a visitor never briefly sees the opposite theme flash before the correct one appears.

#### Scenario: Dark-preferring visitor loads the site without seeing a light flash
- **WHEN** a visitor whose resolved theme is dark loads any page
- **THEN** the page's first rendered frame is already in dark mode, with no visible flash of the light theme beforehand

