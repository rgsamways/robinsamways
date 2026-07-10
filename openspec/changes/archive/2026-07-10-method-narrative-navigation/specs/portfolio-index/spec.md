## REMOVED Requirements

### Requirement: Portfolio renders as a showcase index
**Reason**: Portfolio as a concept is retired. It's superseded by the `method-index` and `narrative-index` capabilities, which split its single generic index into two typed indexes organized by what kind of story a project page tells.
**Migration**: Visitors follow the global nav's new Method and Narrative entries instead of Portfolio. `/portfolio` no longer resolves — no redirect, per this change's design.md.

### Requirement: Salesforce Loan Demo content lives at its own route
**Reason**: Salesforce Loan Demo (renamed Credential Flow) relocates again, from `/portfolio/salesforce-loan-demo` to `/narrative/credential-flow`, as an entry under the new Narrative index rather than Portfolio.
**Migration**: See the `narrative-index` capability's "Credential Flow content lives at its own route" requirement, and the `salesforce-loan-demo` capability's updated route references.
