# POST-RESTORE-CHECKLIST - Cloudflare Tunnel Setup

## Steps to Recreate Tunnel

### 1. Delete Old Tunnel (in Cloudflare Dashboard)
- Go to Cloudflare Dashboard → Zero Trust → Access → Tunnels
- Delete "Mission-Control" tunnel

### 2. Create New Tunnel
- Click "Create a new tunnel"
- Name: `Mission-Control`
- Copy the token (keep this safe!)

### 3. Configure Ingress Rule
- In the tunnel setup, add a public hostname:
  - **Hostname:** `mc.brendanrogers.au`
  - **Service:** `http://127.0.0.1:3003` (NOT localhost - IPv6 issue!)
- Save the tunnel

### 4. Update Local Scripts
After creating the tunnel, update the token in:
- `/data/.openclaw/workspace/start-tunnel.`
- Any PM2 configs

### 5. Run the Tunnel
```bash
# Stop any existing cloudflared
pkill cloudflared

# Run new tunnel (get actual token from step 2)
/data/.openclaw/workspace/cloudflared tunnel run --token "YOUR_NEW_TOKEN"
```

### 6. Verify DNS
- Ensure DNS record exists: `mc.brendanrogers.au` → tunnel
- **CRITICAL:** Set Proxy Status to **Proxied** (not DNS only)

### 7. Test
```bash
curl -s -o /dev/null -w "%{http_code}" https://mc.brendanrogers.au
# Should return 200
```

## Key Rules (from past mistakes)
- ✅ Use `127.0.0.1` not `localhost` in ingress rule
- ✅ Set DNS Proxy Status to "Proxied"
- ✅ Use nohup or PM2 to keep tunnel running
- ❌ Don't use localhost - causes IPv6 resolution issue