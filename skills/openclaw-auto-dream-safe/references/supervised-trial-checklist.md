# Supervised Trial Checklist

## Purpose
Use this checklist before trusting the safe variant for real memory maintenance.

## Pre-Run
- [ ] Backup `MEMORY.md`
- [ ] Backup `memory/`
- [ ] Confirm scope is manual only
- [ ] Confirm no cron or automation will be created
- [ ] Confirm no import/export actions will run

## During Trial
- [ ] Read only intended files
- [ ] Produce review summary before any write
- [ ] Check proposed additions are accurate
- [ ] Check proposed updates are conservative
- [ ] Check duplicates are correctly identified
- [ ] Check uncertain items are explicitly flagged

## Write Approval
- [ ] Approve only after review summary looks correct
- [ ] Limit writes to memory files only
- [ ] Prefer append/update over restructuring

## Post-Run Review
- [ ] Review diffs in `MEMORY.md`
- [ ] Review diffs in any updated memory files
- [ ] Confirm no unexpected files were created
- [ ] Confirm no existing content was lost
- [ ] Confirm no sensitive data was unnecessarily propagated

## Acceptance Test
Only consider broader use if:
- [ ] output quality is strong
- [ ] changes are easy to understand
- [ ] no risky behaviour occurred
- [ ] memory quality improved rather than degraded

## Rule
One good supervised run does not justify full automation.
Expand scope slowly and deliberately.
