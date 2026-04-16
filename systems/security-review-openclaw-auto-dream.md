# Security Review — openclaw-auto-dream

## Date
- 2026-04-05

## Repository Reviewed
- https://github.com/LeoYeAI/openclaw-auto-dream

## Review Type
- code-level review of repository contents
- install risk assessment before adoption

## Summary Verdict
Do not install as-is.
If adopted, use a hardened local variant with reduced scope and supervised rollout.

## Why
The repository is primarily a prompt-and-skill repo rather than a deterministic code package.
That reduces direct code execution risk, but it increases prompt-driven behaviour risk.

The skill is designed to:
- read and consolidate memory files
- rewrite memory structures
- mark daily logs as consolidated
- generate reports
- create cron automation
- support import/export of memory bundles
- generate derived dashboard artifacts

## Main Risks

### 1. Memory Integrity Risk
The skill can rewrite or reorganise:
- `MEMORY.md`
- `memory/procedures.md`
- `memory/index.json`
- `memory/archive.md`
- `memory/episodes/*.md`
- daily log markers

Risk:
- incorrect consolidation
- over-aggressive summarisation
- memory drift
- duplicated or distorted long-term records

### 2. Background Automation Risk
The skill creates a scheduled cron job by default.

Risk:
- recurring unsupervised writes
- recurring notifications
- gradual drift over time

### 3. Sensitive Data Propagation Risk
The skill can move or restate sensitive content across more files.

Risk:
- sensitive data becomes more visible
- derived artifacts increase exposure surface
- exports and dashboards may widen access unintentionally

### 4. Import / Export Risk
Cross-instance migration is useful but sensitive.

Risk:
- imported bundles may pollute memory
- merge conflicts may degrade memory quality
- exported bundles may contain sensitive business or personal context

### 5. Prompt-Driven Variability Risk
Because behaviour is prompt-driven, outcomes depend heavily on model quality and prompt execution consistency.

Risk:
- inconsistent quality
- hard-to-predict consolidation outcomes
- lower auditability than deterministic code

## Positive Findings
- no obvious package/runtime code payload found
- no auto-install plugin behaviour in SKILL.md
- no explicit external API dependency required
- backups and safety checks are described
- cron uses isolated session execution

## Recommended Position
Use a hardened local variant only.
Do not adopt the upstream skill unchanged.

## Hardened Adoption Rules
- no automatic cron creation on first install
- no import/export enabled initially
- no dashboard generation initially
- no archival initially
- supervised manual run first
- backup current memory before every test run
- compare outputs before accepting consolidation changes

## Final Recommendation
Adopt only through a local reviewed copy with scope reduced to supervised consolidation.
