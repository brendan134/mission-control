---
name: mac-mini-setup
description: Deploy the entire OpenClaw system to a new Mac Mini. Use when: (1) migrating from VPS to Mac Mini, (2) setting up a new machine, (3) creating a fresh install from GitHub backup.
---

# Mac Mini Setup

This skill automates the complete setup of the OpenClaw system on a Mac Mini.

## Prerequisites

- Mac Mini with macOS (latest)
- GitHub access (brendan134/openclaw, brendan134/mission-control)
- Homebrew installed

## Quick Setup

```bash
# 1. Install Node.js
brew install node

# 2. Install OpenClaw CLI
npm install -g openclaw

# 3. Clone workspace
git clone https://github.com/brendan134/openclaw.git
cd openclaw

# 4. Install dependencies
npm install

# 5. Setup PM2
pm2 start ecosystem.config.js

# 6. Verify
curl http://localhost:3003
```

## Full Checklist

### System Requirements
- [ ] Node.js 22+ installed
- [ ] npm installed
- [ ] Git installed
- [ ] PM2 installed globally

### Repository Setup
- [ ] Clone openclaw repo
- [ ] Clone mission-control repo (if separate)
- [ ] Run npm install in each directory

### Environment Variables
- [ ] Copy .env.template to .env
- [ ] Add OpenAI API key
- [ ] Add OpenRouter keys
- [ ] Configure Telegram bot (if needed)

### Services
- [ ] Start Mission Control: `pm2 start ecosystem.config.js`
- [ ] Setup cloudflared tunnel (if exposing externally)
- [ ] Configure PM2 auto-start: `pm2 startup`

### Verification
- [ ] Mission Control accessible at localhost:3003
- [ ] Gateway responding
- [ ] Cron jobs working

## Rollback

If setup fails:
```bash
pm2 delete all
rm -rf node_modules
git clean -fd
```

## Notes for Mac Mini

- Use `brew services` for persistent services
- Consider launching PM2 at login
- May need to configure firewall for external access