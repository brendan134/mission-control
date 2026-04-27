# HEARTBEAT.md - Lightweight periodic checks

# Run 3x daily: morning (8am), afternoon (1pm), evening (6pm)
# Each check should take <30 seconds and use low-cost model

## Morning Check (8 AM Sydney)
- Check emails (unread, urgent)
- Any calendar events in next 24h?
- **Kaizen Review:** If triggered, log to memory/YYYY-MM-DD.md before responding
- ~~**TODO:** Add Kaizen to Team page and Office page in Mission Control~~ (DONE)

## Afternoon Check (1 PM Sydney)
- GitHub sync status (any unpushed changes?)
  - Run `git status` in workspace AND `/data/.openclaw`
  - Push if ahead: `git push origin master && git push internal master` (workspace)
  - Push if ahead: `cd /data/.openclaw && git push origin master` (config)
- Check if Mission Control is healthy
- Check PM2 services: `pm2 list`
- Check tunnel: `pm2 logs cloudflared --lines 3`

## Evening Check (6 PM Sydney)
- Review memory file exists for today
- Check for any pending cron failures
- **UPDATE:** Run `openclaw cron list` and update backup-crons.md if changes detected
- **END-OF-DAY COMPACTION (MANDATORY):**
  1. Scan for any new files created today in workspace that aren't logged in today's daily
  2. New files check: `find /data/.openclaw/workspace -type f -mtime -1 | grep -v node_modules | grep -v .git | grep -v .next`
  3. For each new file, append audit entry to today's daily log (see Audit Trail Protocol below)
  4. If cron/sub-agent ran, verify its work was logged — if not, add entry now
- **END-OF-SESSION SYNC (Big Tasks / End of Day):**
  - Copy today's memory to Obsidian: `cp memory/$(date +%Y-%m-%d).md obsidian/01-daily-logs/`
  - Push workspace: `git add . && git commit -m "Session" && git push origin master && git push internal master`
  - Verify all repos synced

## Weekly Audit (Friday afternoon)
- Run `git status` - should be clean or just today's memory
- Run `ls -d */ | sort` - verify canonical structure
- Check for any duplicate directories or files with spaces
- Verify no typo directories (ISSION*, temp_*, workspace-*)
- Ensure pre-commit hook is active: `cat .git-hooks/pre-commit`
- Check disk space: `df -h /data`
- **FULL REPO SYNC:**
  - [ ] workspace → origin (public): `git push origin master`
  - [ ] workspace → internal (private): `git push internal master`
  - [ ] openclaw config: `cd /data/.openclaw && git push origin master`
  - Verify all 3 repos are at same commit

## Monthly Agent Review (1st Friday)
- Run agent-evaluator skill to review past month's outputs
- Aggregate scores from business/agent-scorecard.md
- Identify trends: which agents improving/declining
- Update SPECIALISTS.md prompts if needed
- **FUTURE:** Add Agent Scorecard page to Mission Control

---

# MEMORY INTEGRITY PROTOCOL (World-Class)

## Three Safeguards

### 1. Hard Rule: No Work Completes Without Logging
**Every task, extraction, or sub-agent run must log to daily memory BEFORE completion.**

Template for task completion:
```markdown
### [TIME] - [TASK NAME] Complete
- **What:** [Description of work done]
- **Files:** [List of files created/modified]
- **Source:** [manual/cron/sub-agent name]
```

### 2. Audit Trail: Auto-Log File Creations
When creating new files, always append audit entry to today's daily log:
```markdown
### [TIME] - File Created
- **File:** /path/to/file.md
- **Description:** [What it is]
- **Source:** [session/cron/sub-agent]
```

### 3. End-of-Day Compaction (Evening Check)
Every evening, verify all work is logged:
1. Scan for files modified today: `find /data/.openclaw/workspace -type f -mtime -1`
2. Cross-reference with today's daily log
3. Add any missing entries
4. This catches work done by crons, sub-agents, or manual processes

## Enforcement
- If daily log doesn't reflect today's work → work is NOT done
- Before responding "done" to user → verify logging completed
- Evening compaction is MANDATORY — no exceptions

### Cron Job Status Updates (Evening Check)
- **Weekly Cost Audit**: Error (was ok in backup)
## Content Pipeline Check (Evening)
- Check content/pipeline.md for items in "Sent to Dom" > 48 hours
- If found, prompt: "Content awaiting scheduling for [client]"
