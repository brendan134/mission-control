---
name: client-onboarding
description: Template workflows for new client setup. Use when: (1) adding a new client to the system, (2) setting up client accounts and permissions, (3) preparing welcome materials, (4) planning kickoff calls.
---

# Client Onboarding

## New Client Checklist

### Pre-Kickoff
- [ ] Collect client info (goals, challenges, metrics)
- [ ] Set up client folder in workspace
- [ ] Create client-specific data views
- [ ] Prepare welcome email template
- [ ] Schedule kickoff call

### Kickoff Call Agenda
1. Introductions (5 min)
2. Goals & success metrics (15 min)
3. Current challenges (10 min)
4. Communication preferences (5 min)
5. Next steps & timeline (10 min)
6. Q&A (15 min)

### Post-Kickoff
- [ ] Send follow-up email with recap
- [ ] Set up first month milestones
- [ ] Create client dashboard/access
- [ ] Schedule regular check-ins
- [ ] Add to calendar for ongoing reviews

## Client Intake Form Fields
- Business name & industry
- Primary goal (what success looks like)
- Current biggest challenge
- Key metrics to track
- Preferred communication style
- Budget/timeline
- Decision makers

## File Structure
```
/clients/<client-name>/
  ├── onboarding/
  │   ├── kickoff-notes.md
  │   └── checklist.md
  ├── metrics/
  └── communications/
```

## Templates
- See `references/welcome-email.md`
- See `references/kickoff-agenda.md`