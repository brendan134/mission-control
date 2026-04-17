# Error Tracker
\n## Purpose
Parse and summarize console/server errors. Track recurring issues.
\n## Commands
\n### Parse Last 50 Lines of Server Log
```bash
journalctl -n 50 --no-pager | grep -iE "error|warn|fail" | tail -20
```\n
\n### Check for Hydration Errors
```bash
grep -r \"hydration\" /data/.openclaw/workspace/.next/logs 2>/dev/null | tail -5
```\n
\n### Count Errors by Type
```bash
echo \"=== Error Summary ===\" 
journalctl --no-pager -n 200 | grep -oE \"\\[ERROR\\].*\" | cut -d: -f2- | sort | uniq -c | sort -rn | head -10
```\n
\n### Watch for New Errors (Live)
```bash
journalctl -f | grep -iE \"error|exception|crash\"
```\n
\n### Common Mission Control Fixes\n- 502/504: Server crashed → restart\n- Hydration: Client/Server mismatch → check Date() usage\n- Port in use: lsof -i :3003 → kill process\n