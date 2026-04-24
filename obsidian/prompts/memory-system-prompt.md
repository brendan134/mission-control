# OpenClaw + Obsidian Memory System Prompt

## The Four-Layer Memory System

OpenClaw uses a 4-layer memory system. Layers 1-3 are built-in. Layer 4 is the Obsidian vault.

### Layer 1: Built-in Memory
- Your name, identity, basic instructions
- Injected into every prompt automatically
- Location: OpenClaw built-in constants

### Layer 2: Rules & Personality
- `AGENTS.md` - Your operational rules
- `SOUL.md` - Your personality and communication style
- Injected into every prompt automatically

### Layer 3: Session History
- Searchable record of all sessions and cron jobs
- Injected into every prompt automatically
- Can become overloaded if too large (causes slowness)

### Layer 4: Obsidian Vault (NEW)
- **Location:** `/data/.openclaw/workspace/obsidian/`
- NOT automatically injected - accessed on-demand
- Contains: daily logs, mistakes, shared knowledge, projects

---

## How to Use the Obsidian Vault

### Writing Memories

1. **Daily Log** - At end of each session, write a summary to `01-daily-logs/YYYY-MM-DD.md`:
   ```
   ## Session Summary
   - Key decisions made:
   - Tasks discussed:
   - Important context:
   - Follow-ups needed:
   ```

2. **Mistakes** - When you make an error or get corrected:
   - Log to `02-mistakes/YYYY-MM-mistakes.md`
   - Include: what happened, why it went wrong, how to improve

3. **Shared Knowledge** - When sharing across agents:
   - Write to `03-shared/knowledge/` for facts
   - Write to `03-shared/projects/` for active work
   - Use templates from `03-shared/references/`

### Reading Memories

1. **On compaction** - Before and after compaction, check:
   - Recent daily logs to restore context
   - Any active projects that might be affected

2. **On demand** - When user references past work:
   - Search `01-daily-logs/` for relevant dates
   - Search `03-shared/projects/` for project context
   - Search `04-knowledge/` for conceptual knowledge

3. **For handoffs** - When passing to another agent:
   - Write summary to `03-shared/projects/`
   - Ensure next agent can pick up seamlessly

### Compaction Protocol

When compaction is detected:
1. Immediately before compaction: Save current session summary to today's daily log
2. Immediately after compaction: Check vault for any context from just before compaction
3. Resume with full context restored - user should not notice the compaction

---

## Vault Location

The Obsidian vault is at: `/data/.openclaw/workspace/obsidian/`

To browse in Obsidian app, point the app to this folder.

---

## Customization Notes

- Replace this prompt in your `agents.md` or create a dedicated memory rules file
- Adjust folder structure based on your workflow
- The vault syncs with Git - commit changes regularly
- For multi-agent setup, ensure all agents have read/write access to `03-shared/`

---

*Generated: 2026-04-24*
*Based on: OpenClaw Memory System (Alex Finn)*