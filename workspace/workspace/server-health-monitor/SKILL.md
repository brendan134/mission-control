# Server Health Monitor

## Purpose
Monitor Mission Control server health and auto-recover from crashes.

## When to Use
- Server goes down unexpectedly
- Need to check if services are running
- After system changes that might affect stability

## Commands

### Check Health
```bash
curl -s http://localhost:3003/ | grep -q "Leader By Design" && echo "UP" || echo "DOWN"
```

### Auto-Restart If Down
```bash
if ! curl -s http://localhost:3003/ | grep -q "Leader By Design"; then
  pkill -f "next dev" 2>/dev/null
  sleep 2
  cd /data/.openclaw/workspace/workspace/control && npx next dev -p 3003 &
  echo "Restarted"
fi
```

### Full Health Check
```bash
echo "=== Server Health ==="
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3003/
curl -s http://localhost:3003/workspace/workspace/cron | grep -o "jobs" | head -1
ps aux | grep "next dev" | grep -v grep | wc -l
```
