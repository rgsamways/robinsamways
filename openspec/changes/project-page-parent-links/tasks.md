## 1. Add parent-index links

- [x] 1.1 Add a link back to `/narrative` in `web/src/app/narrative/credential-flow/page.tsx`'s local `HamburgerMenu` link list, alongside its existing 7 section links — label it clearly as "Narrative" (or similar), distinct from the section links
- [x] 1.2 Add a link back to `/narrative` in `web/src/app/narrative/farpost-pulse/page.tsx`'s local `HamburgerMenu` link list, alongside its existing 5 section links
- [x] 1.3 Leave Farpost's local menu untouched — it has no parent index to link back to

## 2. Verification

- [x] 2.1 Confirm Credential Flow's local menu shows both its 7 section links and a working link back to `/narrative`
- [x] 2.2 Confirm Farpost Pulse's local menu shows both its 5 section links and a working link back to `/narrative`
- [x] 2.3 Confirm Farpost's local menu is unchanged (still just its 4 section links, no parent link added)
- [x] 2.4 `npm run build` clean, no console warnings
