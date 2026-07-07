## Why

Once a visitor navigates to Portfolio, Farpost, or Dev Log, there's currently no way back to the homepage other than the browser's back button — the menu only lists those three destinations, and the "$ Robin Samways" header text isn't a link.

## What Changes

- Add "Home" as the first item in the navigation menu, above Portfolio/Farpost/Dev Log.
- Make the "$ Robin Samways" header text a link to `/`, in addition to the menu entry.

## Capabilities

### Modified Capabilities
- `site-navigation`: the menu now includes a "Home" link, and the header title becomes a link to the homepage.

## Impact

- `web`: `Header.tsx` (link the title text) and the menu component (add a Home entry, first position).
