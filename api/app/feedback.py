import time
from typing import Literal

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from app.db import async_session
from app.models import FeedbackSubmission
from app.notify import send_email
from app.rate_limit import RateLimiter, _client_ip

router = APIRouter()

MIN_FILL_SECONDS = 2.0

_rate_limiter = RateLimiter(window_seconds=60.0, max_requests=5)


class FeedbackRequest(BaseModel):
    page: str
    sentiment: Literal["positive", "negative"] | None = None
    comment: str | None = Field(default=None, max_length=2000)
    honeypot: str = ""
    rendered_at: float


class FeedbackResponse(BaseModel):
    status: str


@router.post("/feedback", response_model=FeedbackResponse, status_code=201)
async def submit_feedback(payload: FeedbackRequest, request: Request) -> FeedbackResponse:
    ip = _client_ip(request)

    if _rate_limiter.is_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many requests")

    elapsed = time.time() - payload.rendered_at
    if payload.honeypot.strip() or elapsed < MIN_FILL_SECONDS:
        return FeedbackResponse(status="ok")

    page = payload.page.strip()
    comment = payload.comment.strip() if payload.comment else None
    sentiment = payload.sentiment

    if not page or (not sentiment and not comment):
        raise HTTPException(status_code=422, detail="Invalid submission")

    async with async_session() as session:
        submission = FeedbackSubmission(page=page, sentiment=sentiment, comment=comment, ip_address=ip)
        session.add(submission)
        await session.commit()

    lines = [f"Page: {page}"]
    if sentiment:
        lines.append(f"Sentiment: {sentiment}")
    if comment:
        lines.append("")
        lines.append(comment)

    await send_email(subject=f"New feedback on {page}", text="\n".join(lines))

    return FeedbackResponse(status="ok")
