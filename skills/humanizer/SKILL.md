---
name: humanizer
description: "Strip AI writing patterns from text. Use when: user asks to 'humanize', 'make natural', 'remove AI patterns', or any user-facing prose over 200 words needs cleaning. Also runs automatically on longer outputs."
---

# Humanizer Skill

Removes common AI writing patterns from text to make it sound more natural and human-written.

## When to Use

- User asks to "humanize" or "make natural"
- Any user-facing prose over 200 words
- Before sending polished messages, emails, content

## Patterns to Remove

### 1. Stock Phrases
- "at the end of the day"
- "it's worth noting"
- "in today's digital age"
- "as technology continues to evolve"
- "in today's fast-paced world"
- "moving forward"
- "ultimately"
- "in essence"
- "in conclusion"

### 2. Hedging Language
- "may", "might", "could", "could be"
- "it could be argued that"
- "it's possible that"
- "one might say"
- "perhaps", "possibly"

### 3. Formulaic Transitions
- "firstly", "secondly", "thirdly" (overuse)
- "on the other hand"
- "additionally"
- "furthermore"
- "moreover"
- "that being said"

### 4. Rule of Three Overuse
- "No X. No Y. Just Z." patterns
- Triplet structures used mechanically

### 5. Hallmark AI Vocabulary
- "tapestry"
- "delve" (into)
- "leverage"
- "testament"
- "myriad"
- "facet"
- "ever-evolving"
- "cutting-edge"
- "game-changer"

### 6. Structural Tics
- Excessive em dashes (—)
- Mid-sentence questions ("The solution? It's...")
- Vapid openers like "As [topic] continues to..."
- Over-organization with excessive bullet points
- Perfect rectangular paragraphs (3 sentences, 15-20 words each)

### 7. Performed Authenticity
- "Honestly", "frankly", "truth be told" used unnecessarily
- Fake personal anecdotes
- Over-emphasis on being "real" or "human"

## How It Works

1. Receive text
2. If under 200 words, return as-is (skip processing)
3. Run detection scan and report found patterns
4. Apply transformation rules:
   - Remove or replace stock phrases
   - Reduce hedging language
   - Break up repetitive sentence structures
   - Replace hallmark vocabulary with simpler words
   - Vary sentence length and structure
5. Return cleaned text with a brief change summary

## Output Format

```
## Humanized

[cleaned text]

## Changes Made
- Removed X stock phrases
- Reduced hedging language
- Simplified X hallmark words
- Varied sentence structure
- Total: X patterns fixed
```

## Safety

- Preserve the original meaning
- Don't remove phrases that are genuinely needed
- Keep technical accuracy
- Maintain author's voice intent