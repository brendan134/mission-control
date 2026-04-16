# Mission Control Operations Rules

1. **Document port assignments** - Decide upfront which port each service uses and keep a record (we've had 3000, 3001, 3002, 3003 all for Mission Control)

2. **One tunnel config at a time** - Delete old cloudflared configs before creating new ones to avoid confusion

3. **Test externally, not just locally** - Always verify through the tunnel, not just localhost

4. **Commit configs to git** - Keep cloudflared configs in the workspace so they're version-controlled

5. **Kill old processes before starting new** - Make sure nothing is running on a port before starting a new instance

6. **Never deviate from these rules** unless direct approval is given on a case-by-case basis.

7. **Never create a new Tunnel in Cloudflare** - The tunnel we use for Mission Control is always called 'Mission-Control'. If it's down, troubleshoot to resolve it. Don't create any extra Tunnels.

8. **Port assignment for Mission Control is always 3003** - This is the only port we use unless explicitly told it can't work on that tunnel (in which case approval will be sought).