## REMOVED Requirements

### Requirement: Method renders as a showcase index of experiment-driven pages
**Reason**: The Method/Narrative story-type organization is retired in favor of a subject-based one (Farpost / Sreditor / Tech-Stacks). Method had exactly one member (Sreditor) for its entire lifetime; Sreditor is promoted to its own top-level page instead of remaining the sole entry in an index built to hold it.
**Migration**: Sreditor moves from `/method/sreditor` to `/sreditor`, a real top-level destination. The `/method` route is removed with no redirect.

### Requirement: Method-type project pages follow a fixed section structure
**Reason**: The PROBLEM/EXISTING_APPROACHES/HYPOTHESIS/METHOD/RESULTS/CONCLUSION structure was defined specifically for Method-type pages, a category that no longer exists. Sreditor's new section structure is defined directly in `sreditor-page-content` instead of inherited from a shared Method-type template.
**Migration**: See `sreditor-page-content`'s modified requirements for Sreditor's new four-section structure (ORIGIN_STORY, PROBLEMS_SREDITOR_SOLVES, SRED_ELIGIBILITY_EXAMPLE, PROCESS).
