# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Mission Control

- **Port:** 3003
- **Always restart using ecosystem config:**
  ```bash
  pm2 start /data/.openclaw/workspace/ecosystem.config.js
  ```
- **Don't use:** `pm2 start npm --name "mission-control" -- start` (missing PORT var)
- **Check status:** `pm2 list` or `curl -s -o /dev/null -w "%{http_code}" http://localhost:3003`

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

### Email
- Sign-off: "Cheers\nBrendan"

### CRM & Business Systems
- **Course Creator 360**: Main CRM, email marketing, course delivery, community portals, program delivery
