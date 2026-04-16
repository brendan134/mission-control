#!/bin/bash
# Git Auto-Sync for OpenClaw Workspace
# Commits changes hourly and pushes to remote
# Detects merge conflicts and notifies instead of forcing resolution

REPO_DIR="/data/.openclaw/workspace"
GIT_REMOTE="origin"
GIT_BRANCH="main"
LOG_FILE="$REPO_DIR/.git-auto-sync.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

cd "$REPO_DIR" || exit 1

log "Starting auto-sync..."

# Check for uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
    log "Changes detected, staging..."
    git add -A
    
    # Get list of changed files
    CHANGED_FILES=$(git diff --name-only --cached | tr '\n' ', ')
    
    # Commit with timestamp tag
    TIMESTAMP=$(date '+%Y-%m-%d-%H%M')
    git commit -m "Auto-sync: $TIMESTAMP - $CHANGED_FILES" 2>&1 | tee -a "$LOG_FILE"
    
    log "Changes committed with tag: $TIMESTAMP"
else
    log "No changes to commit"
fi

# Check for remote changes (potential merge conflict)
log "Checking for remote changes..."
git fetch "$GIT_REMOTE" 2>&1 | tee -a "$LOG_FILE"

LOCAL_HEAD=$(git rev-parse HEAD)
REMOTE_HEAD=$(git rev-parse "$GIT_REMOTE/$GIT_BRANCH")

if [ "$LOCAL_HEAD" != "$REMOTE_HEAD" ]; then
    # There are remote changes - check if we can fast-forward
    if git merge-base --is-ancestor "$LOCAL_HEAD" "$REMOTE_HEAD"; then
        # We're behind - try to merge
        log "Pulling remote changes..."
        if git pull "$GIT_REMOTE" "$GIT_BRANCH" 2>&1 | tee -a "$LOG_FILE"; then
            log "Successfully merged remote changes"
        else
            log "❌ Merge conflict detected - notifying user"
            # Notify via OpenClaw message
            echo "🔄 Git Sync Alert: Merge conflict detected on $TIMESTAMP. Please resolve manually." | tee -a "$LOG_FILE"
            
            # Abort merge to leave clean state
            git merge --abort 2>/dev/null
            
            # Exit with warning (not error) so cron doesn't stop
            exit 0
        fi
    else
        # Diverged - notify user
        log "⚠️  Diverged from remote - manual intervention needed"
        echo "🔄 Git Sync Alert: Branches have diverged. Manual merge required." | tee -a "$LOG_FILE"
    fi
fi

# Push if we have commits
if git log "$GIT_REMOTE/$GIT_BRANCH..HEAD" --oneline | head -1 > /dev/null 2>&1; then
    log "Pushing to remote..."
    if git push "$GIT_REMOTE" "$GIT_BRANCH" 2>&1 | tee -a "$LOG_FILE"; then
        log "✅ Successfully pushed to remote"
    else
        log "❌ Push failed - will retry next sync"
    fi
else
    log "Nothing to push"
fi

# Conditional push: only push during morning run (8am AEST)
CURRENT_HOUR=$(date +%H)
if [ "$CURRENT_HOUR" = "08" ]; then
    log "Morning run - executing push..."
    if git log "$GIT_REMOTE/$GIT_BRANCH..HEAD" --oneline | head -1 > /dev/null 2>&1; then
        log "Pushing to remote..."
        if git push "$GIT_REMOTE" "$GIT_BRANCH" 2>&1 | tee -a "$LOG_FILE"; then
            log "✅ Successfully pushed to remote"
        else
            log "❌ Push failed - will retry next sync"
        fi
    else
        log "Nothing to push"
    fi
else
    log "Evening run - skipping push (will sync tomorrow morning)"
fi

log "Auto-sync complete"
echo "---" >> "$LOG_FILE"