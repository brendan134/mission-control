#!/bin/bash
# Fathom Transcript Extraction - On Demand
# Run this after a coaching call to extract immediately

cd /data/.openclaw/workspace

echo "=== Fathom On-Demand Extraction ==="
echo "Checking for recent meetings..."

# Get meetings from last 2 hours
node -e "
const { fetch } = require('undici');
const API_KEY = process.env.FATHOM_API_KEY || 'demo';

async function checkRecent() {
  // This will be replaced with actual Fathom API call
  console.log('Checking Fathom for meetings from last 2 hours...');
}
"

# Run the extraction agent
echo ""
echo "Running extraction..."
openclaw sessions spawn --kind agentTurn --message "Check for NEW Fathom meetings from the last 2 hours (not yet in index) and extract transcripts using V2 template. Save to memory/coaching-transcripts/. Update index.md. Report how many extracted." --model minimax --timeout 300

echo ""
echo "Done! Check Mission Control for results."