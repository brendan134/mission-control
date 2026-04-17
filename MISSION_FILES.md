# Mission Control File Paths

## Correct Project Location
**`/data/.openclaw/workspace/mission-control/`**

This is the ONLY folder that should be used to run Mission Control.

## Running Mission Control
```bash
cd /data/.openclaw/workspace/mission-control
npx next dev -p 3003
```

Or use PM2 for auto-recovery:
```bash
cd /data/.openclaw/workspace/mission-control
pm2 start npm --name "mission-control" -- start
```

## Key Pages
- Home: http://localhost:3003/
- Team: http://localhost:3003/team
- Office: http://localhost:3003/office
- Automations (Cron Calendar): http://localhost:3003/automations
- My Week: http://localhost:3003/my-week

## Key Files
- Team page: `/data/.openclaw/workspace/mission-control/src/app/team/page.tsx`
- Office page: `/data/.openclaw/workspace/mission-control/src/app/office/page.tsx`
- Cron Calendar: `/data/.openclaw/workspace/mission-control/src/app/automations/page.tsx`