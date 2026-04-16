# Local Safe Fork Strategy — openclaw-auto-dream

## Purpose
Create a local, reviewed, safer version of the skill for Leader By Design.

## Strategy
Do not use the upstream repo directly as the production version.
Create a local reviewed copy inside the workspace or local skills area and maintain it deliberately.

## Local Variant Goals
- preserve useful memory consolidation ideas
- reduce automated risk
- keep behaviour reviewable
- align with file-first and portability rules

## Recommended Local Variant Scope
### Keep
- manual memory consolidation prompt
- structured extraction of decisions, lessons, progress, and procedures
- safety reminders and backup behaviour

### Remove or Disable Initially
- automatic cron creation
- first-dream automation
- dashboard generation
- import/export bundle operations
- archival / forgetting behaviour
- automated notifications beyond simple supervised summaries

## Proposed Operating Mode
- user-triggered only
- review-first
- write to files conservatively
- no irreversible restructuring
- no broad automation until validated

## Review Workflow
1. upstream repo reviewed in temp folder
2. local copy created
3. prompts simplified and narrowed
4. one supervised run tested
5. outputs reviewed
6. only then considered for broader use

## Versioning Rule
Treat the local variant as a maintained internal asset.
Document:
- what was changed from upstream
- why it was changed
- what remains disabled
- when to revisit those decisions

## Recommendation
If adopted, store the local hardened version as a controlled internal skill rather than an unreviewed third-party dependency.
