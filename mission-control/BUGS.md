# Mission Control Bugs

## Open Bugs

### Cron Calendar Time Display Bug
- **Status:** Open
- **Priority:** Low
- **Description:** Cron jobs show incorrect times in Cron Calendar UI (e.g., shows 07:00 instead of 07:30, 23:00 instead of 23:30)
- **Root Cause:** UI rendering issue - the cron configuration itself is correct (`expr: "30 7 * * *"` for 7:30 AM)
- **Affected Jobs:**
  - Morning Kaizen Review: Shows 07:00 (should be 07:30)
  - Fathom Transcript Auto-Extract: Shows 23:00 (should be 23:30)
- **Fix Needed:** Investigate cron calendar component rendering logic
- **Reported:** 2026-04-26

---

## Fixed Bugs

(Add fixed bugs here with date resolved)