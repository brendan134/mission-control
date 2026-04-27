# Mac Mini Migration Notes

_Document changes needed when migrating from current VPS setup to Mac Mini._

## Obsidian Vault Restructure (Layer 3)

When migrating to Mac Mini, update Obsidian vault structure to match spec:

### Current Structure
```
obsidian/
├── 01-daily-logs/
├── 02-mistakes/
└── 03-shared/
```

### Target Structure (Post-Migration)
```
obsidian/
├── Agent-Shared/
│   ├── user-profile.md
│   ├── project-state.md
│   └── decisions-log.md
├── Agent-Hermes/
│   ├── working-context.md
│   ├── mistakes.md
│   └── daily/
└── Agent-OpenClaw/
    └── (OpenClaw's space - do not touch)
```

### Migration Steps
1. Create new folder structure under `obsidian/`
2. Migrate existing files:
   - `02-mistakes/` → `Agent-Hermes/mistakes.md`
   - `01-daily-logs/` → `Agent-Hermes/daily/`
   - `03-shared/` → `Agent-Shared/` (review contents)
3. Create new files:
   - `Agent-Shared/user-profile.md`
   - `Agent-Shared/project-state.md`
   - `Agent-Shared/decisions-log.md`
   - `Agent-Hermes/working-context.md`
4. Update AGENTS.md to reference new structure

---

## Other Migration Considerations

### OpenClaw Config
- Move `/data/.openclaw` to Mac Mini
- Update SSH keys and tunnel credentials
- Verify Telegram/email integrations work

### Mission Control
- Rebuild on Mac Mini or clone from GitHub
- Verify PM2 ecosystem config
- Check Node.js version compatibility

### Cron Jobs
- Review timezone settings (default to Australia/Sydney)
- Verify webhook delivery endpoints

---

_Created: 2026-04-26_
### Fathom Video Upload Automation
**Priority: Post-Migration**

Currently: Manual download from Fathom → manual upload to Drive

Once on Mac Mini:
- [ ] I will have direct file system access to Downloads folder
- [ ] Configure Google Drive API credentials
- [ ] Create automation: Monitor Downloads → Auto-upload to Drive
- [ ] Folder: `Leader By Design/Fathom Calls`

**Workflow (Future):**
1. You download call from Fathom → Downloads
2. I detect new file → Upload to Drive automatically
3. No manual steps needed
