#!/bin/bash
# Monthly Cost Audit - runs via cron and delivers report to Telegram

LOG_FILE="/data/.openclaw/workspace/.monthly-cost-audit.log"
TELEGRAM_CHAT_ID="8637899728"  # Brendan

echo "========================================" >> "$LOG_FILE"
echo "Monthly Cost Audit - $(date)" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

# Get cost data
COST_OUTPUT=$(openclaw gateway usage-cost 2>/dev/null)
CRON_OUTPUT=$(openclaw cron list 2>/dev/null)
AGENTS_OUTPUT=$(openclaw agents list 2>/dev/null)

# Build report
REPORT="📊 *Monthly Cost & System Audit*
$(date '+%B %Y')

—"

# Add cost info
if echo "$COST_OUTPUT" | grep -q "Total:"; then
  TOTAL=$(echo "$COST_OUTPUT" | grep "Total:" | awk '{print $2}')
  REPORT="${REPORT}
💰 *Total Spend:* ${TOTAL}
"
fi

REPORT="${REPORT}
📅 *Summary:*
• Review your spending patterns
• Check for any unusual activity
• Review agent usage

_Report generated automatically by Niles system_"

# Send to Telegram
echo "Sending report to Telegram..." >> "$LOG_FILE"
curl -s -X POST "https://api.telegram.org/bot$(cat /data/.openclaw/.telegram-bot-token 2>/dev/null)/sendMessage" \
  -d "chat_id=${TELEGRAM_CHAT_ID}" \
  -d "text=${REPORT}" \
  -d "parse_mode=Markdown" >> "$LOG_FILE" 2>&1

echo "Done at $(date)" >> "$LOG_FILE"