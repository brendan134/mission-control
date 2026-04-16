# Recent Decisions

## Decision Entry

### Date
- 2026-04-05

### Decision
- Build the AI system around portability and file-first operation

### Why
- Important information should not live only in chat
- The system needs to be portable from Hostinger to a future Mac Mini environment

### Impact
- system assets are being created as reusable files
- Mission Control is being designed as a layer over files, not as the only source of truth

### Affected Files / Systems
- `IDENTITY.md`
- `USER.md`
- `MEMORY.md`
- `systems/`
- `workflows/`
- `templates/`
- `projects/`

### Next Actions
- continue building system files and workflows
- keep documenting decisions as they happen

### Review Date
- 2026-06-30

---

## Decision Entry

### Date
- 2026-04-05

### Decision
- Use low-cost model routing by default with alias-based policy

### Why
- reduce operating cost
- create cleaner routing logic
- improve portability and maintainability

### Impact
- default model changed to `minimax`
- reasoning escalation set to `haiku`
- premium fallback set to `flash`
- alias-only routing adopted in policy files

### Affected Files / Systems
- `/data/.openclaw/openclaw.json`
- `systems/model-policy.md`
- `systems/model-routing.md`
- `systems/model-aliases.json`
- `systems/operator-cheat-sheet.md`

### Next Actions
- keep future routing logic alias-based
- use task-type routing rather than frequent manual switching

### Review Date
- 2026-06-30

---

## Decision Entry

### Date
- 2026-04-05

### Decision
- Build a Mission Control documentation layer before building the full Mission Control interface

### Why
- structure should exist before UI
- documentation defines system behaviour and operator logic

### Impact
- docs index, IA, homepage, constraints, and menu outline were created first

### Affected Files / Systems
- `systems/mission-control-docs-index.md`
- `systems/mission-control-information-architecture.md`
- `systems/mission-control-homepage.md`
- `systems/operating-constraints.md`
- `systems/mission-control-docs-menu-outline.md`

### Next Actions
- keep building documentation and file-based system assets
- later convert these into a UI layer inside Mission Control

### Review Date
- 2026-06-30

---

## Decision Entry

### Date
- 2026-04-05

### Decision
- Mark the current file-based operating system as System Version 1 baseline

### Why
- the system now has a complete foundational structure for planning, projects, workflows, model routing, operator guidance, and Mission Control documentation

### Impact
- Version 1 is now the reference checkpoint for future improvements
- future system changes can be compared against this baseline

### Affected Files / Systems
- `systems/system-version-1-baseline.md`
- `systems/recent-decisions.md`
- the broader `systems/`, `templates/`, `workflows/`, and `projects/` structure

### Next Actions
- use Version 1 as the baseline for further development
- continue improving execution rhythm, project depth, and Mission Control design

### Review Date
- 2026-06-30
