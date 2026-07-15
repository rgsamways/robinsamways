import re
import time

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from app.db import async_session
from app.models import ContactSubmission
from app.notify import send_email
from app.rate_limit import RateLimiter, _client_ip

router = APIRouter()

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
MIN_FILL_SECONDS = 2.0

_rate_limiter = RateLimiter(window_seconds=60.0, max_requests=5)


class ContactRequest(BaseModel):
    name: str
    email: str
    message: str
    honeypot: str = ""
    rendered_at: float


class ContactResponse(BaseModel):
    status: str


@router.post("/contact", response_model=ContactResponse, status_code=201)
async def submit_contact(payload: ContactRequest, request: Request) -> ContactResponse:
    ip = _client_ip(request)

    if _rate_limiter.is_rate_limited(ip):
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

    await send_email(
        subject=f"New contact form submission from {name}",
        text=f"Name: {name}\nEmail: {email}\n\n{message}",
        reply_to=email,
    )

    return ContactResponse(status="ok")
