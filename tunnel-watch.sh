#!/bin/bash
while true; do
    if ! pgrep -f "cloudflared tunnel" > /dev/null 2>&1; then
        /data/.openclaw/workspace/cloudflared tunnel --url http://localhost:3 >> /data/.openclaw/workspace/tunnel.log 2>&1 &
    fi
    sleep 30
done
