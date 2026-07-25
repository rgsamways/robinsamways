## ADDED Requirements

### Requirement: An Account icon in the nav rail links to a placeholder account page
The system SHALL show an Account icon in the shared nav rail (mobile slide-in panel and desktop persistent rail), above the Sign In icon, linking to `/account`.

#### Scenario: The Account icon is visible on every page
- **WHEN** a visitor opens the nav rail on any page
- **THEN** an Account icon is present, positioned above the Sign In icon and above the theme toggle

### Requirement: /account is an honest placeholder until the real hub exists
Visiting `/account` SHALL show a plain statement that the account hub isn't live yet, rather than a fake or partially-working experience — the same honesty standard `/sign-in` held before `account-auth` existed.

#### Scenario: Visiting the account page shows a not-live-yet message
- **WHEN** a visitor navigates to `/account`
- **THEN** the page states plainly that this feature isn't live yet, with no misleading functional UI
