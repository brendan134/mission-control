---
name: weekly-review
description: Automated weekly digest of metrics, tasks, and system status. Use for: (1) Friday weekly review sessions, (2) summarizing week's progress, (3) planning next week's priorities, (4) checking cron job health.
---

# Weekly Review

## Gather Metrics

### From Mission Control
```bash
# Task completion
curl -s http://localhost:3003/api/tasks | jq '.tasks | length'

# Active projects
curl -s http://localhost:3003/api/projects | jq '.projects | length'

# Cron status
openclaw cron list
```

### From Memory
- Review `memory/YYYY-MM-DD.md` for the week
- Note significant decisions or achievements

## Review Template

### This Week
- **Completed**: [List key tasks finished]
- **Wins**: [What went well]
- **Challenges**: [What was difficult]

### Metrics
- Tasks completed: X
- Active projects: X
- Revenue/spend: $X

### System Health
- Cron jobs running: X/Y
- Any failures?

### Next Week
- [ ] Priority 1
- [ ] Priority 2
- [ ] Priority 3

## Execution

The Friday 7am cron job triggers this review. Generate a summary and save to:
- Daily memory file
- Update MEMORY.md with key insights

## Automations to Check
- GitHub auto-sync (8am & 8pm)
- Daily cost alert (8pm)
- Weekly content batch (Mon 6am)
- Weekly review (Fri 7am)