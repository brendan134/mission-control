#!/bin/bash
# Auto-sync memory files to Obsidian vault
# Run: crontab -e → 0 21 * * * /data/.openclaw/workspace/scripts/sync-obsidian.sh

MEMORY_DIR="/data/.openclaw/workspace/memory"
OBSIDIAN_DIR="/data/.openclaw/workspace/obsidian/01-daily-logs"

# Get today's date
TODAY=$(date +%Y-%m-%d)

# Copy today's memory file if it exists
if [ -f "$MEMORY_DIR/$TODAY.md" ]; then
    cp "$MEMORY_DIR/$TODAY.md" "$OBSIDIAN_DIR/$TODAY.md"
    echo "Synced $TODAY.md to Obsidian"
else
    echo "No memory file for $TODAY"
fi

# Add and commit
cd /data/.openclaw/workspace
git add obsidian/01-daily-logs/
git commit -m "Auto-sync: $TODAY memory to Obsidian" 2>/dev/null
git push origin master 2>/dev/null
git push internal master 2>/dev/null