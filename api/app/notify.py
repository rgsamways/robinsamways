import logging
import os

import httpx

RESEND_API_URL = "https://api.resend.com/emails"
NOTIFY_FROM_EMAIL = "Robin Samways Site <contact@mail.robinsamways.ca>"
NOTIFY_TO_EMAIL = "rgsamways@gmail.com"


async def send_email(subject: str, text: str, reply_to: str | None = None) -> None:
    await _send(to_email=NOTIFY_TO_EMAIL, subject=subject, text=text, reply_to=reply_to)


async def send_transactional_email(to_email: str, subject: str, text: str) -> None:
    """Like `send_email`, but to an arbitrary visitor address rather than
    Robin's own inbox — the account-auth magic-link send is the first caller.
    Same Resend API, same `NOTIFY_FROM_EMAIL`, just a different recipient."""
    await _send(to_email=to_email, subject=subject, text=text, reply_to=None)


async def _send(to_email: str, subject: str, text: str, reply_to: str | None) -> None:
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        logging.warning("RESEND_API_KEY not set; skipping email to %s: %s", to_email, subject)
        return
    try:
        payload = {
            "from": NOTIFY_FROM_EMAIL,
            "to": [to_email],
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
        logging.exception("Failed to send email to %s via Resend: %s", to_email, subject)
