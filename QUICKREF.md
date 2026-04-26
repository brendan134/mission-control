# QUICKREF.md - Compact Reference Layer

_Layer 1: Tiny facts and pointers (~2,200 chars). Think sticky notes on a monitor._

## Access
- **Mission Control:** http://localhost:3003
- **Tunnel:** Run `pm2 list` to find cloudflared URL
- **Obsidian Vault:** `obsidian/` folder in workspace

## SSH Commands
- **DGX (if applicable):** `ssh spark@<host>`

## Key Paths
- **Workspace:** `/data/.openclaw/workspace`
- **Config:** `/data/.openclaw`
- **Mission Control:** `/data/.openclaw/workspace/mission-control`

## Tools & Services
- **PM2:** `pm2 list`, `pm2 logs <name>`
- **Tunnel:** cloudflared (check with `pm2 logs cloudflared`)
- **Email:** aisystem@agentmail.to (via himalama)

## Cron Management
- Timezone: Australia/Sydney (default)
- List crons: `openclaw cron list`
- Add cron: `openclaw cron add ...`

## Git
- **Workspace:** `git -C /data/.openclaw/workspace`
- **Config:** `git -C /data/.openclaw`
- **Always push after session:** `git add . && git commit -m "Session" && git push`

## Important Notes
- Always use low-cost models (minimax, kimi, flashlite) unless high capability needed
- Check cost before expensive operations: `openclaw gateway usage-cost`
- Prefer file-based outputs over chat responses
- Never run destructive commands without asking first

## Active Projects (2026)
- Lead Engine (Attract)
- AI Operating System Scale
- Personal & Family (Toastmasters, Foster Care, Fairhaven Board, Greece trip)

---

_Updated: 2026-04-26_