---
name: openclaw-auto-dream-safe
description: "Hardened local variant of openclaw-auto-dream for supervised memory consolidation only. Use when the user explicitly asks for manual memory consolidation review."
---

# OpenClaw Auto-Dream Safe

## Purpose
A narrowed, review-first local variant of openclaw-auto-dream.

This version is intentionally limited.
It is designed to support supervised memory consolidation without broad automation.

## Scope
This skill may:
- read `MEMORY.md`
- read daily memory logs
- extract decisions, facts, lessons, progress, and procedures
- propose conservative updates
- write reviewed changes to memory files only when explicitly asked

This skill must not, by default:
- create cron jobs
- run automatically after install
- generate dashboards
- export or import memory bundles
- archive or forget old entries
- auto-install plugins
- modify OpenClaw config

## Allowed Files
- `MEMORY.md`
- `memory/YYYY-MM-DD.md`
- `memory/procedures.md`
- `memory/dream-log.md`

## Setup Rules
- create missing memory support files only if the user explicitly approves
- do not create cron jobs
- do not enable background automation
- do not mark files as consolidated automatically unless the user approves the run outcome

## Manual Use Only
Use only when the user explicitly asks for:
- manual memory consolidation
- memory review
- memory cleanup planning
- supervised memory maintenance

## Safe Operating Flow
1. Read relevant memory files
2. Extract candidate updates
3. Show a concise review summary first
4. Only write changes after user approval
5. Keep changes conservative and easy to audit

## Safety Rules
1. Never delete daily logs
2. Never archive or remove memory automatically
3. Never create scheduled tasks automatically
4. Never export or import memory bundles automatically
5. Keep all changes inside workspace memory files
6. Prefer append/update over restructuring
7. If changes are large, create a backup before writing

## Output Rule
Always present a short proposed-change summary before writing.
Review first, write second.
