# Mission Control - Key File Paths

Use these **exact paths** when editing Mission Control files:

## Pages
- Tasks page: `/data/.openclaw/workspace/mission-control/src/app/tasks/page.tsx`
- Projects page: `/data/.openclaw/workspace/mission-control/src/app/projects/page.tsx`
- Dashboard: `/data/.openclaw/workspace/mission-control/src/app/page.tsx`
- My Week: `/data/.openclaw/workspace/mission-control/src/app/my-week/page.tsx`

## Services (Lib)
- Task service: `/data/.openclaw/workspace/mission-control/src/lib/task-service.ts`
- Project service: `/data/.openclaw/workspace/mission-control/src/lib/project-service.ts`
- Data model: `/data/.openclaw/workspace/mission-control/src/lib/data-model.ts`

## API Routes
- Tasks API: `/data/.openclaw/workspace/mission-control/src/app/api/tasks/route.ts`
- Projects API: `/data/.openclaw/workspace/mission-control/src/app/api/projects/route.ts`

## Data Files (JSON)
- Tasks: `/data/.openclaw/workspace/tasks.json`
- Projects: `/data/.openclaw/workspace/projects.json`

## Quick Find Command
```bash
find /data/.openclaw/workspace -name "page.tsx" -path "*tasks*"
find /data/.openclaw/workspace -name "page.tsx" -path "*projects*"
find /data/.openclaw/workspace -name "task-service.ts"
find /data/.openclaw/workspace -name "project-service.ts"
```

## IMPORTANT
- Use **explicit path**: `mission-control/src/app/tasks/page.tsx`
- Avoid wildcards like `mission-*/src/...` (causes path issues)
- In read/edit tools, always use exact path from above
