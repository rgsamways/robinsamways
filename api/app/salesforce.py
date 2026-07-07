import logging
import os
import time
from collections import defaultdict

import httpx
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

SALESFORCE_DOMAIN = os.environ.get("SALESFORCE_DOMAIN", "")
SALESFORCE_CLIENT_ID = os.environ.get("SALESFORCE_CLIENT_ID", "")
SALESFORCE_CLIENT_SECRET = os.environ.get("SALESFORCE_CLIENT_SECRET", "")

API_VERSION = "v61.0"

# Salesforce's client-credentials token response has no expires_in field — session
# length is controlled by org Session Settings, not returned to the caller. Assume a
# conservative TTL for proactive refresh, backed by a reactive 401-retry in _request()
# for whenever the assumption is wrong in either direction.
TOKEN_ASSUMED_TTL_SECONDS = 15 * 60
TOKEN_EXPIRY_BUFFER_SECONDS = 60

LOAN_APPLICATION_FIELDS = (
    "Id, Applicant__r.Name, Account__r.Name, Amount_Requested__c, "
    "Status__c, Submitted_Date__c, Decision_Date__c"
)

MIN_FILL_SECONDS = 2.0
RATE_LIMIT_WINDOW_SECONDS = 60.0
RATE_LIMIT_MAX_REQUESTS = 5

router = APIRouter()

_token_cache: dict = {}
_rate_limit_hits: dict[str, list[float]] = defaultdict(list)


class SalesforceAuthError(Exception):
    """Raised when a Salesforce OAuth token request fails."""


class SalesforceAPIError(Exception):
    """Raised when a Salesforce REST API call fails."""


class SalesforceLookupError(Exception):
    """Raised when a referenced Applicant/Account name can't be resolved."""


def _soql_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'")


async def _fetch_token() -> dict:
    token_url = f"https://{SALESFORCE_DOMAIN}/services/oauth2/token"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                token_url,
                data={
                    "grant_type": "client_credentials",
                    "client_id": SALESFORCE_CLIENT_ID,
                    "client_secret": SALESFORCE_CLIENT_SECRET,
                },
            )
    except httpx.RequestError as exc:
        logging.error("Salesforce token request errored: %s", exc)
        raise SalesforceAuthError("Salesforce token request errored") from exc
    if response.status_code != 200:
        logging.error("Salesforce token request failed: %s %s", response.status_code, response.text)
        raise SalesforceAuthError("Salesforce token request failed")
    return response.json()


async def _get_token(force_refresh: bool = False) -> tuple[str, str]:
    now = time.monotonic()
    if not force_refresh and _token_cache.get("access_token") and _token_cache.get("expires_at", 0) > now:
        return _token_cache["access_token"], _token_cache["instance_url"]

    data = await _fetch_token()
    access_token = data["access_token"]
    instance_url = data["instance_url"]
    _token_cache.update(
        {
            "access_token": access_token,
            "instance_url": instance_url,
            "expires_at": now + TOKEN_ASSUMED_TTL_SECONDS - TOKEN_EXPIRY_BUFFER_SECONDS,
        }
    )
    return access_token, instance_url


async def _request(method: str, path: str, **kwargs) -> httpx.Response:
    access_token, instance_url = await _get_token()

    async def _do(token: str, base: str) -> httpx.Response:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                return await client.request(
                    method, f"{base}{path}", headers={"Authorization": f"Bearer {token}"}, **kwargs
                )
        except httpx.RequestError as exc:
            logging.error("Salesforce API request errored: %s", exc)
            raise SalesforceAPIError("Salesforce API request errored") from exc

    response = await _do(access_token, instance_url)
    if response.status_code == 401:
        # Cached token was rejected (expired/revoked) — refetch once and retry.
        access_token, instance_url = await _get_token(force_refresh=True)
        response = await _do(access_token, instance_url)

    return response


async def list_loan_applications() -> list[dict]:
    soql = (
        f"SELECT {LOAN_APPLICATION_FIELDS} FROM Loan_Application__c "
        "ORDER BY CreatedDate DESC LIMIT 50"
    )
    response = await _request("GET", f"/services/data/{API_VERSION}/query", params={"q": soql})
    if response.status_code != 200:
        logging.error("Salesforce query failed: %s %s", response.status_code, response.text)
        raise SalesforceAPIError("Salesforce query failed")
    return response.json().get("records", [])


async def _find_id_by_name(sobject: str, name: str) -> str:
    soql = f"SELECT Id FROM {sobject} WHERE Name = '{_soql_escape(name)}' LIMIT 1"
    response = await _request("GET", f"/services/data/{API_VERSION}/query", params={"q": soql})
    if response.status_code != 200:
        logging.error("Salesforce lookup failed: %s %s", response.status_code, response.text)
        raise SalesforceAPIError("Salesforce lookup failed")
    records = response.json().get("records", [])
    if not records:
        raise SalesforceLookupError(f"No {sobject} found named {name!r}")
    return records[0]["Id"]


async def create_loan_application(applicant_name: str, account_name: str, amount_requested: float) -> str:
    applicant_id = await _find_id_by_name("Contact", applicant_name)
    account_id = await _find_id_by_name("Account", account_name)

    payload = {
        "Applicant__c": applicant_id,
        "Account__c": account_id,
        "Amount_Requested__c": amount_requested,
        "Status__c": "Draft",
    }
    response = await _request(
        "POST", f"/services/data/{API_VERSION}/sobjects/Loan_Application__c", json=payload
    )
    if response.status_code != 201:
        logging.error("Salesforce create failed: %s %s", response.status_code, response.text)
        raise SalesforceAPIError("Salesforce create failed")
    return response.json()["id"]


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


class LoanApplicationOut(BaseModel):
    id: str
    applicant_name: str | None = None
    account_name: str | None = None
    amount_requested: float | None = None
    status: str | None = None
    submitted_date: str | None = None
    decision_date: str | None = None


class LoanApplicationCreateRequest(BaseModel):
    applicant_name: str
    account_name: str
    amount_requested: float
    honeypot: str = ""
    rendered_at: float


class LoanApplicationCreateResponse(BaseModel):
    status: str
    id: str | None = None


@router.get("/salesforce/loan-applications", response_model=list[LoanApplicationOut])
async def get_loan_applications() -> list[LoanApplicationOut]:
    try:
        records = await list_loan_applications()
    except (SalesforceAuthError, SalesforceAPIError):
        raise HTTPException(status_code=502, detail="Unable to reach Salesforce right now")

    return [
        LoanApplicationOut(
            id=record["Id"],
            applicant_name=(record.get("Applicant__r") or {}).get("Name"),
            account_name=(record.get("Account__r") or {}).get("Name"),
            amount_requested=record.get("Amount_Requested__c"),
            status=record.get("Status__c"),
            submitted_date=record.get("Submitted_Date__c"),
            decision_date=record.get("Decision_Date__c"),
        )
        for record in records
    ]


@router.post(
    "/salesforce/loan-applications", response_model=LoanApplicationCreateResponse, status_code=201
)
async def post_loan_application(
    payload: LoanApplicationCreateRequest, request: Request
) -> LoanApplicationCreateResponse:
    ip = _client_ip(request)

    if _is_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many requests")

    elapsed = time.time() - payload.rendered_at
    if payload.honeypot.strip() or elapsed < MIN_FILL_SECONDS:
        return LoanApplicationCreateResponse(status="ok")

    applicant_name = payload.applicant_name.strip()
    account_name = payload.account_name.strip()

    if not applicant_name or not account_name or payload.amount_requested <= 0:
        raise HTTPException(status_code=422, detail="Invalid submission")

    try:
        record_id = await create_loan_application(applicant_name, account_name, payload.amount_requested)
    except SalesforceLookupError:
        raise HTTPException(status_code=422, detail="Unknown applicant or account")
    except (SalesforceAuthError, SalesforceAPIError):
        raise HTTPException(status_code=502, detail="Unable to reach Salesforce right now")

    return LoanApplicationCreateResponse(status="ok", id=record_id)
