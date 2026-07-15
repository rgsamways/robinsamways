import os

# Set before any `app.*` import: app.db reads DATABASE_URL at import time
# (os.environ["DATABASE_URL"]) and would raise KeyError otherwise. The value
# is never actually connected to in tests — TestClient is used outside a
# `with` block, so FastAPI's lifespan (and its real init_db() call) never
# fires. See tests/test_loan_applications.py for why that matters.
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://test:test@localhost:5432/test")

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app import contact, feedback, salesforce


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture(autouse=True)
def _reset_salesforce_module_state():
    """`_token_cache` and `_rate_limit_hits` are module-level dicts shared
    across requests in the real app (by design, for the token cache) — reset
    them between tests so one test's rate-limit hits or cached token don't
    leak into the next."""
    salesforce._token_cache.clear()
    salesforce._rate_limit_hits.clear()
    yield
    salesforce._token_cache.clear()
    salesforce._rate_limit_hits.clear()


@pytest.fixture(autouse=True)
def _reset_rate_limiter_module_state():
    """`contact._rate_limiter` and `feedback._rate_limiter` are module-level
    singletons shared across requests in the real app — reset them between
    tests so one test's hits don't leak into the next, same reasoning as the
    salesforce fixture above."""
    contact._rate_limiter.reset()
    feedback._rate_limiter.reset()
    yield
    contact._rate_limiter.reset()
    feedback._rate_limiter.reset()


class _FakeAsyncSession:
    def __init__(self, saved: list):
        self._saved = saved

    def add(self, obj) -> None:
        self._saved.append(obj)

    async def commit(self) -> None:
        pass

    async def __aenter__(self) -> "_FakeAsyncSession":
        return self

    async def __aexit__(self, exc_type, exc, tb) -> bool:
        return False


@pytest.fixture(autouse=True)
def fake_db_session(monkeypatch) -> list:
    """`/contact` and `/feedback` both call `async_session()` directly (not
    via FastAPI dependency injection) to persist a submission. Per
    docs/testing.md, this suite is deliberately runnable without a live
    database, local or otherwise -- so the session factory itself is faked
    here, the same "monkeypatch the shared client, test the real logic"
    pattern already used for Salesforce's `_request`. Returns the list every
    faked session's `add()` calls land in, so a test can assert on exactly
    what would have been persisted."""
    saved: list = []

    def _factory():
        return _FakeAsyncSession(saved)

    monkeypatch.setattr(contact, "async_session", _factory)
    monkeypatch.setattr(feedback, "async_session", _factory)
    return saved
