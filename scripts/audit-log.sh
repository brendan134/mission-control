#!/bin/bash
# Audit Trail Logger
# Logs file creation events to daily memory
# Usage: ./audit-log.sh <action> <file_path> <description>

ACTION=$1
FILE_PATH=$2
DESCRIPTION=$3
TIMESTAMP=$(date "+%H:%M")

# Only run in production
if [ "$NODE_ENV" != "production" ]; then
    exit 0
fi

# Get today's daily log
TODAY=$(date "+%Y-%m-%d")
LOG_FILE="/data/.openclaw/workspace/obsidian/01-daily-logs/${TODAY}.md"

# Skip if no daily log exists yet
if [ ! -f "$LOG_FILE" ]; then
    exit 0
fi

# Log entry
ENTRY="### $TIMESTAMP - File Audit: $ACTION
- **File:** $FILE_PATH
- **Description:** $DESCRIPTION
- **Source:** ${SOURCE:-main-session}
"

# Append to daily log (using flock for safety)
(
    flock -x 200
    echo -e "\n$ENTRY" >> "$LOG_FILE"
) 200>/data/.openclaw/workspace/.audit-lock

echo "Audit logged: $ACTION $FILE_PATH"