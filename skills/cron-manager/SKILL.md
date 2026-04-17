---
name: cron-manager
description: Safely manage OpenClaw cron jobs. Use when: (1) creating new scheduled tasks, (2) fixing failing cron jobs, (3) updating schedules, (4) debugging delivery issues.
---

# Cron Manager

Safe operations for OpenClaw cron jobs.

## View All Cron Jobs

```bash
openclaw cron list
```

This shows:
- Job names
- Schedules
- Enabled/disabled status
- Last run status
- Next scheduled run

## Common Tasks

### View Specific Job Details
```bash
openclaw cron list --includeDisabled
```

### Run Job Immediately
```bash
openclaw cron run <job-id>
```

### Check Job History
```bash
openclaw cron runs <job-id>
```

## Create New Cron Job

Basic structure:
```bash
openclaw cron add \
  --name "My Daily Task" \
  --schedule "0 9 * * *" \
  --message "Task description" \
  --delivery announce
```

### Schedule Formats

**Daily at time:**
```bash
--schedule "0 9 * * *"  # 9:00 AM daily
```

**Weekly:**
```bash
--schedule "0 9 * * 1"  # 9:00 AM Monday
```

**Monthly:**
```bash
--schedule "0 9 1 * *"  # 9:00 AM 1st of month
```

### Delivery Options

| Option | Description |
|--------|-------------|
| `announce` | Send result to chat |
| `none` | Run silently |
| `webhook` | Send to URL |

## Troubleshooting

### Job Not Running
1. Check schedule is correct
2. Check job is enabled
3. Check logs: `pm2 logs`

### Telegram Delivery Failing
Common error: "Delivering to Telegram requires target <chatId>"

Fix: Use numeric chatId, not phone number
```bash
# Wrong:
--to "8637899728"

# Correct (if chatId known):
--to "<chatId>"
```

### Job Timing Out
Check if the task is too complex:
- Reduce scope
- Increase timeout
- Break into smaller jobs

## Important Notes

- All times in system timezone (check with `date`)
- Cron jobs run in isolated sessions by default
- Always test with `--delivery none` first

## Current Active Jobs (Reference)

From memory:
1. Daily News Brief - 7am Sydney
2. Weekly Content Batch - Monday 6am Sydney
3. Weekly Review - Friday 7am Sydney
4. Daily Cost Alert - 8pm Sydney
5. Monthly Cost Review - 1st of month 7am Sydney
6. Auto-Backup - 10pm Sydney
7. Daily Memory Save - 8:30pm Sydney

## Safety Rules

- Always check existing jobs before creating new ones
- Use descriptive job names
- Test delivery before relying on it
- Check cron list after making changes