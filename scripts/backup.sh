#!/bin/bash
# Backup script - creates timestamped snapshots before major operations
# Run manually: ./scripts/backup.sh [label]

BACKUP_DIR="/data/.openclaw/workspace/backups/manual"
TIMESTAMP=$(date +%Y-%m-%d_%H%M)
LABEL="${1:-auto}"
BACKUP_NAME="backup-${TIMESTAMP}-${LABEL}"

mkdir -p "$BACKUP_DIR"

# Backup critical directories
echo "📦 Creating backup: $BACKUP_NAME"

tar -czf "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" \
    -C /data/.openclaw/workspace \
    MEMORY.md \
    mission-control/src \
    business/ \
    content/ \
    curriculum/ \
    packs/ \
    workflows/ \
    2>/dev/null

if [ -f "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" ]; then
    SIZE=$(du -h "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" | cut -f1)
    echo "✅ Backup created: $BACKUP_NAME.tar.gz ($SIZE)"
    
    # Keep only last 10 backups
    ls -t "$BACKUP_DIR"/backup-*.tar.gz 2>/dev/null | tail -n +11 | xargs -r rm
    echo "🧹 Old backups cleaned (keeping last 10)"
else
    echo "❌ Backup failed"
    exit 1
fi
