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

## Last Verified
2026-04-12 18:07 UTC
