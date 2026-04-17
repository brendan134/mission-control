---
name: log-parser
description: Analyze PM2 and system logs for errors and trends. Use when: (1) checking if services are running properly, (2) diagnosing crashes or failures, (3) reviewing error patterns, (4) monitoring system health.
---

# Log Parser

## PM2 Logs

### View recent logs
```bash
pm2 logs mission-control --lines 50 --nostream
```

### View errors only
```bash
pm2 logs mission-control --err --lines 30 --nostream
```

### Follow live
```bash
pm2 logs mission-control
```

### Common Error Patterns

**Module not found**: Missing npm package → `npm install`

**Port in use**: Another process on port 3003 → `lsof -i :3003`

**Memory issues**: Node running out of RAM → check with `pm2 monit`

**Process exited**: Crash → check error message in logs

## System Logs

```bash
# Check if service is running
pm2 status

# Restart service
pm2 restart mission-control

# Check memory/CPU
pm2 monit
```

## Quick Health Check
```bash
pm2 status && pm2 logs mission-control --lines 10 --nostream
```