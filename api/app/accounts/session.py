"""Stateless, signed session tokens — task 1.4's "session handling" half of
account-auth. No session table: a token is `<payload>.<signature>`, both
base64url-encoded, HMAC-signed with SESSION_SECRET. Verifying just re-derives
the signature and checks expiry, so any request can be authenticated without
a database round trip.
"""

import base64
import hashlib
import hmac
import json
import logging
import os
import time

from fastapi import HTTPException, Request

SESSION_TTL_SECONDS = 30 * 24 * 60 * 60  # 30 days
_FALLBACK_SECRET = "insecure-dev-session-secret-do-not-use-in-production"


def _secret() -> bytes:
    secret = os.environ.get("SESSION_SECRET")
    if not secret:
        logging.warning("SESSION_SECRET not set; using an insecure development fallback")
        secret = _FALLBACK_SECRET
    return secret.encode("utf-8")


def _sign(payload_bytes: bytes) -> bytes:
    return hmac.new(_secret(), payload_bytes, hashlib.sha256).digest()


def create_session_token(account_id: int) -> str:
    payload_bytes = json.dumps(
        {"account_id": account_id, "expires_at": time.time() + SESSION_TTL_SECONDS}
    ).encode("utf-8")
    signature = _sign(payload_bytes)
    return (
        base64.urlsafe_b64encode(payload_bytes).decode("ascii")
        + "."
        + base64.urlsafe_b64encode(signature).decode("ascii")
    )


def verify_session_token(token: str) -> int | None:
    try:
        payload_part, signature_part = token.split(".", 1)
        payload_bytes = base64.urlsafe_b64decode(payload_part)
        signature = base64.urlsafe_b64decode(signature_part)
    except (ValueError, TypeError, base64.binascii.Error):
        return None

    if not hmac.compare_digest(signature, _sign(payload_bytes)):
        return None

    try:
        payload = json.loads(payload_bytes)
        account_id = int(payload["account_id"])
        expires_at = float(payload["expires_at"])
    except (ValueError, KeyError, TypeError):
        return None

    if expires_at < time.time():
        return None
    return account_id


def get_current_account_id(request: Request) -> int:
    """FastAPI dependency: extracts and verifies the `Authorization: Bearer
    <session_token>` header. Raises 401 if missing, malformed, or expired."""
    auth_header = request.headers.get("authorization", "")
    if not auth_header.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Not signed in")

    account_id = verify_session_token(auth_header[len("bearer "):].strip())
    if account_id is None:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    return account_id
