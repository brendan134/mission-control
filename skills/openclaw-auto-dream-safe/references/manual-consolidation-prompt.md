# Manual Consolidation Prompt

Use this prompt only for supervised memory review and consolidation.

## Goal
Review recent memory files, identify candidate long-term memory updates, and propose conservative changes.

## Scope
Read only:
- `MEMORY.md`
- recent `memory/YYYY-MM-DD.md` files
- `memory/procedures.md` if it exists

Do not:
- create cron jobs
- archive old memory
- generate dashboards
- export or import bundles
- modify config
- mark files as consolidated automatically

## Steps
1. Read the relevant memory files
2. Extract:
   - decisions
   - lessons
   - project progress
   - preferences or procedures
   - open threads
3. Compare extracted items against existing `MEMORY.md`
4. Prepare a short review summary with:
   - proposed new entries
   - proposed updates
   - duplicates skipped
   - any uncertainties
5. Stop and ask for approval before writing
6. If approved, make conservative updates only
7. If changes are substantial, create a backup first

## Output Format
### Review Summary
- New:
- Updates:
- Duplicates skipped:
- Uncertain items:

### Proposed Write Scope
- files to update:
- type of change:

## Operating Rule
Review first, write second.
Keep changes conservative and easy to inspect.
