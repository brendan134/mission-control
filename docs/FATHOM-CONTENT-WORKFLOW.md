# Complete Fathom Extraction & Content Workflow

**Last Updated:** April 27, 2026

---

## Overview

This workflow covers the end-to-end process from a coaching call finishing in Fathom to social media posts being scheduled.

---

## Full Workflow Steps

| Step | Action | Output | Owner |
|------|--------|--------|-------|
| 1 | **Trigger Extraction** | "Extract latest Fathom call" | Brendan |
| 2 | **Extract & Format** | V2 Transcript with 11 fields | Niles |
| 3 | **Add Value Add** | Done-for-you recommendations (min 3) | Niles |
| 4 | **Generate Social Drafts** | LinkedIn, Instagram, Facebook drafts | Niles |
| 5 | **Brendan Reviews** | Approves or requests edits | Brendan |
| 6 | **Email to VA** | Dom receives email with link | Niles/Brendan |
| 7 | **VA Schedules** | Posts scheduled in CC360 | Dom |
| 8 | **Cron Cleanup** | 23:00 catches any remaining calls | System |

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

### Step 4: Generate Social Drafts (Niles)
Create platform-specific posts:
- **LinkedIn** - Leadership insights, longer form
- **Instagram** - Short, engagement hook, visual suggestion
- **Facebook** - Conversational, community-building

**Rules:**
- No emdashes (use hyphens)
- Humanized content - write like Brendan speaks
- Generic - no industry or client specifics
- Always include #leaderbydesign
- CC360-ready format

Saved to: `social-media-drafts/`

### Step 5: Brendan Reviews
- Review transcript with Value Add items
- Review social media drafts
- Approve or request edits

### Step 6: Email to VA (Dom)
Send email with:
- Link to social media drafts
- Timeline (48 hours)
- Key points summary

**Email draft location:** `content/email-drafts/email-to-dom-social-posts.md`

### Step 7: VA Schedules
Dom copies posts to CC360 and schedules:
- LinkedIn
- Instagram
- Facebook

### Step 8: Cron Cleanup
Daily at 23:00 Sydney - catches any calls not yet extracted.

---

## File Locations

| Content | Location |
|---------|----------|
| Transcripts | `memory/coaching-transcripts/YYYY-MM/` |
| Value Add | Inside each transcript file |
| Social Drafts | `social-media-drafts/` |
| Email Drafts | `content/email-drafts/` |
| V2 Template | `memory/coaching-transcripts/V2_TEMPLATE.md` |

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

- Social media posts are CC360-ready (clean format, no complex markdown)
- Value Add items are in the transcript file for client delivery
- Future: Video download → Google Drive automation (post Mac Mini migration)