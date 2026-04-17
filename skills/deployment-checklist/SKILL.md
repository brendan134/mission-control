# Deployment Checklist

## Purpose
Validate Mission Control is ready for deployment or release.
Prevents pushing broken code.

## Commands

### Pre-Deployment Check
```bash
cd /data/.openclaw/workspace/workspace/control

echo "=== Pre-Deploy Checks ==="

echo "1. Git status..."
git status --short

echo "2. Build check..."
npx next build 2>&1 | tail -20

echo "3. Port in use?"
lsof -i :3003 | grep LISTEN || echo "Port 3003 free"

echo "4. Dependencies OK?"
npm audit --audit-level=high 2>&1 | head -10
```

### Quick Validation
```bash
cd /data/.openclaw/workspace/workspace/control
npx next build --no-lint
```
