# Value-Add Automation Workflow

## Quick Start

After a coaching call, here's the workflow:

### 1. I Create the Value-Add
I extract the transcript and create a deliverable (template, checklist, letter, etc.)
Saved to: `memory/value-add/[client]-[date].md`

### 2. You Review
You review the deliverable and either:
- Request revisions
- **Approve** it for sending

### 3. Send Command
When ready, you tell me:
> "Send to [Client Name] - [email address]"

Or simply:
> "Approve [client] value-add"

### 4. I Send
I run the script and:
- Personalizes the email
- Sends via himalaya
- Confirms delivery

---

## Example Commands

```
# Create value-add (after call)
"Create value-add for [client]"

# Preview before sending
"Show me the [client] value-add"

# Send after approval
"Send to jane@email.com - Jane Smith"

# Or just
"Approve and send to Jane"
```

---

## Technical Details

- **Script:** `scripts/send-value-add.sh`
- **Template:** `templates/value-add-email.md`
- **Storage:** `memory/value-add/[client]-[date].md`
- **Email:** himalaya CLI → brendan@brendanrogers.com.au
- **Always:** You approve before sending (human in loop)

---

## What's Sent

| Component | Source |
|-----------|--------|
| Subject | Auto-generated from template |
| Body | Personalized intro + value-add content |
| From | brendan@brendanrogers.com.au |
| Signature | Your standard sign-off |

**Note:** No attachments in v1 — just the content in the email body. Can add attachments in v2 if needed.