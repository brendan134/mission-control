# OpenClaw Setup Prompt

Give this prompt to a fresh OpenClaw instance to auto-configure it.

---

```
I need you to create an openclaw.json config file with these settings:

1. PLUGINS: Enable telegram, discord, slack, nostr, googlechat. Disable whatsapp, signal, imessage.

2. CHANNELS - Telegram:
   - dmPolicy: "pairing"
   - groupPolicy: "allowlist"
   - streaming: "partial"
   - botToken: [ASK ME]
   - enabled: true

3. UPDATE: channel "stable", checkOnStart false

4. BROWSER: headless true, noSandbox true, defaultProfile "openclaw"

5. MODELS: mode "merge"

6. AGENTS - Defaults:
   - model: "openrouter/minimax/minimax-m2.5"
   - thinkingDefault: "low"
   - contextPruning: { mode: "cache-ttl", ttl: "1h" }
   - compaction: { mode: "safeguard" }
   - heartbeat: every "60m", model "openrouter/google/gemini-2.5-flash-lite", target "last", directPolicy "allow"

7. AGENTS - List (11 agents):
   - main: Main Agent, minimax
   - strategy: Strategy Agent, kimi
   - messaging: Messaging Agent, kimi
   - content: Content Agent, minimax
   - curriculum: Curriculum Agent, kimi
   - client-delivery: Client Delivery Agent, minimax
   - podcast: Podcast Agent, minimax
   - community: Community Agent, minimax
   - research: Research Agent, kimi
   - knowledge: Knowledge Librarian, flashlite
   - ops: System Operations Agent, flashlite

8. COMMANDS: native "auto", nativeSkills "auto", bash true, restart true, ownerDisplay "raw"

9. GATEWAY:
   - mode: "local"
   - auth: mode "token", token [ASK ME]
   - remote: token [ASK ME]

10. CRON JOBS - Create this job:
   - name: "Daily News Brief"
   - agentId: "main"
   - schedule: "0 7 * * *" (7 AM daily)
   - timezone: "Australia/Sydney"
   - message: "Create a daily news brief for Brendan:

1. TOP 5 GLOBAL NEWS: Search for the top 5 world news stories today. Provide headline and brief 1-sentence summary for each.

2. TOP 5 AUSTRALIA NEWS: Search for the top 5 Australian news stories today. Provide headline and brief 1-sentence summary for each.

3. SPORT SECTION:
- Liverpool FC: Latest news, scores, results
- Australian Cricket: Latest news, scores from Australian national team
- Australian Soccer: Latest news, scores from Australian national team (Socceroos, Matildas)

Format clearly with headers. Keep each story to 1-2 sentences max. Be concise and direct."
   - delivery: mode "announce", channel "telegram"

Ask me for the sensitive values: telegram botToken and gateway tokens.
```

---

## Sensitive Values You Need to Provide

When OpenClaw asks, give it these:

| Value | How to Get |
|-------|------------|
| **Telegram botToken** | Message @BotFather on Telegram, use `/newbot` or `/token` |
| **Gateway token** | Generate a random secure string (e. g., `openssl rand -hex 24`) |

---

## What's Included

- All workspace files (IDENTITY, USER, MEMORY, AGENTS, packs, projects, skills)
- OpenClaw setup prompt with cron jobs
- Mission-control Next. js app

## After Setup

1. Clone your workspace repo into the new OpenClaw:
   ```bash
   cd /data/.openclaw/workspace
   git clone https://github.com/brendan134/openclaw. .
   ```

2. Make sure to set up the Telegram webhook or polling for your bot.

3. Sync ClawHub skills (if you have any installed):
   ```bash
   clawhub sync
   ```
