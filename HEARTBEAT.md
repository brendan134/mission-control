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

## Evening Check (6 PM Sydney)
- Review memory file exists for today
- Check for any pending cron failures
- **UPDATE:** Run `openclaw cron list` and update backup-crons.md if changes detected