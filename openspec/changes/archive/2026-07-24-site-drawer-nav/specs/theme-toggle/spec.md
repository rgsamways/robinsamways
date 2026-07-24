## MODIFIED Requirements

### Requirement: A lightbulb toggle switches the whole site between light and dark
The site SHALL include a lightbulb-icon toggle button, rendered in the right-hand display-settings rail, present on every page. Activating it SHALL switch the entire site between a light and a dark color scheme instantly, without a page reload, by re-theming the site's existing color tokens rather than any single page or section.

#### Scenario: Toggle is present in the right rail on every page
- **WHEN** a visitor loads any page of the site
- **THEN** the right-hand display-settings rail shows the lightbulb toggle

#### Scenario: Activating the toggle switches the whole page's theme
- **WHEN** a visitor in light mode activates the toggle
- **THEN** the page's background, text, and accent colors switch to their dark-mode values immediately, without a page reload

#### Scenario: Toggle reflects the current theme state
- **WHEN** a visitor activates the toggle
- **THEN** the toggle's own visual state (e.g. lit vs. dimmed) and `aria-pressed` value reflect whichever theme is now active
