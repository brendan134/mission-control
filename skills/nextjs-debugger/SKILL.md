---
name: nextjs-debugger
description: Diagnose and fix Next.js build/runtime errors in Mission Control. Use when: (1) Next.js shows error page or blank page, (2) build fails with TypeScript/component errors, (3) hot reload not working, (4) API routes returning 404/500, (5) any Next.js-specific debugging needed.
---

# Next.js Debugger

## Quick Diagnosis

### Error Types & Fixes

**"Module not found" / "Cannot find module"**
```bash
ls node_modules/<module-name>
npm install <module-name>
```

**"404: This page could not be found"**
- Check file is in `src/app/` (not `app/`)
- Verify route: `/team` → `team/page.tsx`
- Check for typos in folder/file names

**Blank page / No response**
```bash
pm2 restart mission-control
```

**Stale cache errors**
```bash
rm -rf .next && npm run dev
```

**Port in use**
```bash
lsof -i :3003
kill -9 <PID>
```

## Common Fixes
- Hard refresh: `Ctrl+Shift+R`
- Check browser console
- `curl localhost:3003/<route>`
- `pm2 logs mission-control`