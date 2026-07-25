import re

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from app.accounts.service import AccountService
from app.accounts.session import create_session_token
from app.db import async_session
from app.rate_limit import RateLimiter, _client_ip

router = APIRouter()

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

_rate_limiter = RateLimiter(window_seconds=60.0, max_requests=5)


class SignInRequest(BaseModel):
    email: str


class SignInResponse(BaseModel):
    status: str


class VerifyRequest(BaseModel):
    token: str


class VerifyResponse(BaseModel):
    status: str
    session_token: str
    email: str


@router.post("/accounts/sign-in", response_model=SignInResponse, status_code=201)
async def request_sign_in(payload: SignInRequest, request: Request) -> SignInResponse:
    ip = _client_ip(request)
    if _rate_limiter.is_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many requests")

    email = payload.email.strip().lower()
    if not email or not EMAIL_RE.match(email):
        raise HTTPException(status_code=422, detail="Invalid email")

    async with async_session() as session:
        await AccountService(session).request_sign_in_link(email)

    return SignInResponse(status="ok")


@router.post("/accounts/verify", response_model=VerifyResponse)
async def verify_sign_in(payload: VerifyRequest) -> VerifyResponse:
    async with async_session() as session:
        account = await AccountService(session).verify_sign_in_link(payload.token)

    if account is None:
        raise HTTPException(status_code=401, detail="Invalid or expired sign-in link")

    return VerifyResponse(
        status="ok", session_token=create_session_token(account.id), email=account.email
    )
