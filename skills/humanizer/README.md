# Humanizer Skill

Strips AI writing patterns from text to make it sound more natural and human-written.

## Installation

This skill is ready to use. No additional installation required beyond placing it in the skills directory.

## Usage

### Manual Use
- "Humanize this text"
- "Make this sound more natural"
- "Remove AI patterns from this"

### Automatic Use
Runs automatically on any user-facing prose over 200 words.

## Testing

Run regression tests:
```bash
node skills/humanizer/tests/regression.test.js
```

## Adding New Patterns

To add new detection patterns, edit:
- `lib/humanizer.js`
- Add to appropriate arrays: `STOCK_PHRASES`, `HALLMARK_VOCAB`, etc.

## Design Principles

1. Preserve original meaning
2. Don't over-clean (some formality is okay)
3. Keep author's voice intent
4. Vary sentence structure naturally
5. Test all new patterns with regression tests