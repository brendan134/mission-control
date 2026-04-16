# Cron Jobs Backup
# Last updated: 2026-04-16 20:12 Sydney time
# NOTE: Update this file whenever cron jobs are added, removed, or modified
# Run: openclaw cron list > backup-crons.md (or manually copy from cron list)

## Active Cron Jobs (9 total)

### 1. Weekly Review
- **ID:** 39f76...
- **Schedule:** Friday 7:00 AM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** Cost audit, system health check, session summary → Telegram
- **Delivery:** Telegram announce

### 2. Daily News Brief
- **ID:** ea577...
- **Schedule:** Daily 7:00 AM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** TOP 5 Global news, TOP 5 Australia news, Sport → Telegram
- **Delivery:** Telegram (to: 8637899728)

### 3. Daily Dream Reminder
- **ID:** bc45d...
- **Schedule:** Daily 7:30 AM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** Memory consolidation reminder → Telegram
- **Delivery:** Telegram (to: 8637899728)

### 4. Daily Cost Alert
- **ID:** 35c4b...
- **Schedule:** Daily 8:00 PM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** Check daily spend, alert if >$4 → Telegram
- **Delivery:** Telegram (to: 8637899728)

### 5. Daily Memory Save Reminder
- **ID:** b7aaaf...
- **Schedule:** Daily 8:30 PM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** Write daily summary to memory/YYYY-MM-DD.md
- **Delivery:** announce (no Telegram)

### 6. Auto-Backup to GitHub
- **ID:** c93eee...
- **Schedule:** Daily 10:00 PM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** git add -A && git commit && git push
- **Delivery:** announce (no Telegram)

### 7. Weekly Cost Audit
- **ID:** 36d23...
- **Schedule:** Sunday 8:00 PM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** Deep cost analysis, model efficiency, recommendations → Telegram
- **Delivery:** Telegram (to: 8637899728)

### 8. Weekly Content Batch
- **ID:** 7b16d...
- **Schedule:** Monday 6:00 AM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** 3 LinkedIn posts + 1 newsletter segment → save to content/
- **Delivery:** Telegram (to: 8637899728)

### 9. Monthly Cost Review
- **ID:** e5c4f...
- **Schedule:** 1st of month 7:00 AM (Australia/Sydney)
- **Type:** systemEvent (main session)
- **Action:** Alert to run monthly review
- **Delivery:** main session (systemEvent)

---

## Migration Notes
When moving to Mac Mini:
1. Install OpenClaw
2. Recreate these 9 cron jobs with same schedules/payloads
3. Re-pair Telegram (send message to OpenClaw bot)
4. API keys stored in environment, re-enter as needed
