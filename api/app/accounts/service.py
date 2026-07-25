import os
import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models import Account, SignInToken, _as_utc
from app.notify import send_transactional_email

SIGN_IN_TOKEN_TTL = timedelta(minutes=15)
SIGN_IN_BASE_URL = os.environ.get("SIGN_IN_BASE_URL", "https://robinsamways.ca")


class AccountService:
    """Passwordless sign-in: request a link, follow it, get a session.
    Mirrors D1/D2 in services-payments/design.md."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_or_create_account(self, email: str) -> Account:
        result = await self.session.exec(select(Account).where(Account.email == email))
        account = result.first()
        if account is not None:
            return account

        account = Account(email=email)
        self.session.add(account)
        await self.session.commit()
        await self.session.refresh(account)
        return account

    async def request_sign_in_link(self, email: str) -> None:
        account = await self.get_or_create_account(email)

        token = secrets.token_urlsafe(32)
        self.session.add(
            SignInToken(
                token=token,
                account_id=account.id,
                expires_at=datetime.now(timezone.utc) + SIGN_IN_TOKEN_TTL,
            )
        )
        await self.session.commit()

        link = f"{SIGN_IN_BASE_URL}/sign-in/verify?token={token}"
        await send_transactional_email(
            to_email=email,
            subject="Your sign-in link for robinsamways.ca",
            text=(
                f"Click to sign in: {link}\n\n"
                "This link expires in 15 minutes and can only be used once. "
                "If you didn't request this, you can ignore this email."
            ),
        )

    async def verify_sign_in_link(self, token: str) -> Account | None:
        result = await self.session.exec(select(SignInToken).where(SignInToken.token == token))
        sign_in_token = result.first()
        now = datetime.now(timezone.utc)

        if sign_in_token is None or sign_in_token.used_at is not None:
            return None
        if _as_utc(sign_in_token.expires_at) < now:
            return None

        sign_in_token.used_at = now
        self.session.add(sign_in_token)
        await self.session.commit()

        result = await self.session.exec(select(Account).where(Account.id == sign_in_token.account_id))
        return result.first()
