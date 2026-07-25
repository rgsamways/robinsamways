## REMOVED Requirements

### Requirement: Lightbulbs page surfaces docs/lightbulbs entries publicly
**Reason**: Per this change's `design.md` (flagged there as a recommendation pending confirmation, not a silent default): project-specific lightbulb ideas now surface under that project's own Lightbulbs page (`farpost-project-record`, `vocare-project-record`, `sreditor-project-record`). Genuinely cross-project or meta ideas (ones with no single owning project) fit Dev Log's own explicit framing — "experiences and findings... any time something interesting happens" — better than a third, separate bucket, so they surface as ordinary Dev Log entries instead.
**Migration**: Audit every existing `docs/lightbulbs/` entry before removing this route. Entries with a clear owning project move to that project's `/lightbulbs` page. Entries with no single owning project (or genuinely about the site/methodology itself) become ordinary Dev Log entries. `/dev-log/lightbulbs` should redirect to `/dev-log` once the audit is complete.

### Requirement: A lightbulb entry that has graduated into a real change links to it
**Reason**: Superseded — see the requirement above. This behavior (linking to where a graduated idea ended up) is preserved wherever the entry is re-homed, whether that's a project's own Lightbulbs page or a Dev Log entry.
**Migration**: Whichever new home an entry gets (project-specific Lightbulbs page or Dev Log entry), it SHALL still link to its shipped outcome where one exists, per the original requirement's intent.
