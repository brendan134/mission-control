---
name: backup-automation
description: Create system backups before risky operations. Use when: (1) before cleanup, (2) before restore, (3) before major changes, (4) periodic backup.
---

# Backup Automation

Always backup before risky operations.

## Why Backup First

Today's cleanup could have gone wrong if:
- We accidentally deleted wrong directory
- Git operations failed
- Restore didn't work

Having a backup means we can always recover.

## Quick Backup

```bash
cd /data/.openclaw/workspace

# Create timestamped backup
mkdir -p backups
tar -czf "backups/backup-$(date +%Y%m%d-%H%M%S).tar.gz" \
  memory/ \
  mission-control/src/ \
  business/ \
  content/ \
  packs/ \
  ecosystem.config.js

# List backups
ls -la backups/
```

## Pre-Cleanup Backup (Required)

Before any cleanup:
```bash
cd /data/.openclaw/workspace

# 1. Check current state
git status

# 2. Create backup
BACKUP_NAME="pre-cleanup-$(date +%Y%m%d)"
tar -czf "backups/${BACKUP_NAME}.tar.gz" .

# 3. Verify backup exists
ls -la backups/

# 4. Continue with cleanup
# ... risky operations here ...

# 5. If something goes wrong:
# tar -xzf "backups/${BACKUP_NAME}.tar.gz"
```

## What to Back Up

Priority order:
1. **memory/** - Daily work records
2. **mission-control/** - Application code
3. **business/** - Business content
4. **packs/** - IP/Methodology
5. **ecosystem.config.js** - Service config
6. **.env** (if exists) - Secrets (don't commit!)

## Keep Backups Manageable

```bash
# Keep only last 10 backups
ls -t backups/ | tail -n +11 | xargs -r rm

# Or use the backup script if exists
./scripts/backup.sh
```

## Recovery

If something goes wrong:
```bash
# Extract backup
tar -xzf backups/backup-YYYYMMDD-HHMMSS.tar.gz

# Verify
git status
ls -la

# Restore services
pm2 restart all
```

## When to Backup

- Before cleanup operations
- Before system restore
- Before major code changes
- Before migrating to new machine
- Weekly (optional)

## Pre-Flight Checklist

Before risky ops:
- [ ] Created backup
- [ ] Backup verified (check size > 0)
- [ ] Git status captured
- [ ] PM2 services noted
- [ ] Have recovery plan