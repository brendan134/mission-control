# HEARTBEAT.md - Lightweight periodic checks

# Run 3x daily: morning (8am), afternoon (1pm), evening (6pm)
# Each check should take <30 seconds and use low-cost model

## Morning Check (8 AM Sydney)
- Check emails (unread, urgent)
- Any calendar events in next 24h?
- **TODO:** Add Kaizen to Team page and Office page in Mission Control

## Afternoon Check (1 PM Sydney)
- GitHub sync status (any unpushed changes?)
- Check if Mission Control is healthy
- Check PM2 services: `pm2 list`
- Check tunnel: `pm2 logs cloudflared --lines 3`

## Evening Check (6 PM Sydney)
- Review memory file exists for today
- Check for any pending cron failures
- **UPDATE:** Run `openclaw cron list` and update backup-crons.md if changes detected

## Weekly Audit (Friday afternoon)
- Run `git status` - should be clean or just today's memory
- Run `ls -d */ | sort` - verify canonical structure
- Check for any duplicate directories or files with spaces
- Verify no typo directories (ISSION*, temp_*, workspace-*)
- Ensure pre-commit hook is active: `cat .git-hooks/pre-commit`
- Check disk space: `df -h /data`