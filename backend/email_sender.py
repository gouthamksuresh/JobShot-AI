import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

GMAIL_USER = os.getenv("GMAIL_USER")       # your gmail
GMAIL_PASS = os.getenv("GMAIL_APP_PASS")   # gmail app password (not regular password)

def send_email(to: str, subject: str, body: str, resume_path: str = None) -> bool:
    """Send application email with resume PDF attached"""
    try:
        msg = MIMEMultipart()
        msg["From"] = GMAIL_USER
        msg["To"] = to
        msg["Subject"] = subject

        msg.attach(MIMEText(body, "plain"))

        # Attach resume PDF if exists
        if resume_path and os.path.exists(resume_path):
            with open(resume_path, "rb") as f:
                pdf = MIMEApplication(f.read(), _subtype="pdf")
                pdf.add_header("Content-Disposition", "attachment",
                               filename="Goutham_K_Suresh_Resume.pdf")
                msg.attach(pdf)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_USER, GMAIL_PASS)
            server.sendmail(GMAIL_USER, to, msg.as_string())

        return True

    except Exception as e:
        print(f"Email error: {e}")
        return False
