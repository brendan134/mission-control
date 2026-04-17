---
name: git-automation
description: Safe git workflow for OpenClaw workspace. Use when: (1) committing changes, (2) pushing to GitHub, (3) dealing with merge conflicts, (4) recovering from bad state.
---

# Git Automation

Safe git commands and workflows for the OpenClaw workspace.

## Always Run First

```bash
cd /data/.openclaw/workspace
git status
```

This shows current state before any operation.

## Safe Workflow

### Before Starting Work
```bash
git status
git pull origin master  # Get latest
```

### After Making Changes
```bash
# Check what's changed
git status

# Add specific files (NEVER use git add -A blindly)
git add memory/2026-04-17.md
git add mission-control/src/

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push origin master
```

## NEVER USE

These are blocked in SAFETY_LOCK.md:
- `git restore` - discards changes
- `git checkout -- .` - discards all local changes
- `git clean -fd` - deletes untracked files
- `git reset --hard` - destroys all work
- `git stash drop` - loses stashed changes

## Common Tasks

### View History
```bash
git log --oneline -10
```

### See What's Different
```bash
git diff
git diff --staged
```

### Undo Safely

**If you staged something by accident:**
```bash
git reset HEAD <file>
```

**If you committed by accident (before push):**
```bash
git reset --soft HEAD~1
```

**If you need to abandon changes:**
```bash
# For specific file
git checkout HEAD -- path/to/file.js

# NEVER use: git checkout -- .
```

### Handle Conflicts
```bash
# See conflicted files
git status

# Edit files to resolve
# Then:
git add <resolved-files>
git commit -m "Resolve merge conflicts"
```

## Branch Strategy

- Default branch: `master`
- Only work on master for now
- Feature branches when comfortable

## Quick Reference Card

| Need | Command |
|------|---------|
| Check status | `git status` |
| Get latest | `git pull origin master` |
| Add file | `git add path/to/file` |
| Add all | `git add .` (only after checking!) |
| Commit | `git commit -m "message"` |
| Push | `git push origin master` |
| See history | `git log --oneline -5` |
| See diff | `git diff` |

## Pre-Commit Checklist

Before every commit:
- [ ] `git status` shows expected files
- [ ] No accidental .env or credentials
- [ ] No massive files added
- [ ] Commit message is clear
- [ ] Pushing to correct repo (master)