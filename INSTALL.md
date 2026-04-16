# Leader By Design AI System - Installation Guide

## Overview
This guide walks you through setting up the complete Leader By Design AI system on a fresh machine (Mac mini, VPS, etc.)

## Prerequisites
- Node.js 20+
- Docker (optional, for containerized setup)
- Git
- OpenRouter API key

---

## Quick Start (Fresh Install)

### 1. Clone the Workspace
```bash
cd ~/openclaw-workspace
git clone https://github.com/brendan134/openclaw.git .
git submodule update --init --recursive  # If you have submodules
```

### 2. Install OpenClaw
```bash
# Option A: Via npm (recommended)
npm install -g openclaw@latest

# Option B: Via pnpm
pnpm add -g openclaw@latest
```

### 3. Configure Environment Variables
Create a `.env` file in your workspace:
```bash
# Required
export OPENROUTER_API_KEY="your-key-here"
export TELEGRAM_BOT_TOKEN="your-bot-token"
export GATEWAY_TOKEN="generate-random-string"

# Optional - for local development
export NODE_ENV="development"
```

Source the env file:
```bash
source .env
```

### 4. Initial Setup
```bash
# Initialize OpenClaw
openclaw init

# Run the setup prompt (pastes from OPENCLAW-SETUP.md)
# OR manually create openclaw.json with your config

# Start OpenClaw
openclaw start
```

### 5. Verify Services
```bash
openclaw status
openclaw channels status
```

---

## Channel Setup

### Telegram
1. Message @BotFather on Telegram
2. Create a new bot: `/newbot`
3. Get the bot token
4. Add to your `.env` file

### Discord (Optional)
1. Create a Discord Application at https://discord.com/developers
2. Add bot to your server
3. Copy token to `.env`

### Slack (Optional)
1. Create a Slack App at https://api.slack.com
2. Enable Bot Token and Event subscriptions
3. Copy credentials to `.env`

---

## Restoring Your Data

### From GitHub Backup
All workspace files are in the repo:
- `MEMORY.md` - Long-term memory
- `packs/` - Content packs
- `projects/` - Active projects
- `systems/` - System documentation

### Cron Jobs
Recreate manually (not in Git):
- Daily News Brief: 7 AM Sydney time
- Any custom automations

---

## Migration Checklist

Before migrating to a new machine:

- [ ] Export/backup `openclaw.json` (contains channel tokens)
- [ ] Export credentials from `.env`
- [ ] Note your OpenRouter API key
- [ ] Check cron jobs at `/data/.openclaw/cron/jobs.json`
- [ ] Clone workspace repo to new machine

---

## Troubleshooting

### "Gateway not reachable"
```bash
openclaw gateway restart
```

### "Plugin not found"
```bash
openclaw plugins install <plugin-name>
```

### Model API errors
Check your OpenRouter API key is valid and you have credits.

---

## Support
- OpenClaw Docs: https://docs.openclaw.ai
- GitHub Issues: https://github.com/openclaw/openclaw/issues
