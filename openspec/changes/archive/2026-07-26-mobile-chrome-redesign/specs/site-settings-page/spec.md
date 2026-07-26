## MODIFIED Requirements

### Requirement: Reduced motion is a real tri-state preference that disables real animation
The system SHALL let a visitor set reduced motion to System (the default, follows the OS `prefers-reduced-motion` setting), On, or Off, and SHALL actually suppress this site's existing animated transitions (the mobile nav panel's open/close transition, the page-outline's smooth scroll-to-section) whenever the resolved state is "reduced."

#### Scenario: An explicit "On" override suppresses animation regardless of OS preference
- **WHEN** a visitor sets reduced motion to On, even if their OS preference is not set to reduce motion
- **THEN** the mobile nav panel's open/close transition and the page outline's scroll-to-section both occur without animation

#### Scenario: "System" defers to the OS preference
- **WHEN** a visitor leaves reduced motion at System and their OS is set to prefer reduced motion
- **THEN** the same animations are suppressed as if they had explicitly chosen On

#### Scenario: An explicit "Off" override keeps animation even if the OS prefers reduced motion
- **WHEN** a visitor sets reduced motion to Off, even if their OS preference prefers reduced motion
- **THEN** the mobile nav panel's open/close transition and the page outline's scroll-to-section both animate normally
