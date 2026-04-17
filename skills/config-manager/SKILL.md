# Config Manager

## Purpose
Manage environment variables and configuration across the AI OS.
Keep secrets out of git, manage different environments (dev/prod).

## Key Files
- `/data/.openclaw/workspace/.env` - local secrets
- `/data/.openclaw/workspace/workspace/control/workspace.config.ts` - app config

## Commands

### List Current Config
```bash
echo "=== Mission Control Config ==="
grep -E "port|host|url" /data/.openclaw/workspace/workspace/control/workspace/config.ts
```

### Update Config Value
```bash
# Example: change port
sed -i 's/port: 3003/port: 3005/' /data/.openclaw/workspace/workspace/control/workspace/config.ts
```

### Backup Config
```bash
cp /data/.openclaw/workspace/workspace/control/workspace/config.ts /data/.openclaw/workspace/workspace/config-backup.ts
```

### List Environment Variables
```bash
env | grep -E "OPENCLAW|MISSION|NODE" | sort
```
