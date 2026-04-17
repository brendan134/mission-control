# SAFETY LOCK - DO NOT MODIFY WITHOUT EXPLICIT USER APPROVAL

## Active Safeguards (Locked)

This file documents the safety measures that are **intentionally locked** and must not be changed unless explicitly instructed by the user.

### 1. Pre-Commit Hook (.git-hooks/pre-commit)
- Blocks commit of sensitive files (.env, credentials, *.pem, *.key)
- Auto-creates backup before deleting critical paths
- Critical paths: mission-*/src, MEMORY.md, business/, content/, curriculum/, packs/, workflows/

### 2. Backup Script (scripts/backup..sh)
- Creates timestamped tar.gz snapshots
- Keeps last 10 backups
- Backs up: MEMORY.md, mission-control/src, business/, content/, curriculum/, packs/, workflows/

### 3. Git Ignore (.gitignore)
- .env files (secrets)
- .git-auto-sync.log (contains sensitive data)
- node_modules/, .next/, backups/

---

## How to Unlock

To modify any of these safeguards, you must explicitly instruct via:
- Direct message with "unlock safeguards" or "modify safety"
- The lock will then be temporarily lifted for that specific change

### 4. Git Command Restrictions

The following Git commands must be avoided to prevent data loss:

**NEVER USE:**
- `git restore` - Discards local changes without warning
- `git checkout -- .` or `git checkout <file>` - Discards local modifications
- `git clean -fd` - Permanently deletes untracked files
- `git reset --hard` - Discards ALL local changes and commits
- `git stash drop` - Permanently deletes stashed changes
- `git rebase --abort` mid-rebase (if rebase is in progress)

**SAFE ALTERNATIVES:**
- Use `git status` to check state before any operation
- Use `git add` + `git commit` to save changes properly
- Use `git stash push -m "description"` to temporarily save changes
- Use `git diff` to review changes before committing
- For reverting: create a new commit that undoes changes (never hard reset)

### 5. Port Protection
- Mission Control: Port 3003 (configured in ecosystem.config.js)
- Do not change PORT without updating documentation
- Always check if port is in use before starting services

## Last Verified
2026-04-17 13:41 UTC
