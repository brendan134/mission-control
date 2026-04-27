# Complete Fathom Extraction & Content Workflow

**Last Updated:** April 27, 2026

---

## Overview

This workflow covers the end-to-end process from a coaching call finishing in Fathom to:
1. Value Add items sent to client
2. Social media posts scheduled

---

## Full Workflow Steps

| Step | Action | Output | Owner |
|------|--------|--------|-------|
| 1 | **Trigger Extraction** | "Extract latest Fathom call" | Brendan |
| 2 | **Extract & Format** | V2 Transcript with 11 fields | Niles |
| 3 | **Add Value Add** | Done-for-you recommendations (min 3) | Niles |
| 4 | **Create Word Docs** | .docx files for each Value Add item | Niles |
| 5 | **Generate Social Drafts** | LinkedIn, Instagram, Facebook drafts | Niles |
| 6 | **Brendan Reviews** | Approves Value Add + Social posts | Brendan |
| 7 | **Email to VA (Dom)** | Social posts link for scheduling | Niles |
| 8 | **Email to Client** | Value Add Word doc links | Niles |
| 9 | **VA Schedules** | Posts scheduled in CC360 | Dom |
| 10 | **Pipeline Update** | Move item through pipeline stages | Niles |
| 11 | **Cron Cleanup** | 23:00 catches any remaining calls | System |

---

## Step Details

### Step 1: Trigger Extraction
Brendan triggers extraction after a coaching call:
- Say: "Extract latest Fathom call"
- Or run: `openclaw cron run 3d1fe27b-d7c8-4bc7-9c1e-59a63bc5d124`

### Step 2: Extract & Format (Niles)
- Fetch transcript from Fathom API
- Format using V2 Template (11 required fields)
- Save to: `memory/coaching-transcripts/YYYY-MM/`

### Step 3: Add Value Add (Niles)
Generate **minimum 3 done-for-you recommendations**:
- Draft emails
- Templates
- Checklists
- Scripts
- One-pagers
- Visual workflows

Saved in the transcript file under "VALUE ADD" section.

### Step 4: Create Word Docs (Niles)
- Convert each Value Add item to .docx
- Save to: `content/value-add/`
- These are sent to client

### Step 5: Generate Social Drafts (Niles)
Create platform-specific posts:
- **LinkedIn** - Leadership insights, longer form
- **Instagram** - Short, engagement hook, visual suggestion
- **Facebook** - Conversational, community-building

**Rules (MUST FOLLOW):**
- No emdashes (use hyphens -)
- Humanized content - write like Brendan speaks naturally
- Generic - no industry or client specifics
- Always include **#leaderbydesign**
- CC360-ready format (clean, no complex markdown)
- Clear post separation with graphic suggestions
- Emails to VA need repo details removed (just link)

Saved to: `social-media-drafts/`

### Step 6: Brendan Reviews
- Review transcript with Value Add items
- Review social media drafts
- Approve or request edits

### Step 7: Email to VA (Dom)
- Draft: `content/email-drafts/email-to-dom-social-posts.md`
- Send to: Dom (dmancera.unlimited@gmail.com)
- Timeline: 48 hours
- Include: Link to social drafts, key points

### Step 8: Email to Client
- Draft: `content/email-drafts/email-to-[client]-value-add.md`
- Send Word doc links (direct download links)
- Subject: "Done-for-you items from our call"
- Start: "Great to see you today..." / "Feel free to tweak..."

### Step 9: VA Schedules
Dom copies posts to CC360 and schedules:
- LinkedIn
- Instagram
- Facebook

### Step 10: Pipeline Update
Update `content/pipeline.md`:
- "Sent to Dom - Pending Scheduling"
- When confirmed done → "Scheduled"
- After posting → "Recently Posted"

### Step 11: Cron Cleanup
Daily at 23:00 Sydney - catches any calls not yet extracted.

---

## File Locations

| Content | Location |
|---------|----------|
| Transcripts | `memory/coaching-transcripts/YYYY-MM/` |
| Value Add (source) | `content/value-add/` (markdown) |
| Value Add (client) | `content/value-add/*.docx` |
| Social Drafts | `social-media-drafts/` |
| Email Drafts | `content/email-drafts/` |
| Pipeline | `content/pipeline.md` |
| V2 Template | `memory/coaching-transcripts/V2_TEMPLATE.md` |

---

## Social Media Post Rules

1. **No emdashes** - use hyphens (-) instead
2. **Humanize content** - write like Brendan speaks (conversational, direct)
3. **Generic content** - no industry specifics, no client mentions
4. **Always include #leaderbydesign**
5. **CC360-ready format** - clean text, clear separators
6. **Graphic suggestions** - include for each post
7. **Emails to VA** - no repo/folder details, just the link

---

## Quick Commands

```bash
# Extract latest call
"Extract latest Fathom call"

# Or trigger cron manually
openclaw cron run 3d1fe27b-d7c8-4bc7-9c1e-59a63bc5d124
```

---

## Notes

- Value Add items: Source in GitHub, send Word doc links to client
- Social media posts: CC360-ready format
- Pipeline tracks status - update when items move
- 48-hour check via heartbeat for pending items
- Future: Video download → Google Drive (post Mac Mini migration)