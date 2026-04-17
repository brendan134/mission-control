# File Structure & GitHub Best Practice Rules

## Purpose
These rules ensure GitHub remains the single source of truth. They prevent the issues we experienced on April 17 where:
- Files weren't synced properly
- Multiple similarly-named directories caused confusion
- Data was spread across inconsistent locations

---

## Scope: All Repositories

These rules apply to **ALL** GitHub repositories owned by this workspace:

| Repository | Purpose |
|------------|---------|
| `brendan134/openclaw` | OpenClaw workspace (VPS running) |
| `brendan134/mission-control` | Mission Control app |

**Any new repositories created must follow these rules.**

---

## 1. Canonical Directory Structure

Only these directories should exist at workspace root:

```
/workspace/
├── AGENTS.md              # Agent definitions & responsibilities
├── BOOTSTRAP.md           # Startup instructions
├── MEMORY.md              # Long-term memory (curated)
├── SOUL.md                # Assistant persona
├── USER.md                # Human user profile
├── TOOLS.md               # Local tool configurations
├── SAFETY_LOCK.md         # Protected rules (never modify without approval)
├── RULES.md               # Operational rules
├── IDENTITY.md            # Assistant identity
├── HEARTBEAT.md           # Heartbeat check configuration
├── MISSION_FILES.md       # Documentation of project file paths
│
├── mission-control/       # MAIN Mission Control app (only one!)
├── memory/                # Daily memory files (YYYY-MM-DD.md)
├── business/              # Business content & strategy
├── content/               # Content drafts (posts, newsletters)
├── packs/                 # IP packs & methodologies
├── curriculum/            # Course/learning materials
├── podcast/               # Podcast episode notes
├── projects/              # Project documentation
├── workflows/             # Automation workflows
├── templates/             # Reusable templates
├── context/               # Context documents
├── scripts/               # Shell scripts only
│
├── ecosystem.config.js    # PM2 process manager config
├── cloudflared            # Tunnel binary (no extensions)
└── .gitignore             # Git ignore rules
```

**Directories that MUST NOT exist:**
- Any variant of `mission-control` with spaces, underscores, or extra dashes
- `temp_mc`, `workspace-control`, `mission- control`
- Duplicate `src` folders at root
- Any directory not in the list above

---

## 2. Naming Conventions

### Files
- **Use KEBAB-CASE** for all files: `my-file-name.md`
- **Never use spaces**: Use `-` or `_` instead
- **Never use special characters**: Only alphanumeric + `-` + `_` + `.`
- **Date format for memory**: `YYYY-MM-DD.md` (e.g., `2026-04-17.md`)

### Directories
- **Use KEBAB-CASE**: `mission-control`, `memory`, `business`
- **Never use spaces**: Use `-` to separate words
- **Never create duplicate names** with different casing/spaces

### Branch Names
- Default branch: `master` (not `main`)
- Feature branches: `feature/description` or `fix/description`

---

## 3. Git Workflow Rules

### Always
- **Push to GitHub same day** — never leave work uncommitted overnight
- **Run `git status` before any operation** to understand state
- **Use explicit paths** — never use wildcards like `mission-*/src/...`

### Never Use (Data Loss Risk)
These commands are blocked in SAFETY_LOCK.md:
- `git restore` — discards local changes
- `git checkout -- .` — discards all local modifications  
- `git clean -fd` — permanently deletes untracked files
- `git reset --hard` — discards ALL local changes and commits
- `git stash drop` — permanently deletes stashed changes

### Safe Git Pattern
```bash
# Before starting work
git status
git pull origin master

# After making changes
git add <specific-files>
git commit -m "Description of changes"
git push origin master

# Never use: git add -A unless you know exactly what will be committed
```

---

## 4. Memory & Documentation

### Daily Memory
- **Location**: `/memory/YYYY-MM-DD.md`
- **Must be pushed to GitHub same day**
- **Never create combined memory files** — one day = one file
- **Never skip days** — if no work, create minimal file noting no activity

### Long-term Memory (MEMORY.md)
- **Only contains curated, distilled information**
- **Not a dump of daily logs** — summarize, don't copy
- **Updated weekly** from daily memory files

---

## 5. Application Code

### Mission Control
- **Single location**: `/mission-control/`
- **Never create backup copies** in the workspace
- **Use PM2** for running/stopping (not manual node commands)
- **Port**: Always 3003 (configured in ecosystem.config.js)

### Configuration Files
- **ecosystem.config.js** — PM2 config (one file, at root)
- **cloudflared** — tunnel binary (at root, no extension)
- **All configs in workspace root**, not scattered in subfolders

---

## 6. Cleanup Protocol

### When Duplicates Appear
If you discover duplicate/messy directories:
1. **DO NOT delete** without approval
2. **Document** what's found in a temporary file
3. **Propose cleanup** to user
4. **After approval**, clean up and push

### Regular Maintenance
- **Weekly**: Check `git status` for uncommitted files
- **Monthly**: Review directory structure for duplicates
- **After any restore**: Verify all canonical directories exist

---

## 7. Restore/Backup Verification

After any system restore:
1. Check `git status` — should show clean or uncommitted new files
2. Verify `memory/` has all expected date files
3. Confirm `mission-control/` exists and is complete
4. Run `pm2 list` to see managed processes
5. **Never assume** restore worked — always verify

---

## Enforcement

- **SAFETY_LOCK.md** blocks destructive git commands
- **Pre-commit hook** prevents committing:
  - Files/directories with spaces
  - Typo directories (ISSION*, temp_*, workspace-*, mission- )
  - Duplicate src at root
  - Sensitive files (.env, *.pem, *.key)
- **Any violation** of these rules requires explicit user approval

---

## Last Updated
2026-04-17