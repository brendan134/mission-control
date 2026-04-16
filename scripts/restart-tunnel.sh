#!/bin/bash
# Tunnel auto-restart script

# Check if cloudflared is running
if pgrep -f "cloudflared tunnel" > /dev/null; then
    exit 0
fi

# Restart tunnel
/data/.openclaw/workspace/cloudflared tunnel --url http://localhost:3 >> /data/.openclaw/workspace/tunnel.log 2>&1 &
