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
from app import salesforce


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
