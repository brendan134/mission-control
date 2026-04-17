---
name: system-audit
description: Run comprehensive system health audit. Use when: (1) checking system health, (2) verifying services after restart, (3) troubleshooting issues, (4) pre-cleanup verification.
---

# System Audit

Comprehensive health check for the OpenClaw system.

## Quick Check (30 seconds)

```bash
pm2 list
curl -s http://localhost:3003/ | head -5
git -C /data/.openclaw/workspace status
```

## Full Audit Checklist

### 1. PM2 Services
```bash
pm2 list
```
Expected:
- [ ] mission-control running
- [ ] cloudflared running (if tunnel needed)
- [ ] No error status

### 2. Mission Control
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3003/
```
Expected: `200`

### 3. Git Status
```bash
cd /data/.openclaw/workspace
git status
```
Expected: Clean or uncommitted new files only

### 4. GitHub Sync
```bash
git log --oneline -3
```
Expected: Recent commits from today

### 5. Disk Space
```bash
df -h /data
```
Expected: < 80% used

### 6. Memory Usage
```bash
free -h
```
Expected: < 80% used

### 7. Cron Jobs
```bash
openclaw cron list
```
Expected: All enabled jobs listed

### 8. Tunnel (if external access needed)
```bash
pm2 logs cloudflared --lines 5 --nostream
```
Expected: "Registered tunnel connection"

## Report Template

After audit, report:
```
=== System Audit - [DATE] ===

PM2 Status: ✅/❌
Mission Control: ✅/❌ (HTTP [code])
Git Status: ✅/❌
GitHub Sync: ✅/❌
Disk: [X]% used
Memory: [X]% used
Cron Jobs: [X] running
Tunnel: ✅/❌

Issues Found:
- [list any problems]

Actions Taken:
- [any fixes applied]
```

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| PM2 not running | `pm2 start ecosystem.config.js` |
| Port 3003 not responding | Check mission-control logs: `pm2 logs mission-control` |
| Git not clean | Review `git status`, commit or restore |
| Tunnel down | `pm2 restart cloudflared` |
| Disk full | Run cleanup: `pm2 flush` |

## When to Use

- Daily startup check
- After any system restart
- Before cleanup operations
- After restore from backup
- Weekly maintenance