---
name: backup-manager
description: Verify GitHub backup status and data integrity. Use when: (1) checking if backups are working, (2) verifying sync status, (3) troubleshooting GitHub sync issues, (4) reviewing backup schedules.
---

# Backup Manager

## GitHub Repos

- **Workspace**: `brendan134/openclaw`
- **Mission Control**: `brendan134/mission-control`

## Check Sync Status

### Last commit
```bash
cd /data/.openclaw/workspace && git log -1 --oneline
```

### Unpushed changes
```bash
cd /data/.openclaw/workspace && git status
```

### Push to GitHub
```bash
cd /data/.openclaw/workspace && git add . && git commit -m "Update" && git push
```

## Cron Backup Jobs

List active backup cron jobs:
```bash
openclaw cron list
```

Check backup-related jobs:
- Auto-Backup to GitHub (10pm Sydney)
- Daily Cost Alert (8pm Sydney)

## Verify Backup Worked

1. Check cron ran: `openclaw cron runs <job-id>`
2. Check GitHub for recent commit
3. Check `git log --oneline` matches GitHub

## Manual Backup
```bash
cd /data/.openclaw/workspace
git add -A
git commit -m "Manual backup $(date)"
git push
```