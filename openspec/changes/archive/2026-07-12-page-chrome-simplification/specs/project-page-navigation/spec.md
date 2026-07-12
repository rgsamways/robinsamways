## REMOVED Requirements

### Requirement: Reusable per-heading local navigation menu
**Reason**: Every page that used this local menu now has a different, better-suited navigation mechanism: Farpost's own pill-tab bar (Origins/Atlas/Dispatch/Pulse), Tech/Stacks' pill-filter-plus-card-list, or simply top-to-bottom reading once section-jump links are removed. The local menu is redundant clutter across every page that had one.
**Migration**: No replacement. `HamburgerMenu` the component is unchanged and remains in use for the global site menu (`site-navigation`/`MenuToggle`) — only its per-page call sites are deleted.

### Requirement: Farpost's local menu links to its own sections
**Reason**: Farpost's pill-tab bar already provides cross-piece navigation; a section-jump local menu on top of it is redundant, and the section anchors it linked to are also being removed.
**Migration**: No replacement.

### Requirement: A project page's local menu links to its own sections and back to its parent index
**Reason**: Same as above — Atlas, Pulse, and Credential Flow's local menus are redundant now that Farpost's pill-tab bar and the Tech/Stacks index both provide direct navigation without needing a per-page menu.
**Migration**: No replacement.

### Requirement: Tech/Stacks' local menu links to its project pages
**Reason**: The Tech/Stacks index page already lists every project as a card below the pill filter; a local menu duplicating that same list is redundant.
**Migration**: No replacement.
