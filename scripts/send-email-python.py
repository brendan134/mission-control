#!/usr/bin/env python3
"""Send value-add email via SMTP"""
import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to_email, subject, body, smtp_user, smtp_pass):
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = to_email
    msg['Subject'] = subject
    
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: send-email.py <to_email> <subject> <body>")
        sys.exit(1)
    
    to_email = sys.argv[1]
    subject = sys.argv[2]
    body = sys.argv[3]
    
    # These would come from environment or config
    smtp_user = "brendan@brendanrogers.com.au"
    smtp_pass = "vmcc rpxy iwzs hzkj"
    
    success = send_email(to_email, subject, body, smtp_user, smtp_pass)
    sys.exit(0 if success else 1)