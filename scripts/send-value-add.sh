#!/bin/bash
# Value-Add Auto-Send Script (Python-based)
# Usage: ./scripts/send-value-add.sh "client@email.com" "Client Name" "value-add content"

CLIENT_EMAIL="$1"
CLIENT_NAME="$2"
VALUE_ADD_CONTENT="$3"

if [ -z "$CLIENT_EMAIL" ] || [ -z "$CLIENT_NAME" ] ]; then
    echo "Usage: $0 <client-email> <client-name> [value-add-content]"
    echo "Example: $0 john@example.com \"John Smith\" \"Here's your checklist...\""
    exit 1
fi

# Extract first name
FIRST_NAME=$(echo "$CLIENT_NAME" | cut -d' ' -f1)

# Build the email
SUBJECT="$FIRST_NAME, here's that resource from our call"
BODY="Hi $FIRST_NAME,

Hope you're doing well! 👋

As promised, here's the resource from our call:

$VALUE_ADD_CONTENT

Looking forward to hearing about your progress!

Cheers  
Brendan"

# Send via Python
python3 - << PYEOF
import smtplib
from email.mime.text import MIMEText

msg = MIMEText('$BODY', 'plain')
msg['Subject'] = '$SUBJECT'
msg['From'] = 'brendan@brendanrogers.com.au'
msg['To'] = '$CLIENT_EMAIL'

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('brendan@brendanrogers.com.au', 'vmcc rpxy iwzs hzkj')
server.sendmail('brendan@brendanrogers.com.au', '$CLIENT_EMAIL', msg.as_string())
server.quit()
print('✅ Sent to $CLIENT_EMAIL')
PYEOF

echo "✅ Value-add sent to $CLIENT_EMAIL"