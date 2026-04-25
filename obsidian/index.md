# Obsidian Vault - Knowledge Index

> This vault holds **knowledge about HOW we work** — strategic frameworks, agent capabilities, processes, and learning logs. It does NOT contain every piece of content we create.

---

## 📚 Purpose

This vault is our Layer 4 memory. It ensures:
- **Memory security:** Key knowledge survives workspace resets
- **Agent access:** All agents can read from this folder
- **Self-managing teams:** Clear frameworks enable agents to act independently

---

## 🗂️ Folder Structure

### 01-daily-logs/
- Session summaries and daily reflections
- Use for: Tracking what's happening, lessons learned

### 02-mistakes/
- Error learning log — what went wrong and why
- Use for: Preventing repeat mistakes

### 03-shared/
- Cross-agent knowledge and projects
- Use for: Handoffs, shared context, collaborative work

---

## 🔗 External References

**These folders are NOT in Obsidian but ARE accessible to agents:**

| Folder | What It Contains | How Agents Access It |
|--------|-----------------|---------------------|
| `memory/coaching-transcripts/` | Client call transcripts (V2 format) | Read from workspace |
| `memory/business/` | Business planning, financials, strategy | Read from workspace |
| `packs/` | Frameworks (PEOPLE OS, Impact Triangle, etc.) | Read from workspace |
| `prompts/` | Agent prompts and workflows | Read from workspace |

---

## 📋 Key Files (Workspace)

These exist in the workspace but are critical to our knowledge base:

| File | What It Is |
|------|-----------|
| `SPECIALISTS.md` | Agent directory — names, roles, capabilities, handoff protocols |
| `TEAM.md` | Team structure and contact info |
| `DREAMS.md` | 5-year vision and north star |
| `MEMORY.md` | Long-term working memory (loaded in main session) |
| `FILE_STRUCTURE_RULES.md` | Canonical folder structure |

---

## 🔄 Syncing

- **Push to GitHub:** `git add obsidian/ && git commit -m "Update memory vault" && git push origin master`
- **User pull:** `git pull origin master` in their local folder

---

*Last updated: 2026-04-25*