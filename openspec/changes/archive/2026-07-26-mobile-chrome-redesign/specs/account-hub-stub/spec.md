## MODIFIED Requirements

### Requirement: An Account icon in the nav rail links to a placeholder account page
The system SHALL show exactly one of two icons in the shared nav icon set (mobile top-bar cluster and desktop persistent rail), reflecting the visitor's real session state: a Sign In icon linking to `/sign-in` when no session exists, or an Account icon linking to `/account` when one does. The two SHALL never both appear at once, and the swap SHALL reflect a sign-in or sign-out that happens while the icon set is already visible, without requiring a full page reload.

#### Scenario: A signed-out visitor sees Sign In, not Account
- **WHEN** a visitor with no stored session views the nav icon set on any page
- **THEN** a Sign In icon linking to `/sign-in` appears, and no Account icon is shown

#### Scenario: A signed-in visitor sees Account, not Sign In
- **WHEN** a visitor with a stored session views the nav icon set on any page
- **THEN** an Account icon linking to `/account` appears, and no Sign In icon is shown

#### Scenario: Signing out swaps the icon back without a reload
- **WHEN** a signed-in visitor ends their session while the nav icon set is visible
- **THEN** the Account icon is replaced by the Sign In icon without requiring a full page reload

### Requirement: /account is an honest placeholder until the real hub exists
Visiting `/account` SHALL show a plain statement that the account hub isn't live yet, rather than a fake or partially-working experience — the same honesty standard `/sign-in` held before `account-auth` existed. When a visitor has an active session, the page SHALL additionally show a working Sign Out control that ends the session and returns the visitor to the homepage; when no session exists, no Sign Out control is shown.

#### Scenario: Visiting the account page shows a not-live-yet message
- **WHEN** a visitor navigates to `/account`
- **THEN** the page states plainly that this feature isn't live yet, with no misleading functional UI

#### Scenario: A signed-in visitor sees a working Sign Out control
- **WHEN** a signed-in visitor navigates to `/account`
- **THEN** the page shows the not-live-yet message alongside a working Sign Out button

#### Scenario: Signing out ends the session and returns home
- **WHEN** a signed-in visitor on `/account` activates the Sign Out button
- **THEN** their session ends, the nav icon set reflects the signed-out state, and they land on the homepage

#### Scenario: A signed-out visitor sees no Sign Out control
- **WHEN** a visitor with no stored session navigates to `/account` directly
- **THEN** the page shows only the not-live-yet message, with no Sign Out control
