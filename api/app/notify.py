import logging
import os

import httpx

RESEND_API_URL = "https://api.resend.com/emails"
NOTIFY_FROM_EMAIL = "Robin Samways Site <contact@mail.robinsamways.ca>"
NOTIFY_TO_EMAIL = "rgsamways@gmail.com"


async def send_email(subject: str, text: str, reply_to: str | None = None) -> None:
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        logging.warning("RESEND_API_KEY not set; skipping notification email: %s", subject)
        return
    try:
        payload = {
            "from": NOTIFY_FROM_EMAIL,
            "to": [NOTIFY_TO_EMAIL],
            "subject": subject,
            "text": text,
        }
        if reply_to:
            payload["reply_to"] = reply_to
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                RESEND_API_URL,
                headers={"Authorization": f"Bearer {api_key}"},
                json=payload,
            )
            response.raise_for_status()
    except Exception:
        logging.exception("Failed to send notification email via Resend: %s", subject)
