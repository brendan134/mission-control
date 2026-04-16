#!/bin/bash
# Add Delete and Edit buttons to tasks page

TASKS_PAGE="/data/.openclaw/workspace/mission-*/src/APP/teams/page. T sx"

# Check if file exists
if [ ! -f "$TASKS_PAGE" ]; then
    echo "File not found at: $TASKS_PAGE"
    exit 1
fi

echo "Found tasks page at: $TASKS_PAGE"
echo "Adding Delete and Edit button functionality..."
