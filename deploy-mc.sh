#!/bin/bash
# Mission Control Deploy Script
# Safe deployment with automatic backup and testing

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MC_DIR="$SCRIPT_DIR/mission-control"
DATE=$(date +%Y%m%d-%H%M%S)

echo "=== MC Deploy Started at $(date) ==="

# 0. Run Safety Tests FIRST
echo "[0/6] Running safety tests..."
cd "$MC_DIR"
npm test
if [ $? -ne 0 ]; then
    echo "  ❌ Safety tests FAILED! Aborting deploy."
    exit 1
fi
echo "  ✅ Safety tests passed"

# 1. Backup current state
echo "[1/6] Backing up current state..."
cp "$SCRIPT_DIR/projects.json" "$SCRIPT_DIR/backups/projects-$DATE.json.bak"
cp "$SCRIPT_DIR/tasks.json" "$SCRIPT_DIR/backups/tasks-$DATE.json.bak"
echo "  → Backed up to backups/projects-$DATE.json.bak"

# 2. Build Mission Control
echo "[2/6] Building Mission Control..."
npm run build

# 3. Restart PM2
echo "[3/6] Restarting PM2..."
pm2 restart mission-control

# 4. Wait for startup
echo "[4/6] Waiting for server..."
sleep 5

# 5. Verify
echo "[5/6] Verifying..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://mc.brendanrogers.au)

if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ Deploy successful! (HTTP $HTTP_CODE)"
else
    echo "  ❌ Deploy failed! (HTTP $HTTP_CODE)"
    echo "  → Rolling back..."
    cp "$SCRIPT_DIR/backups/projects-$DATE.json.bak" "$SCRIPT_DIR/projects.json"
    cp "$SCRIPT_DIR/backups/tasks-$DATE.json.bak" "$SCRIPT_DIR/tasks.json"
    pm2 restart mission-control
    echo "=== MC Deploy FAILED & Rolled Back ==="
    exit 1
fi

echo "=== MC Deploy Complete ==="
exit 0
