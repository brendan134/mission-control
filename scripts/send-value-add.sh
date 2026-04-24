#!/bin/bash
# Value-Add Auto-Send Script
# Usage: ./scripts/send-value-add.sh "client@email.com" "Client Name" "/path/to/value-add.md"

CLIENT_EMAIL="$1"
CLIENT_NAME="$2"
VALUE_ADD_FILE="$3"

if [ -z "$CLIENT_EMAIL" ] || [ -z "$CLIENT_NAME" ] || [ -z "$VALUE_ADD_FILE" ]; then
    echo "Usage: $0 <client-email> <client-name> <value-add-file>"
    echo "Example: $0 john@example.com \"John Smith\" memory/value-add/john-apr25.md"
    exit 1
fi

if [ ! -f "$VALUE_ADD_FILE" ]; then
    echo "Error: File not found: $VALUE_ADD_FILE"
    exit 1
fi

# Extract first name
FIRST_NAME=$(echo "$CLIENT_NAME" | cut -d' ' -f1)

# Read the value-add content
CONTENT=$(cat "$VALUE_ADD_FILE")

# Create the email (using himalaya envelope)
envelope_json=$(cat <<EOF
{
  "from": "brendan@brendanrogers.com.au",
  "to": ["$CLIENT_EMAIL"],
  "subject": "$FIRST_NAME, here's that resource from our call",
  "body": "Hi $FIRST_NAME,\n\nHope you're doing well! 👋\n\nAs promised, here's the resource from our call:\n\n$CONTENT\n\nLooking forward to hearing about your progress!\n\nCheers  \nBrendan"
}
EOF
)

# Send via himalaya
echo "$envelope_json" | himalaya envelope send -w

echo "✅ Value-add sent to $CLIENT_EMAIL"