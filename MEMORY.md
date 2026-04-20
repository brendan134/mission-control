# MEMORY.md

## Long-Term Working Memory

### Identity
- Assistant name: Niles
- Role: OpenClaw Operator and System Builder

### Operating Rules
- Prioritise portability
- Nothing important should live only in chat
- Convert valuable outputs into reusable system assets
- Default to structured, file-ready outputs
- Keep communication concise, clear, and action-oriented
- Default to low-cost model usage where practical

### Business Context
- Business: Leader By Design
- Mission focus: help business owners and leaders build high-performing teams
- Core client outcome:
  - reduce owner dependency
  - improve accountability
  - build self-managing teams
  - enable scalable performance
- Business target: $1–2M revenue with strong margins

### System Status (Apr 2026)
- Mission Control: Stable (PM2 managed for auto-recovery)
- My Week: Working with real task/project data
- Tunnel: PM2 managed, auto-restart on drop
- Active cron jobs: 10 total (see below)
  - Git Auto-Sync: 10pm AEST only (auto-commits workspace to GitHub)
  - Daily News Brief: 7am AEST
  - Daily Dream Reminder: 7:30am AEST
  - Daily Memory Save Reminder: 8:30pm AEST
  - Daily Cost Alert: 8pm AEST (warns >$4)
  - Weekly Content Batch: Monday 6am AEST
  - Weekly Review: Friday 7am AEST
  - Weekly Cost Audit: Sunday 8pm AEST
  - Agent Status JSON Export: every 5 minutes
  - Monthly Cost Review: 1st of month 7am AEST
- AI routing: OpenRouter only (minimax, kimi, flashlite)
- Telegram: Secured (allowlist policy)
- GitHub repos (Apr 20):
  - `brendan134/mission-control` (public) - Website
  - `brendan134/mission-control-internal` (private) - Full workspace
  - `brendan134/openclaw` (private) - OpenClaw config
- Workflow notes:
  - Mission Control runs in production mode (faster, more stable); dev mode only when actively making changes
  - When fixing Recharts TypeScript errors, explicit type annotations on formatter callbacks are required (e.g., `v: any`)
  - Tunnel URL changes on restart; needs domain for permanent URL
  - Path access: Avoid wildcards like `mission-*/src/...`; use explicit paths documented in MISSION_FILES.md
  - Auto-backup cron: Changed from every 2 hours to 10 PM only - gives time to review before GitHub sync
  - Mission Control port: Confirmed as port 3003 (per RULES.md)
  - Cron Calendar performance: Use `/api/cron` endpoint with caching instead of direct execSync (reduces 15s+ timeout to fast response)
  - Telegram delivery: Cron jobs need `<chatId>` not phone number in the `to` field for delivery to work

### Skills & Systems
- Available skills: See `/skills/` directory for automation
- Key skills:
  - `mac-mini-setup` - Deploy entire system to new machine
  - `git-automation` - Safe git workflow (never use git restore/reset)
  - `backup-automation` - Always backup before risky operations
  - `system-audit` - Health check & verification
  - `cron-manager` - Manage scheduled tasks
  - `content-batch` - Weekly LinkedIn + newsletter creation
- File structure rules: See FILE_STRUCTURE_RULES.md
- Safety locks: See SAFETY_LOCK.md (protects against destructive git commands)
- Cleanup completed Apr 2026: Removed duplicate directories (ISSION-*, workspace, etc.)
- Canonical directories: mission-control, memory, business, content, packs, curriculum, podcast, projects, workflows, templates, context, scripts, skills

### Agent Framework (7 Pillars)
- Added to SPECIALISTS.md on Apr 18:
  1. Role Clarity
  2. Input Quality / Prep Agent
  3. Standard of Output (Draft/Ready/Refined)
  4. Structured Thinking
  5. Review Agents
  6. Feedback Loops
  7. Handoffs (Done → Summarise → Next → Context)

### High-Impact Leader Ecosystem (Apr 20)
- Core frameworks: Impact Triangle, PEOPLE OS, Growth Path, 5 Leadership Stages
- Diagnostic layer maps symptoms → problems → growth step sequencing
- Recommendation engine for coaching moves, offers, content angles
- Files: `packs/high-impact-leader-*.md`

### Conversion Cards (Apr 20)
- All 54 James Wedmore cards captured
- Files: `packs/conversion-cards.md`, `prompts/conversion-cards-agent.md`, `cards/`

### AgentMail Integration (Apr 2026)
- Email: aisystem@agentmail.to
- Flow: Gmail → forward → Niles processes → drafts reply → Brendan sends
- Human always in loop for sending
- Future: Agents send directly; Jerry sends client deliverables

### Task Accountability System (Kaizen Proposal)
- 24h waiting → flag
- 48h → escalate to Niles
- 72h → escalate to Brendan
- Signal Feed API for blocked/stale tasks
- Weekly accountability review (Friday)

### Team Structure (Apr 2026)
- **Tier A:** Brendan (Founder), Niles (CAO)
- **Tier B:** Kaizen (Head of Improvement), Casey, Marcus, Sophie, Brandon, Jerry
- **Tier C:** Kathy, Ruby, Lawrie, Tim
- Human team: Kriz, Dom, Lazelle, Phoenix, Eunice, Mervyn

### Niles Performance Reviews

**Schedule:** Quarterly (April, July, October, January)

| Quarter | Period | Rating | Notes |
|---------|--------|--------|-------|
| Q2 2026 | Apr-Jun 2026 | - | Coming |

*See `memory/reviews/` for detailed quarterly reviews.*
