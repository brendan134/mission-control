# Humanizer Skill

## Status
✅ Tests passing (24/24)

## Purpose
Strip AI writing patterns from text to make it sound more natural and human-written.

## Location
```
skills/humanizer/
├── SKILL.md                    # Skill definition
├── lib/humanizer.js            # Core detection & transformation logic
├── tests/regression.test.js    # Regression tests
└── README.md                   # Documentation
```

## Usage

### Manual
- "Humanize this text"
- "Make this natural"
- "Remove AI patterns"

### Automatic
Runs on any user-facing prose over 200 words.

## Patterns Removed

| Category | Examples |
|----------|----------|
| Stock phrases | "at the end of the day", "it's worth noting", "in conclusion" |
| Hedging | could, maybe, perhaps, might |
| Formulaic transitions | furthermore, moreover, firstly |
| Hallmark AI vocab | leverage, tapestry, delve, cutting-edge |
| Structural | excessive em dashes, rule of three |
| Vapid openers | "in today's fast-paced world" |

## Testing

```bash
node skills/humanizer/tests/regression.test.js
```

## Adding New Patterns

Edit `lib/humanizer.js`:
- `STOCK_PHRASES` array
- `HEDGING_PATTERNS` array
- `FORMULAIC_TRANSITIONS` array
- `HALLMARK_VOCAB` object

Add tests to `tests/regression.test.js` to catch regressions.

## Design Rules
- Preserve original meaning
- Don't over-clean (some formality is okay)
- Keep author's voice intent
- Vary sentence structure naturally
- All new patterns need regression tests