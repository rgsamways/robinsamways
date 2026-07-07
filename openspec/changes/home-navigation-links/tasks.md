## 1. Navigation

- [x] 1.1 Add "Home" as the first item in the menu component, linking to `/`, above Portfolio/Farpost/Dev Log
- [x] 1.2 Confirm selecting Home closes the menu and navigates correctly, same as the other menu links
- [x] 1.3 Wrap the "$ Robin Samways" header text in a link to `/` in `Header.tsx`, preserving the existing `$` accent-color styling
- [x] 1.4 Confirm the header title link doesn't trigger the menu toggle or otherwise interfere with the existing header layout (including the fixed-width toggle button fix from the earlier layout-shift issue)

## 2. Verification

- [x] 2.1 Confirm on the homepage: header title link and Home menu item both present, both navigate to `/` without error
- [x] 2.2 Confirm on each placeholder page (Portfolio, Farpost, Dev Log): header title link and Home menu item both navigate back to the homepage
- [x] 2.3 Run `npm run build` and confirm it succeeds
- [x] 2.4 Check for zero console warnings across all four routes
