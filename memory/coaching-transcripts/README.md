# Coaching Transcripts Storage

**Purpose:** Store extracted Fathom coaching call transcripts for offline access and portability

**Source:** Fathom.video MCP (connected via API)

---

## Folder Structure

```
coaching-transcripts/
├── README.md (this file)
├── 2026-04/           # Month folders
│   ├── 2026-04-23-stephen-hunt.md
│   ├── 2026-04-22-chad-onley.md
│   └── ...
├── index.md           # Master index of all transcripts
└── topics.md          # Extracted topics/themes from all calls
```

---

## Usage

### Adding New Transcripts
Run via cron or manually:
1. Fetch recent meetings from Fathom
2. Extract transcripts
3. Save to `memory/coaching-transcripts/YYYY-MM/`
4. Update index.md

### Accessing Transcripts
- **Online:** Use Fathom MCP directly
- **Offline:** Access stored markdown files here

---

## Update Frequency

**Recommended:** Monthly extraction of key coaching calls
- Last 20-30 most relevant calls
- Focus on: Growth Club members, VIP clients, pattern themes

---

## Topics Extraction

Each month, also create `topics.md` with:
- Recurring themes
- Common challenges
- Content ideas for podcast

---

*Last updated: 2026-04-23*
*Fathom MCP connected via openclaw mcp*