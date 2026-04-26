# Fathom Transcript Extraction Process

## Overview
Process for extracting Fathom meeting transcripts in batches for business analysis. Used for July 2025 calls (31 calls across 4 weeks).

## When to Use
- Business analysis of client calls
- Building training data
- Reviewing past meetings

## Prerequisites
- Fathom API access configured
- Recording IDs list (get from Fathom dashboard or prior export)

## Step-by-Step Process

### 1. Get Call List
1. Log into Fathom
2. Navigate to Meetings / Activity
3. Filter by date range (e.g., July 2025)
4. Export or note all recording IDs

### 2. Organize into Batches
- **Recommended batch size:** 7-10 calls per batch
- **Organize by week:** Group by calendar week for logical ordering
- **Note:** Fathom API can handle ~10 concurrent requests

### 3. Extract Transcripts
Use `fathom__fathom_get_transcript` tool for each recording ID:

```
fathom__fathom_get_transcript(recording_id: <ID>)
```

**Tip:** Extract all IDs in a batch simultaneously using parallel tool calls (fathom supports concurrent requests).

### 4. Handle Errors
- **502 errors:** Retry after brief wait (30-60s) - usually succeeds on retry
- **Rate limits:** If 429, wait and continue with remaining calls

### 5. Verify & Store
- Count extracted transcripts matches expected
- Save to appropriate location (transcripts/ folder or analysis repo)
- Update tracking document with completion status

## Lessons Learned (July 2025)

### What Worked
- Batch extraction by week (7 calls each)
- Parallel tool calls for speed
- Retry strategy for 502s

### What to Improve
- Get complete ID list BEFORE starting extraction
- Pre-validate IDs exist in Fathom before batch
- Consider pagination if >50 calls in month

## Recording ID Format
Fathom recording IDs are numeric (e.g., 72389045, 77853118)

## Storage Location
- Raw transcripts: `transcripts/YYYY-MM/` or `fathom/transcripts/YYYY/`
- Analysis: Business analysis repo

## Time Est. (July 2025)
- ~31 calls extracted in ~15 minutes active work
- Mostly waiting on API responses

---

*Last updated: 2026-04-26*
*Used for: July 2025 (31 calls)*