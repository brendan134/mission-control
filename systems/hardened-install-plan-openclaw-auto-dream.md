# Hardened Install Plan — openclaw-auto-dream

## Goal
Adopt the useful parts of openclaw-auto-dream without introducing unnecessary risk.

## Approach
Create a local hardened variant instead of installing the upstream skill unchanged.

## Phase 1 — Preparation
1. Clone or copy the upstream repo into a review folder only
2. Back up current memory files before any test run:
   - `MEMORY.md`
   - `memory/`
3. Review and trim the skill prompts before use

## Phase 2 — Hardening Changes
Modify the local variant so that:
- cron is not created automatically
- import/export features are disabled initially
- dashboard generation is disabled initially
- archival behaviour is disabled initially
- first run is manual only
- outputs are limited to reviewable file updates

## Phase 3 — Supervised Manual Trial
1. Run one manual consolidation cycle only
2. Review all file diffs
3. Check for:
   - incorrect memory changes
   - duplicated content
   - missing context
   - overly aggressive edits
4. Accept only if output quality is strong

## Phase 4 — Controlled Expansion
Only after successful manual trials:
- optionally enable dashboard generation
- optionally enable archival
- optionally enable cron scheduling

## Phase 5 — Ongoing Controls
- keep backups before major runs
- log important setup or scope decisions
- review memory quality regularly
- avoid enabling import/export unless specifically needed

## Adoption Rule
The local hardened variant must remain narrower in scope than the upstream version until trust is earned through real use.
