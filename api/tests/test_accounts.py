from datetime import datetime, timedelta, timezone

import pytest
from sqlmodel import select

from app.accounts.service import AccountService
from app.accounts.session import create_session_token, verify_session_token
from app.db import async_session
from app.models import Account, SignInToken

# Real (if lightweight) SQLite persistence — this querying is the thing
# worth testing, same reasoning as pieces/farpost-atlas-geo's own suite.
pytestmark = pytest.mark.usefixtures("db_client")


async def test_request_sign_in_link_creates_account_and_pending_token():
    async with async_session() as session:
        await AccountService(session).request_sign_in_link("newsubscriber@example.com")

        account = (
            await session.exec(select(Account).where(Account.email == "newsubscriber@example.com"))
        ).first()
        assert account is not None

        token = (
            await session.exec(select(SignInToken).where(SignInToken.account_id == account.id))
        ).first()
        assert token is not None
        assert token.used_at is None


async def test_request_sign_in_link_reuses_existing_account():
    async with async_session() as session:
        service = AccountService(session)
        await service.request_sign_in_link("repeat@example.com")
        await service.request_sign_in_link("repeat@example.com")

        accounts = (
            await session.exec(select(Account).where(Account.email == "repeat@example.com"))
        ).all()
        assert len(accounts) == 1


async def test_verify_sign_in_link_succeeds_once_then_rejects_reuse():
    async with async_session() as session:
        service = AccountService(session)
        await service.request_sign_in_link("verify-once@example.com")

        account = (
            await session.exec(select(Account).where(Account.email == "verify-once@example.com"))
        ).first()
        token_row = (
            await session.exec(select(SignInToken).where(SignInToken.account_id == account.id))
        ).first()

        verified = await service.verify_sign_in_link(token_row.token)
        assert verified is not None
        assert verified.email == "verify-once@example.com"

        reused = await service.verify_sign_in_link(token_row.token)
        assert reused is None


async def test_verify_sign_in_link_rejects_an_expired_token():
    async with async_session() as session:
        account = Account(email="expired@example.com")
        session.add(account)
        await session.commit()
        await session.refresh(account)

        session.add(
            SignInToken(
                token="expired-token-value",
                account_id=account.id,
                expires_at=datetime.now(timezone.utc) - timedelta(minutes=1),
            )
        )
        await session.commit()

        result = await AccountService(session).verify_sign_in_link("expired-token-value")
        assert result is None


async def test_verify_sign_in_link_rejects_an_unknown_token():
    async with async_session() as session:
        result = await AccountService(session).verify_sign_in_link("this-token-does-not-exist")
        assert result is None


def test_session_token_round_trips():
    token = create_session_token(account_id=42)
    assert verify_session_token(token) == 42


def test_session_token_rejects_tampered_signature():
    token = create_session_token(account_id=42)
    payload_part, signature_part = token.split(".", 1)
    flipped_char = "A" if signature_part[0] != "A" else "B"
    tampered = f"{payload_part}.{flipped_char}{signature_part[1:]}"
    assert verify_session_token(tampered) is None


def test_session_token_rejects_garbage():
    assert verify_session_token("not-a-real-token") is None
