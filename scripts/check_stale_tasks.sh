#!/bin/bash
# Daily Task Accountability Check Script
# Runs daily at 9 AM. Checks for stale tasks and escalates.

API_URL="http://localhost:3003/api/tasks/stale"
SYDNEY_HOUR="09"
SYDNEY_MINUTE="00"

echo "--- Running Daily Task Accountability Check ---"
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"

# Fetch stale tasks data
OUTPUT=$(curl -s "$API_URL")
STATUS=$?

if [ $STATUS -ne 0 ]; then
  echo "Error: Failed to fetch stale tasks from $API_URL. (curl exit code: $STATUS)"
  # In a real scenario, this error itself would be part of an alert.
  exit 1
fi

# Parse JSON output using jq (if available)
if command -v jq &> /dev/null
then
    CRITICAL_COUNT=$(echo "$OUTPUT" | jq '.critical | length')
    WARNING_COUNT=$(echo "$OUTPUT" | jq '.warning | length')
    YELLOW_COUNT=$(echo "$OUTPUT" | jq '.yellow | length')
else
    echo "Warning: jq not found. Using basic grep/sed parsing (less robust)."
    # Basic parsing without jq - might be less reliable
    CRITICAL_COUNT=$(echo "$OUTPUT" | grep -o '"critical": \[.*?\],' | sed -n 's/.*"critical": \[.*\]/\0/p' | grep -o '"id":' | wc -l)
    WARNING_COUNT=$(echo "$OUTPUT" | grep -o '"warning": \[.*?\],' | sed -n 's/.*"warning": \[.*\]/\0/p' | grep -o '"id":' | wc -l)
    YELLOW_COUNT=$(echo "$OUTPUT" | grep -o '"yellow": \[.*?\],' | sed -n 's/.*"yellow": \[.*\]/\0/p' | grep -o '"id":' | wc -l)
fi

echo "Stale Task Check Results:"
echo "  Critical (72h+): $CRITICAL_COUNT"
echo "  Warning (48h+): $WARNING_COUNT"
echo "  Yellow (24h+): $YELLOW_COUNT"

# --- Alerting Logic ---
ALERT_MESSAGE=""
HAS_ALERTS=false

if [ "$CRITICAL_COUNT" -gt 0 ]; then
  ALERT_MESSAGE+="CRITICAL: $CRITICAL_COUNT stale tasks (72h+) found. Action needed: Escalate to Brendan. "
  HAS_ALERTS=true
fi
if [ "$WARNING_COUNT" -gt 0 ]; then
  ALERT_MESSAGE+="WARNING: $WARNING_COUNT stale tasks (48h+) found. Action needed: Notify Niles. "
  HAS_ALERTS=true
fi

if [ "$HAS_ALERTS" = true ]; then
  echo "ALERT TRIGGERED: $ALERT_MESSAGE"
  # --- Placeholder for actual alerting mechanism ---
  # This part would typically send a message via OpenClaw's message tool,
  # or an email/slack, etc. This is hard to do directly from here and needs integration.
  # For now, we'll log the alert.
  echo "Notification action would typically occur here."
  
  # Example of how it *might* work if integrated (requires specific session keys/targets)
  # curl -X POST "http://localhost:18789/api/message" \
  #   -H "Content-Type: application/json" \
  #   -d '{
  #     "action": "send",
  #     "to": "niles_session_key", 
  #     "message": "'"$ALERT_MESSAGE"'"
  #   }'
  # If critical, a separate alert might go to Brendan.
fi

echo "--- Daily Task Accountability Check Complete ---"
exit 0
