# POST-RESTORE RECOVERY CHECKLIST

## Only edit files in /data/.openclaw/workspace/workspace/control/ - NEVER delete or move the mission-control directory

---

## IMMEDIATE AFTER RESTORE:

### 1. Fix tasks.json (if needed)
Two tasks need stage changed from "Planning" to "Define":
- Task: "Book flights to Greece" (id: task-1777175391184-uajuq1ixr)
- Task: "Arrange initial accommodation in Athens" (id: task-1777175391209-l7dd9cvfn)

Command:
```bash
sed -i 's/"stage": "Planning"/"stage": "Define"/g' /data/.openclaw/workspace/tasks.json
```

### 2. Re-add Testing Infrastructure
In `/data/.openclaw/workspace/mission-0/`:
- Create `jest.config.js`
- Create `jest.setup.js` 
- Create `tests/api.test.js`

### 3. Start Mission Control
```bash
cd /data/.openclaw/workspace/mission-0
npm install
npm run dev
```

---

## RULES TO AVOID FUTURE DISASTERS:

### DO:
- Edit files IN PLACE using edit/write tools
- Work within /data/.openclaw/workspace/workspace/control/ only
- Test immediately after starting server
- Commit changes to git regularly

### DON'T:
- DON'T run git clone inside /data/.openclaw/workspace/workspace/control/
- DON'T delete the mission-0 directory
- DON'T create directories with spaces in names
- DON'T run "cd" commands that navigate away from workspace
- DON'T use rm -rf unless absolutely certain of the path
