# Workspace Cleanup Plan

**Generated:** 2026-04-17
**Purpose:** Clean up workspace to match FILE_STRUCTURE_RULES.md canonical structure

---

## IMPORTANT: Two Repositories to Clean

This plan covers **BOTH** GitHub repositories:

| Repository | Purpose | Current Status |
|------------|---------|----------------|
| `brendan134/openclaw` | OpenClaw workspace (VPS running) | Has same mess as below |
| `brendan134/mission-control` | Mission Control app only | Being cleaned in this plan |

**Both repositories have the same issues and need identical cleanup.**

## Phase 1: Analysis Complete

### Current State
- **Total directories at root:** 27
- **Canonical directories (should keep):** 13
- **Problem directories (need action):** 14

---

## Phase 2: Cleanup Stages

### STAGE A: Identify & Document (DO FIRST)

| Directory | Status | Action | Reason |
|-----------|--------|--------|--------|
| `mission-control/` | ✅ KEEP | None | Canonical |
| `memory/` | ✅ KEEP | None | Canonical |
| `business/` | ✅ KEEP | None | Canonical |
| `content/` | ✅ KEEP | None | Canonical |
| `packs/` | ✅ KEEP | None | Canonical |
| `curriculum/` | ✅ KEEP | None | Canonical |
| `podcast/` | ✅ KEEP | None | Canonical |
| `projects/` | ✅ KEEP | None | Canonical |
| `workflows/` | ✅ KEEP | None | Canonical |
| `templates/` | ✅ KEEP | None | Canonical |
| `context/` | ✅ KEEP | None | Canonical |
| `scripts/` | ✅ KEEP | None | Canonical |
| `mission- control/` | ❌ DELETE | Delete after backup | Duplicate with space |
| `mission-/` | ❌ DELETE | Delete | Incomplete partial |
| `temp_mc/` | ❌ DELETE | Delete | Old backup |
| `workspace-control/` | ❌ DELETE | Delete | Duplicate name |
| `workspace- control/` | ❌ DELETE | Delete | Duplicate with space |
| `workspace/` | ⚠️ REVIEW | Check contents first | May have skills |
| `ISSION-*/` | ❌ DELETE | Delete | Typo (should be MISSION) |
| `ISSION_*/` | ❌ DELETE | Delete | Typo |
| `src/` (root) | ❌ DELETE | Delete if empty | Should be in mission-control |
| `systems/` | ⚠️ REVIEW | May need to move to packs/ | Documentation |
| `skills/` | ⚠️ REVIEW | May need to move | Skills directory |
| `control/` | ❌ DELETE | Delete | Duplicate name |

---

### STAGE B: Root-Level Files Review

| File | Status | Action | Reason |
|------|--------|--------|--------|
| `ecosystem.config.js` | ✅ KEEP | None | Canonical |
| `cloudflared` | ✅ KEEP | None | Canonical |
| `.gitignore` | ✅ KEEP | None | Required |
| `MEMORY.md` | ✅ KEEP | None | Canonical |
| `AGENTS.md` | ✅ KEEP | None | Canonical |
| `SOUL.md` | ✅ KEEP | None | Canonical |
| `USER.md` | ✅ KEEP | None | Canonical |
| `TOOLS.md` | ✅ KEEP | None | Canonical |
| `HEARTBEAT.md` | ✅ KEEP | None | Canonical |
| `IDENTITY.md` | ✅ KEEP | None | Canonical |
| `BOOTSTRAP.md` | ✅ KEEP | None | Canonical |
| `RULES.md` | ✅ KEEP | None | Canonical |
| `SAFETY_LOCK.md` | ✅ KEEP | None | Canonical |
| `FILE_STRUCTURE_RULES.md` | ✅ KEEP | None | Newly created |
| `SPECIALISTS.md` | ✅ KEEP | None | Canonical |
| `OPENCLAW-SETUP.md` | ✅ KEEP | None | Documentation |
| `INSTALL.md` | ✅ KEEP | None | Documentation |
| `projects.json` | ✅ KEEP | None | Data file |
| `strategy.json` | ✅ KEEP | None | Data file |
| `tasks.json` | ⚠️ REVIEW | Check if used by Mission Control | Data file |
| `MISSION_FILES.md` | ✅ KEEP | Update to reflect cleanup | Documentation |
| `CLAUDE.md` | ❓ CLARIFY | What is this? | Unknown purpose |
| `CURRENT_WORK.md` | ❓ CLARIFY | Temp or permanent? | May be useful |
| `MIGRATION.md` | ✅ KEEP | Archive of migration info | Documentation |
| `MODES.md` | ❌ DELETE | Redundant with other docs | Duplicate info |
| `ROUTES.md` | ❓ CLARIFY | Is this used? | May be obsolete |
| `backup-crons.md` | ⚠️ MOVE | Move to scripts/ | Documentation |
| `package.json` | ⚠️ REVIEW | Root package.json needed? | May be orphan |
| `package-lock.json` | ⚠️ REVIEW | Same as above | May be orphan |
| `real-cron-data.js` | ❌ DELETE | Temp/debug file | Not needed |
| `tsconfig.json` | ⚠️ REVIEW | Should be in mission-control/ | May be orphan |
| `vercel.json` | ⚠️ REVIEW | Vercel config - where does it belong? | Needs placement |

---

## Phase 3: Execution Steps (Safe Order)

### Step 1: Pre-Cleanup Backup
```bash
# Create timestamped backup before any deletions
./scripts/backup.sh
```

### Step 2: Verify Mission Control is Safe
```bash
# Ensure mission-control/ is complete and working
curl http://localhost:3003/
pm2 list
```

### Step 3: Delete Obvious Junk (No Risk)
```bash
# These are clearly junk - delete first
rm -rf "mission-"
rm -rf "ISSION-"*
rm -rf "ISSION_"*
```

### Step 4: Delete Duplicates (Medium Risk)
```bash
# These are clearly duplicates - delete after confirming
rm -rf "mission- control"
rm -rf "workspace- control"
rm -rf "workspace-control"
rm -rf "control"
```

### Step 5: Review Before Deleting (Higher Risk)
For these, check contents first:
- `temp_mc/` - Confirm not needed before delete
- `systems/` - Move valuable docs to packs/ first
- `skills/` - Determine if needed or can be deleted

### Step 6: Root File Cleanup
- Move `backup-crons.md` → `scripts/backup-crons.md`
- Delete `real-cron-data.js`
- Delete `MODES.md` (if confirmed redundant)
- Review orphan config files (tsconfig.json, vercel.json)

### Step 7: Post-Cleanup Verification
```bash
# Must verify after each deletion
git status
ls -la
curl http://localhost:3003/
pm2 list
```

### Step 8: Push to GitHub
```bash
# Only after full verification
git add -A
git commit -m "Clean up workspace structure"
git push origin master
```

---

## Phase 4: Post-Cleanup

After cleanup, update:
1. `MISSION_FILES.md` - Document final structure
2. `FILE_STRUCTURE_RULES.md` - Confirm it matches reality
3. Run restore test to verify GitHub→VPS works

---

## Risk Levels

| Level | Action | Can Undo? |
|-------|--------|-----------|
| LOW | Delete obvious junk (ISSION-*, mission-) | No, but safe to lose |
| MEDIUM | Delete duplicates (workspace-control) | No |
| HIGH | Delete directories with content (temp_mc, systems) | No |
| CRITICAL | Delete mission-control/ | NEVER DO THIS |

**Rule:** If any doubt, ask user before deletion.

---

## Questions for User Before Proceeding

1. Should `systems/` docs be moved to `packs/` or deleted?
2. Should `skills/` be kept or deleted?
3. What is `CLAUDE.md` - can it be deleted?
4. Is `CURRENT_WORK.md` temporary or permanent?
5. Should root `package.json` be kept or deleted?
6. Ready to proceed with Stage A (obvious junk)?

---

## Last Updated
2026-04-17