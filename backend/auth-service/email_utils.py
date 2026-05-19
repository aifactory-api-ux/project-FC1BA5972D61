import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os


def send_password_reset_email(email: str, token: str):
    smtp_host = os.getenv("AUTH_SMTP_HOST", "smtp.mailtrap.io")
    smtp_port = int(os.getenv("AUTH_SMTP_PORT", "2525"))
    smtp_user = os.getenv("AUTH_SMTP_USER", "smtp_user")
    smtp_password = os.getenv("AUTH_SMTP_PASSWORD", "smtp_password")
    from_email = os.getenv("AUTH_EMAIL_FROM", "noreply@myapp.com")
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

    reset_link = f"{frontend_url}/reset-password?token={token}"

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = email
    msg['Subject'] = "Password Reset Request"

    body = f"""
    <html>
    <body>
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="{reset_link}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
    </body>
    </html>
    """

    msg.attach(MIMEText(body, 'html'))

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
    except Exception as e:
        print(f"Failed to send email: {e}")