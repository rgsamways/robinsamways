import logging
import os
import re
import time
from collections import defaultdict

import httpx
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from app.db import async_session
from app.models import ContactSubmission

router = APIRouter()

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
MIN_FILL_SECONDS = 2.0
RATE_LIMIT_WINDOW_SECONDS = 60.0
RATE_LIMIT_MAX_REQUESTS = 5

RESEND_API_URL = "https://api.resend.com/emails"
CONTACT_FROM_EMAIL = "Robin Samways Site <contact@mail.robinsamways.ca>"
CONTACT_TO_EMAIL = "rgsamways@gmail.com"

_rate_limit_hits: dict[str, list[float]] = defaultdict(list)


class ContactRequest(BaseModel):
    name: str
    email: str
    message: str
    honeypot: str = ""
    rendered_at: float


class ContactResponse(BaseModel):
    status: str


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _is_rate_limited(ip: str) -> bool:
    now = time.monotonic()
    hits = _rate_limit_hits[ip]
    cutoff = now - RATE_LIMIT_WINDOW_SECONDS
    while hits and hits[0] < cutoff:
        hits.pop(0)
    if len(hits) >= RATE_LIMIT_MAX_REQUESTS:
        return True
    hits.append(now)
    return False


async def _send_notification_email(name: str, email: str, message: str) -> None:
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        logging.warning("RESEND_API_KEY not set; skipping contact notification email")
        return
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                RESEND_API_URL,
                headers={"Authorization": f"Bearer {api_key}"},
                json={
                    "from": CONTACT_FROM_EMAIL,
                    "to": [CONTACT_TO_EMAIL],
                    "reply_to": email,
                    "subject": f"New contact form submission from {name}",
                    "text": f"Name: {name}\nEmail: {email}\n\n{message}",
                },
            )
            response.raise_for_status()
    except Exception:
        logging.exception("Failed to send contact notification email via Resend")


@router.post("/contact", response_model=ContactResponse, status_code=201)
async def submit_contact(payload: ContactRequest, request: Request) -> ContactResponse:
    ip = _client_ip(request)

    if _is_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many requests")

    elapsed = time.time() - payload.rendered_at
    if payload.honeypot.strip() or elapsed < MIN_FILL_SECONDS:
        return ContactResponse(status="ok")

    name = payload.name.strip()
    email = payload.email.strip()
    message = payload.message.strip()

    if not name or not email or not message or not EMAIL_RE.match(email):
        raise HTTPException(status_code=422, detail="Invalid submission")

    async with async_session() as session:
        submission = ContactSubmission(name=name, email=email, message=message, ip_address=ip)
        session.add(submission)
        await session.commit()

    await _send_notification_email(name, email, message)

    return ContactResponse(status="ok")
