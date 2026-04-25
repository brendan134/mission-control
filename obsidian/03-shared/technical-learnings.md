# Technical Learnings

## Mission Control Debugging

### 1. Projects Page - Tasks Not Displaying
**Problem:** Tasks linked to a project weren't showing in the project detail view.

**Root Cause:** The `getProjectTasks` function was using a server-side function (`getTasksByProject`) but the page was client-side and trying to access task data incorrectly.

**Fix:** 
- Changed to fetch tasks via API (`fetch('/api/tasks?project_id=...')`) in a `useEffect` hook
- Added state management for `projectTasks`
- Used client-side state for filtering and displaying tasks

**Lesson:** In Next.js App Router, ensure client components fetch data via API routes or use client-side fetching, not direct server function calls.

### 2. Add Task Button Not Working
**Problem:** The "+ Add Task" button on project detail wasn't functional (no onClick handler).

**Fix:**
- Added `showCreateTask` and `newTask` state
- Added `handleCreateTask` function to create tasks via API
- Added modal UI for task creation
- Wired up the button to set `showCreateTask(true)`

**Lesson:** Always verify button interactivity - check for missing state, handlers, and UI components.

### 3. Cloudflare Tunnel 530 Errors
**Problem:** Accessing `mc.brendanrogers.au` returned HTTP 530 even though tunnel appeared connected.

**Root Cause:** 
- Tunnel ID changed after deleting and recreating ("Mission-Control")
- DNS was still pointing to old tunnel ID (`4a6b285e...`)
- New tunnel ID was `8180b9b3...`

**Fix:**
- Identified the issue by checking `cloudflared tunnel list` and comparing with DNS target
- Updated DNS CNAME to point to new tunnel ID (`8180b9b3...cfargotunnel.com`)

**Lesson:** When recreating Cloudflare tunnels, ALWAYS update the DNS record immediately. The tunnel name can stay the same but the ID changes.

### 4. Build & Deployment
**Problem:** Code changes not appearing even after rebuild/restart.

**Possible Causes:**
- Next.js static caching (HIT in response headers)
- PM2 process conflicts (multiple instances)
- Port conflicts

**Fixes:**
- Clear `.next/cache` directory
- Delete and recreate PM2 processes
- Kill stray node processes on ports
- Always rebuild after code changes

**Lesson:** When deploying Next.js changes, ensure clean rebuild and restart. Use `rm -rf .next/cache` if needed.

### 5. Info Icons on Kanban Columns
**Added ℹ️ icons** next to column headers with hover tooltips explaining each stage:
- Capture, Define, In Progress, Waiting, Review, Done

**Lesson:** Small UX improvements require adding imports, updating state/constants, and modifying component rendering.

---

## Key Takeaways for Future
1. **DNS + Tunnel ID must match** - Check `cloudflared tunnel list` vs DNS CNAME target
2. **Client vs Server data** - Use API routes for client components
3. **Clean restarts** - Delete PM2 processes before restarting after crashes
4. **Test thoroughly** - Don't just check if it builds, verify functionality