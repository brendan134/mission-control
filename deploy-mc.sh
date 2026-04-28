#!/bin/bash
# Mission Control Deploy Script
# Safe deployment with automatic backup

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MC_DIR="$SCRIPT_DIR/mission-control"
DATE=$(date +%Y%m%d-%H%M%S)

echo "=== MC Deploy Started at $(date) ==="

# 1. Backup current state
echo "[1/5] Backing up current state..."
cp "$SCRIPT_DIR/projects.json" "$SCRIPT_DIR/backups/projects-$DATE.json.bak"
cp "$SCRIPT_DIR/tasks.json" "$SCRIPT_DIR/backups/tasks-$DATE.json.bak"
echo "  → Backed up to backups/projects-$DATE.json.bak"

# 2. Build Mission Control
echo "[2/5] Building Mission Control..."
cd "$MC_DIR"
npm run build

# 3. Restart PM2
echo "[3/5] Restarting PM2..."
pm2 restart mission-control

# 4. Wait for startup
echo "[4/5] Waiting for server..."
sleep 5

# 5. Verify
echo "[5/5] Verifying..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://mc.brendanrogers.au)

if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ Deploy successful! (HTTP $HTTP_CODE)"
    echo "=== MC Deploy Complete ==="
    exit 0
else
    echo "  ❌ Deploy failed! (HTTP $HTTP_CODE)"
    echo "  → Rolling back..."
    cp "$SCRIPT_DIR/backups/projects-$DATE.json.bak" "$SCRIPT_DIR/projects.json"
    cp "$SCRIPT_DIR/backups/tasks-$DATE.json.bak" "$SCRIPT_DIR/tasks.json"
    pm2 restart mission-control
    echo "=== MC Deploy FAILED & Rolled Back ==="
    exit 1
fi