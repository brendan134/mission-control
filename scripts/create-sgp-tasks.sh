#!/bin/bash
# Strategic Growth Plan Task Automation
# Usage: ./scripts/create-sgp-tasks.sh "Client Name" /path/to/plan.md

set -e

CLIENT_NAME="$1"
FILE_PATH="$2"
STRATEGIC_PRIORITY_ID="${3:-}"
API_URL="http://localhost:3003/api"

if [ -z "$CLIENT_NAME" ] || [ -z "$FILE_PATH" ]; then
    echo "Usage: $0 \"Client Name\" /path/to/plan.md [strategic_priority_id]"
    echo ""
    echo "Example: $0 \"Akhil Rodrigues\" content/akhil-rodrigues-strategic-growth-plan.md"
    exit 1
fi

if [ ! -f "$FILE_PATH" ]; then
    echo "Error: File not found: $FILE_PATH"
    exit 1
fi

echo "Creating Strategic Growth Plan tasks for: $CLIENT_NAME"
echo "Using file: $FILE_PATH"
echo ""

# Get Strategic Growth Plans project ID
PROJECT_ID=$(curl -s "$API_URL/projects" | python3 -c "
import sys, json
projects = json.load(sys.stdin)
for p in projects:
    if 'Strategic Growth' in p.get('name', ''):
        print(p['id'])
        break
")

if [ -z "$PROJECT_ID" ]; then
    echo "Error: Could not find 'Strategic Growth Plans' project"
    exit 1
fi

echo "Using project: $PROJECT_ID"
echo ""

# Extract phase titles from markdown file
PHASE1=$(grep -A2 "^### Phase 1" "$FILE_PATH" | head -1 | sed 's/^### Phase 1: //' | tr -d '*' | xargs)
PHASE2=$(grep -A2 "^### Phase 2" "$FILE_PATH" | head -1 | sed 's/^### Phase 2: //' | tr -d '*' | xargs)
PHASE3=$(grep -A2 "^### Phase 3" "$FILE_PATH" | head -1 | sed 's/^### Phase 3: //' | tr -d '*' | xargs)

# Fallback if not found
PHASE1="${PHASE1:-Phase 1: Foundation}"
PHASE2="${PHASE2:-Phase 2: System Building}"
PHASE3="${PHASE3:-Phase 3: Multiplication}"

echo "Detected phases:"
echo "  1. $PHASE1"
echo "  2. $PHASE2"
echo "  3. $PHASE3"
echo ""

# Create Task 1: Create designed plan
echo "Creating Task 1: Create designed plan..."
TASK1=$(curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Create designed plan - $CLIENT_NAME\",
    \"description\": \"Design the Strategic Growth Plan document based on coaching transcript\",
    \"project_id\": \"$PROJECT_ID\",
    \"priority\": \"High\",
    \"task_type\": \"Client Delivery\",
    \"stage\": \"Capture\",
    \"primary_owner_id\": \"Dom\",
    \"client_name\": \"$CLIENT_NAME\",
    \"next_action\": \"Review coaching transcript and create plan\",
    \"status\": \"Active\",
    \"blocked\": false,
    \"created_by\": \"Brendan\",
    \"primary_owner_type\": \"PH Team\"
  }")
echo "  → Created"

# Create Task 2: Review & Approve
echo "Creating Task 2: Review & Approve..."
TASK2=$(curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Review & Approve - $CLIENT_NAME\",
    \"description\": \"Review the designed Strategic Growth Plan and approve for client delivery\",
    \"project_id\": \"$PROJECT_ID\",
    \"priority\": \"High\",
    \"task_type\": \"Client Delivery\",
    \"stage\": \"Define\",
    \"primary_owner_id\": \"Brendan\",
    \"client_name\": \"$CLIENT_NAME\",
    \"next_action\": \"Review plan, provide feedback or approve\",
    \"status\": \"Active\",
    \"blocked\": false,
    \"created_by\": \"Brendan\",
    \"primary_owner_type\": \"Brendan\"
  }")
echo "  → Created"

# Create Task 3: Send to Client
echo "Creating Task 3: Send to Client..."
TASK3=$(curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Send to Client - $CLIENT_NAME\",
    \"description\": \"Send the approved Strategic Growth Plan to the client\",
    \"project_id\": \"$PROJECT_ID\",
    \"priority\": \"High\",
    \"task_type\": \"Client Delivery\",
    \"stage\": \"Define\",
    \"primary_owner_id\": \"Brendan\",
    \"client_name\": \"$CLIENT_NAME\",
    \"next_action\": \"Email plan to client\",
    \"status\": \"Active\",
    \"blocked\": false,
    \"created_by\": \"Brendan\",
    \"primary_owner_type\": \"Brendan\"
  }")
echo "  → Created"

# Create Task 4: Phase 1
echo "Creating Task 4: Phase 1..."
TASK4=$(curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"$PHASE1 - $CLIENT_NAME\",
    \"description\": \"First 30-day phase of the Strategic Growth Plan\",
    \"project_id\": \"$PROJECT_ID\",
    \"priority\": \"High\",
    \"task_type\": \"Client Delivery\",
    \"stage\": \"In Progress\",
    \"primary_owner_id\": \"Brendan\",
    \"client_name\": \"$CLIENT_NAME\",
    \"next_action\": \"Begin Phase 1 work\",
    \"status\": \"Active\",
    \"blocked\": false,
    \"created_by\": \"Brendan\",
    \"primary_owner_type\": \"Brendan\",
    \"due_date\": \"$(date -d '+30 days' +%Y-%m-%d)\"
  }")
echo "  → Created"

# Create Task 5: Phase 2
echo "Creating Task 5: Phase 2..."
TASK5=$(curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"$PHASE2 - $CLIENT_NAME\",
    \"description\": \"Second 30-day phase of the Strategic Growth Plan\",
    \"project_id\": \"$PROJECT_ID\",
    \"priority\": \"Medium\",
    \"task_type\": \"Client Delivery\",
    \"stage\": \"Define\",
    \"primary_owner_id\": \"Brendan\",
    \"client_name\": \"$CLIENT_NAME\",
    \"next_action\": \"Begin Phase 2 work\",
    \"status\": \"Active\",
    \"blocked\": false,
    \"created_by\": \"Brendan\",
    \"primary_owner_type\": \"Brendan\",
    \"due_date\": \"$(date -d '+60 days' +%Y-%m-%d)\"
  }")
echo "  → Created"

# Create Task 6: Phase 3
echo "Creating Task 6: Phase 3..."
TASK6=$(curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"$PHASE3 - $CLIENT_NAME\",
    \"description\": \"Final 30-day phase of the Strategic Growth Plan\",
    \"project_id\": \"$PROJECT_ID\",
    \"priority\": \"Medium\",
    \"task_type\": \"Client Delivery\",
    \"stage\": \"Define\",
    \"primary_owner_id\": \"Brendan\",
    \"client_name\": \"$CLIENT_NAME\",
    \"next_action\": \"Begin Phase 3 work\",
    \"status\": \"Active\",
    \"blocked\": false,
    \"created_by\": \"Brendan\",
    \"primary_owner_type\": \"Brendan\",
    \"due_date\": \"$(date -d '+90 days' +%Y-%m-%d)\"
  }")
echo "  → Created"

echo ""
echo "✅ All 6 tasks created successfully for $CLIENT_NAME"