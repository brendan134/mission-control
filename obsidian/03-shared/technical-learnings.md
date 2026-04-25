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

### 4. Projects Page Reverting to Old Data
**Problem:** Projects page showed correct 5 projects on fresh load, then reverted to 3 projects after ~3 seconds.

**Root Cause:** 
1. Buggy fallback timer in `useEffect`: `setTimeout(() => { loadProjects(); }, 3000)` was overwriting API data after 3 seconds
2. Possible Next.js caching on API routes

**Fix:**
1. Removed the fallback timer from `page.tsx`
2. Added `export const dynamic = 'force-dynamic';` to `/api/projects/route.ts`
3. Added `{ cache: 'no-store' }` to client-side `fetch` calls in `page.tsx`
4. Rebuilt and restarted Mission Control

**Lesson:**
- Next.js caching is complex; `force-dynamic` isn't always enough
- Fallback timers in `useEffect` can cause race conditions with API data
- Explicitly disable caching on client fetches (`cache: 'no-store'`)
- Restart the server to clear in-memory caches

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

---

## Session: April 25 Evening - Additional Learnings

### 6. API Must Support Filtering
**Problem:** Project detail showed ALL tasks (18) instead of only linked tasks (4).

**Root Cause:** The `/api/tasks` endpoint didn't filter by `project_id` query parameter.

**Fix:**
- Updated `src/app/api/tasks/route.ts` to read `project_id` from URL searchParams
- Added filter: `tasks.filter(t => t.project_id === projectId)`
- API now returns correct tasks for each project

**Lesson:** Always verify API endpoints accept and handle query parameters for filtering. Don't assume filtering exists - check the route code.

### 7. Next.js Static Prerendering Causing Stale Data
**Problem:** Projects page renders 5 projects initially, then reverts to old version with 3 projects.

**Root Cause:**
- Page was pre-rendered statically at build time
- Initial state used server-side function `getProjects()` which got baked into static HTML
- Next.js served stale static HTML, client fetch happened after

**Fix Attempted:**
- Changed initial state to empty array `[]`
- Ensured client-side `useEffect` fetches data via API
- Added `export const dynamic = 'force-dynamic'` (failed for client component)
- Cleared `.next/cache` multiple times

**Status:** Still investigating - page still reverts to old version.

**Lesson:** Be careful with initial state in client components. Empty array `[]` is safer than calling server functions directly. Further investigation needed for static prerendering issues.


### 8. Port & Process Conflicts
**Problem:** Mission Control failed to start with "EADDRINUSE: address already in use :::62248"

**Fix:**
- Killed all node processes (`pkill -f node`)
- Used specific port 3003 explicitly
- Used direct path to next binary: `./node_modules/.bin/next start`


**Lesson:** When facing port conflicts, kill all related processes and use explicit port selection.