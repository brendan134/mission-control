# Cron Jobs Backup
# Last updated: 2026-04-18 19:34 Sydney time
# NOTE: Update this file whenever cron jobs are added, removed, or modified
# Run: openclaw cron list > backup-crons.md (or manually copy from cron list)

## Active Cron Jobs (10 total)

### 1. Agent Status JSON Export
- **ID:** 7bc7b2a2-6cb4-4b02-b09c-1ae9bb49ecbd
- **Schedule:** Every 5 minutes
- **Type:** agentTurn (isolated)
- **Action:** Export agent status to JSON
- **Delivery:** none

### 2. Weekly Review
- **ID:** 39f7678e-f5a3-46a8-826b-ce53841d6827
- **Schedule:** Friday 7:00 AM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** Cost audit, system health check, session summary → Telegram
- **Delivery:** Telegram (to: 8637899728)

### 3. Daily News Brief
- **ID:** ea577e1a-8b50-42c1-8a9d-fcb84657a9ad
- **Schedule:** Daily 7:00 AM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** TOP 5 Global news, TOP 5 Australia news, Sport → Telegram
- **Delivery:** Telegram (to: 8637899728)

### 4. Kaizen Morning - Business Insights
- **ID:** 819d6780-09bd-424a-b5b8-217366ad635f
- **Schedule:** Daily 9:00 AM (Australia/Sydney)
- **Type:** agentTurn (isolated, model: kimi)
- **Action:** Morning business scan and insights
- **Delivery:** Telegram (to: 8637899728)

### 5. Daily Dream Reminder
- **ID:** bc4569f9-a49a-4bea-8824-f94b4891c08e
- **Schedule:** Daily 7:30 AM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** Memory consolidation reminder → Telegram
- **Delivery:** Telegram (to: 8637899728) ✅ FIXED

### 6. Daily Cost Alert
- **ID:** 35c4b1d8-354c-472d-955f-8bd42695746a
- **Schedule:** Daily 8:00 PM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** Check daily spend, alert if >$4 → Telegram
- **Delivery:** Telegram (to: 8637899728) ✅ FIXED

### 7. Daily Memory Save Reminder
- **ID:** b7aaaf0a-837f-42fa-a045-fe9fb6171880
- **Schedule:** Daily 8:30 PM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** Write daily summary to memory/YYYY-MM-DD.md
- **Delivery:** Telegram (to: 8637899728)

### 8. Auto-Backup to GitHub
- **ID:** c93eee39-1e08-4ea6-a75c-09d81857e819
- **Schedule:** Daily 10:00 PM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** git add -A && git commit && git push
- **Delivery:** Telegram (to: 8637899728) ✅ FIXED

### 9. Weekly Cost Audit
- **ID:** 36d2383d-58bb-49e9-906b-f6aa971a710c
- **Schedule:** Sunday 8:00 PM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** Deep cost analysis, model efficiency, recommendations → Telegram
- **Delivery:** Telegram (to: 8637899728) ✅ FIXED

### 10. Weekly Content Batch
- **ID:** 7b166462-a6bc-4b55-93dc-c968f36340db
- **Schedule:** Monday 6:00 AM (Australia/Sydney)
- **Type:** agentTurn (isolated)
- **Action:** 3 LinkedIn posts + 1 newsletter segment → save to content/
- **Delivery:** Telegram (to: 8637899728) ✅ FIXED

### 11. Monthly Cost Review
- **ID:** e5c4f813-eb25-4db8-b42c-9c74868de96c
- **Schedule:** 1st of month 7:00 AM (Australia/Sydney)
- **Type:** systemEvent (main session)
- **Action:** Alert to run monthly review
- **Delivery:** main session (systemEvent)

---

## Migration Notes
When moving to Mac Mini:
1. Install OpenClaw
2. Restore `backup-openclaw-config.json` to `~/.openclaw/openclaw.json`
3. Restart gateway: `openclaw gateway restart`
4. API keys stored in environment, re-enter as needed

---

## Config Backup
**File:** `backup-openclaw-config.json`
**Contains:** All cron jobs, channel configs, secrets refs, gateway settings
**Last backed up:** 2026-04-19
**To update:** `cp ~/.openclaw/openclaw.json /data/.openclaw/workspace/backup-openclaw-config.json`