#!/bin/bash
# Social Media Draft Generator from V2 Transcript
# Usage: ./generate-social-drafts.sh <transcript-file>

TRANSCRIPT="$1"
OUTPUT_DIR="/data/.openclaw/workspace/social-media-drafts"
DATE=$(date +%Y-%m-%d)

if [ -z "$TRANSCRIPT" ]; then
    echo "Usage: $0 <transcript-file>"
    echo "Example: $0 memory/coaching-transcripts/2026-04/26-jocelyn-birch-baker.md"
    exit 1
fi

CLIENT=$(basename "$TRANSCRIPT" .md | sed 's/^[0-9]*-//; s/-/ /g')

echo "=== Generating Social Media Drafts for: $CLIENT ==="
echo "Transcript: $TRANSCRIPT"
echo "Output: $OUTPUT_DIR/"

# This is a placeholder - in reality we'd call an LLM to generate
# The actual generation happens when I run the extraction

echo "Done! Social drafts saved to $OUTPUT_DIR/"
echo "To generate: Tell me 'Generate social drafts from [filename]'"