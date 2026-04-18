# Agent Routing Guide

When to use which agent for maximum effectiveness.

## Quick Reference

| Need | Use Agent | Tier | Model |
|------|-----------|------|-------|
| Business strategy, decisions, growth | **Marcus** (strategy) | C | kimi (or gpt-4o for critical) |
| Copy, hooks, offers, messaging | **Alex** (messaging) | C | kimi |
| LinkedIn posts, emails, content | **Sarah** (content) | B | minimax |
| Lessons, worksheets, courses | **Emily** (curriculum) | C | kimi |
| Coaching notes, QSGP, client notes | **Jordan** (client-delivery) | B | minimax |
| Podcast titles, clips, show notes | **Chris** (podcast) | B | minimax |
| Community posts, engagement | **Sam** (community) | B | minimax |
| Research, analysis, competitors | **Taylor** (research) | C | kimi |
| Save/retrieve knowledge | **knowledge** | A | flashlite |
| Business improvement ideas | **Kaizen** | B | kimi |
| System/technical issues | **Niles** (main) | A | minimax |

## Detailed Guidelines

### Niles (Main Agent)
**Use for:**
- General conversation and coordination
- Routing tasks to specialists
- System operations, PM2, cron
- File management, Git operations
- Anything not covered by specialists

**Don't use for:**
- Content creation → Sarah
- Strategy decisions → Marcus
- Client delivery → Jordan

### Marcus (Strategy)
**Use for:**
- Business model questions
- Offer design
- Growth planning
- Scaling decisions
- Prioritization

**When to escalate:**
- Complex financial decisions
- Major pivots

### Sarah (Content)
**Use for:**
- LinkedIn posts
- Newsletter content
- Email drafts
- Social media
- Basic repurposing

**Limitations:**
- Not for complex campaigns (→ Marcus)
- Not for long-form (→ curriculum)

### Jordan (Client Delivery)
**Use for:**
- Coaching summaries
- QSGP formatting
- Meeting prep
- Client follow-ups

**Never use for:**
- Content creation (→ Sarah)
- Strategy (→ Marcus)

### Kaizen (Business Improvement)
**Use for:**
- Identifying inefficiencies
- Process improvements
- Daily system review
- Opportunity spotting

**Output:**
- One high-impact suggestion per run
- Always tied to North Star

## Escalation Path

```
Task comes in
    │
    ▼
Is it technical? ──Yes──► Niles
    │
    No
    │
    ▼
Is it content/social? ──Yes──► Sarah
    │
    No
    │
    ▼
Is it strategic? ──Yes──► Marcus
    │
    No
    │
    ▼
Is it client delivery? ──Yes──► Jordan
    │
    No
    │
    ▼
Is it research? ──Yes──► Taylor
    │
    No
    │
    ▼
Default: Niles decides
```

## Common Mistakes

| Mistake | Problem | Correct Agent |
|---------|---------|---------------|
| Asking Niles for content | Niles is generalist | Sarah |
| Asking Sarah for strategy | Content is output, not strategy | Marcus |
| Asking Marcus for LinkedIn post | Wrong output type | Sarah |
| Asking Niles to research | Waste of Niles' time | Taylor |

## Quick Reminder

If unsure, ask Niles to route to the right agent. That's what I'm here for.

## Premium Model: GPT-4o

For critical strategy calls, you can use GPT-4o for higher quality.

**When to use:**
- Major business pivots
- High-stakes offer design
- Complex growth decisions
- When kimi's output isn't quite right
- **When I recommend it:** If kimi's response doesn't meet world-class standards, I'll flag it and ask before upgrading

**How to use:**
- Ask: "Use GPT-4o for this strategy task"
- Or wait for my suggestion: "This is complex - want me to run it through GPT-4o for better quality?"
- Cost: ~$2-5 per task (significant jump from kimi's ~$0.15)
- **Always get your approval first** before using GPT-4o