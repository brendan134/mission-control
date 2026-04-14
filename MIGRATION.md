# Migration Guide: Mac Mini Setup

This document outlines the full process to migrate your Leader by Design AI Operating System from the current server to a Mac Mini.

---

## Prerequisites

- Mac Mini (any recent model)
- Internet connection
- GitHub account with access to:
  - `brendan134/mission-control`
  - `brendan134/openclaw`

---

## Step 1: Install OpenClaw

```bash
# Install OpenClaw globally
npm install -g openclaw

# Verify installation
openclaw --version
```

---

## Step 2: Clone Your Repositories

```bash
# Create a workspace directory
mkdir -p ~/ai-system
cd ~/ai-system

# Clone Mission Control (your Next.js app)
git clone https://github.com/brendan134/mission-control.git

# Clone OpenClaw config
git clone https://github.com/brendan134/openclaw.git openclaw-config
```

---

## Step 3: Restore OpenClaw Configuration

```bash
# Copy config files to OpenClaw data directory
cp openclaw-config/openclaw.json ~/.openclaw/openclaw.json
cp -r openclaw-config/agents ~/.openclaw/
cp -r openclaw-config/credentials ~/.openclaw/
cp -r openclaw-config/identity ~/.openclaw/
cp -r openclaw-config/subagents ~/.openclaw/
cp -r openclaw-config/telegram ~/.openclaw/
cp -r openclaw-config/Agents.override.json ~/.openclaw/

# Restore memory (optional - your conversation history)
mkdir -p ~/.openclaw/memory
cp openclaw-config/memory/main.sqlite ~/.openclaw/memory/
```

---

## Step 4: Set Up Mission Control

```bash
# Navigate to Mission Control
cd mission-control

# Install dependencies
npm install

# Build the app
npm run build

# Start the development server
npm run dev
```

---

## Step 5: Configure OpenClaw

Edit `~/.openclaw/openclaw.json` to point to your local Mission Control:

```json
{
  "workspace": "/Users/YOUR_USER/ai-system/mission-control",
  "gateway": {
    "bind": "0.0.0.0:3000"
  }
}
```

---

## Step 6: Start OpenClaw

```bash
openclaw start
```

---

## Step 7: Verify Everything Works

- [ ] OpenClaw starts without errors
- [ ] Mission Control loads at http://localhost:3000
- [ ] Your identity files are recognized (SOUL.md, USER.md, etc.)
- [ ] Memory is intact
- [ ] Telegram/other integrations work

---

## Post-Migration Checklist

### Sync Back to GitHub
After making changes on your Mac Mini, push back to GitHub:

```bash
# Mission Control
cd ~/ai-system/mission-control
git add -A
git commit -m "Your changes"
git push origin master

# OpenClaw Config
cd ~/ai-system/openclaw-config
git add -A
git commit -m "Your changes"
git push origin master
```

### Set Up Auto-Sync (Optional)
Create a cron job or script to auto-push changes daily.

---

## Troubleshooting

### Port Already in Use
If port 3000 is taken:
```bash
lsof -i :3000  # Find what's using it
# OR
# Edit openclaw.json to use a different port
```

### Missing Dependencies
```bash
cd mission-control
npm install
```

### Token for GitHub Push
When pushing to GitHub, you'll need a Personal Access Token:
1. Go to https://github.com/settings/tokens/new
2. Generate token with `repo` scope
3. Use: `git remote set-url origin https://YOUR_TOKEN@github.com/brendan134/mission-control.git`

---

## File Structure Summary

```
~/ai-system/
├── mission-control/     # Your Mission Control app
│   ├── src/
│   ├── package.json
│   └── ...
└── openclaw-config/     # Your OpenClaw config (backup)
    ├── openclaw.json
    ├── agents/
    ├── credentials/
    ├── identity/
    └── ...

~/.openclaw/             # Live OpenClaw data (on Mac Mini)
├── openclaw.json
├── agents/
├── credentials/
├── identity/
└── ...
```

---

## Need Help?

Check your memory files:
- `memory/2026-04-14.md` — Last known working state
- GitHub commit history for context