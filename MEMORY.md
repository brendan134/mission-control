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
- Active cron jobs: 6 total
  - Git Auto-Sync: 8am & 8pm AEST (commits workspace to GitHub)
  - Daily News Brief: 7am AEST
  - Weekly Content Batch: Monday 6am
  - Weekly Review: Friday 7am
  - Daily Cost Alert: 8pm (warns >$4)
  - Monthly Cost Review: 1st of month 7am AEST
- AI routing: OpenRouter only (minimax, kimi, flashlite)
- Telegram: Secured (allowlist policy)
- GitHub backup: brendan134/openclaw
- Workflow notes:
  - Mission Control runs in production mode (faster, more stable); dev mode only when actively making changes
  - When fixing Recharts TypeScript errors, explicit type annotations on formatter callbacks are required (e.g., `v: any`)
  - Tunnel URL changes on restart; needs domain for permanent URL
  - Path access: Avoid wildcards like `mission-*/src/...`; use explicit paths documented in MISSION_FILES.md
  - Auto-backup cron: Changed from every 2 hours to 10 PM only - gives time to review before GitHub sync
  - Mission Control port: Confirmed as port 3003 (per RULES.md)
  - Cron Calendar performance: Use `/api/cron` endpoint with caching instead of direct execSync (reduces 15s+ timeout to fast response)
