import logging
import os
import re
import time
from collections import defaultdict
from datetime import date

import httpx
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from app.ai import AnthropicAPIError, get_recommendation

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

# Same shape as LOAN_APPLICATION_FIELDS plus the raw Account__c id, needed to
# group applications by Account rather than just display the Account name.
ACCOUNT_GROUPED_FIELDS = (
    "Id, Applicant__r.Name, Account__c, Account__r.Name, Amount_Requested__c, "
    "Status__c, Submitted_Date__c, Decision_Date__c"
)

# Custom-object field history tracking objects are named by replacing the
# trailing "__c" with "__History".
LOAN_APPLICATION_HISTORY_OBJECT = "Loan_Application__History"

# Archived is a real Status__c value (used for the original seed records) but is
# deliberately unreachable through any writable control — it's set only by editing
# Salesforce directly. Never include it here.
SETTABLE_STATUSES = ("Draft", "Submitted", "Under Review", "Approved", "Denied")

RECORD_ID_RE = re.compile(r"^[a-zA-Z0-9]{15,18}$")

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


async def list_loan_applications_by_account() -> list[dict]:
    soql = (
        f"SELECT {ACCOUNT_GROUPED_FIELDS} FROM Loan_Application__c "
        "ORDER BY Account__r.Name, CreatedDate DESC LIMIT 200"
    )
    response = await _request("GET", f"/services/data/{API_VERSION}/query", params={"q": soql})
    if response.status_code != 200:
        logging.error("Salesforce query failed: %s %s", response.status_code, response.text)
        raise SalesforceAPIError("Salesforce query failed")
    return response.json().get("records", [])


async def get_status_history(record_id: str) -> list[dict]:
    soql = (
        "SELECT OldValue, NewValue, CreatedDate "
        f"FROM {LOAN_APPLICATION_HISTORY_OBJECT} "
        f"WHERE ParentId = '{_soql_escape(record_id)}' AND Field = 'Status__c' "
        "ORDER BY CreatedDate ASC"
    )
    response = await _request("GET", f"/services/data/{API_VERSION}/query", params={"q": soql})
    if response.status_code != 200:
        logging.error("Salesforce history query failed: %s %s", response.status_code, response.text)
        raise SalesforceAPIError("Salesforce history query failed")
    return response.json().get("records", [])


async def get_status_and_submitted(record_id: str) -> tuple[str | None, str | None] | None:
    soql = (
        "SELECT Status__c, Submitted_Date__c FROM Loan_Application__c "
        f"WHERE Id = '{_soql_escape(record_id)}' LIMIT 1"
    )
    response = await _request("GET", f"/services/data/{API_VERSION}/query", params={"q": soql})
    if response.status_code != 200:
        logging.error("Salesforce lookup failed: %s %s", response.status_code, response.text)
        raise SalesforceAPIError("Salesforce lookup failed")
    records = response.json().get("records", [])
    if not records:
        return None
    return records[0].get("Status__c"), records[0].get("Submitted_Date__c")


async def _create_sobject(sobject: str, fields: dict) -> str:
    response = await _request(
        "POST", f"/services/data/{API_VERSION}/sobjects/{sobject}", json=fields
    )
    if response.status_code != 201:
        logging.error("Salesforce create failed: %s %s", response.status_code, response.text)
        raise SalesforceAPIError("Salesforce create failed")
    return response.json()["id"]


async def _find_or_create_id(sobject: str, name: str, create_fields: dict) -> str:
    soql = f"SELECT Id FROM {sobject} WHERE Name = '{_soql_escape(name)}' LIMIT 1"
    response = await _request("GET", f"/services/data/{API_VERSION}/query", params={"q": soql})
    if response.status_code != 200:
        logging.error("Salesforce lookup failed: %s %s", response.status_code, response.text)
        raise SalesforceAPIError("Salesforce lookup failed")
    records = response.json().get("records", [])
    if records:
        return records[0]["Id"]

    return await _create_sobject(sobject, create_fields)


def _contact_create_fields(name: str) -> dict:
    # Naive split: last word is LastName (required on Contact), everything
    # before it is FirstName if present.
    parts = name.split()
    if len(parts) == 1:
        return {"LastName": parts[0]}
    return {"FirstName": " ".join(parts[:-1]), "LastName": parts[-1]}


async def create_loan_application(
    applicant_name: str, account_name: str, amount_requested: float, status: str
) -> str:
    applicant_id = await _find_or_create_id(
        "Contact", applicant_name, _contact_create_fields(applicant_name)
    )
    account_id = await _find_or_create_id("Account", account_name, {"Name": account_name})

    return await _create_sobject(
        "Loan_Application__c",
        {
            "Applicant__c": applicant_id,
            "Account__c": account_id,
            "Amount_Requested__c": amount_requested,
            "Status__c": status,
            "Submitted_Date__c": date.today().isoformat(),
        },
    )


async def _get_status(record_id: str) -> str | None:
    soql = f"SELECT Status__c FROM Loan_Application__c WHERE Id = '{_soql_escape(record_id)}' LIMIT 1"
    response = await _request("GET", f"/services/data/{API_VERSION}/query", params={"q": soql})
    if response.status_code != 200:
        logging.error("Salesforce status lookup failed: %s %s", response.status_code, response.text)
        raise SalesforceAPIError("Salesforce status lookup failed")
    records = response.json().get("records", [])
    if not records:
        return None
    return records[0].get("Status__c")


async def update_loan_application_status(record_id: str, status: str) -> None:
    response = await _request(
        "PATCH",
        f"/services/data/{API_VERSION}/sobjects/Loan_Application__c/{record_id}",
        json={"Status__c": status},
    )
    if response.status_code != 204:
        logging.error("Salesforce update failed: %s %s", response.status_code, response.text)
        raise SalesforceAPIError("Salesforce update failed")


async def delete_loan_application(record_id: str) -> None:
    response = await _request(
        "DELETE", f"/services/data/{API_VERSION}/sobjects/Loan_Application__c/{record_id}"
    )
    if response.status_code != 204:
        logging.error("Salesforce delete failed: %s %s", response.status_code, response.text)
        raise SalesforceAPIError("Salesforce delete failed")


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


class AccountGroupOut(BaseModel):
    account_id: str | None = None
    account_name: str | None = None
    applications: list[LoanApplicationOut]


class HistoryEntryOut(BaseModel):
    old_value: str | None = None
    new_value: str | None = None
    changed_at: str | None = None


class RecommendationOut(BaseModel):
    suggestion: str


class LoanApplicationCreateRequest(BaseModel):
    applicant_name: str
    account_name: str
    amount_requested: float
    status: str = "Draft"
    honeypot: str = ""
    rendered_at: float


class LoanApplicationUpdateRequest(BaseModel):
    status: str


class LoanApplicationCreateResponse(BaseModel):
    status: str
    id: str | None = None


class ActionResponse(BaseModel):
    status: str


def _to_loan_application_out(record: dict) -> LoanApplicationOut:
    return LoanApplicationOut(
        id=record["Id"],
        applicant_name=(record.get("Applicant__r") or {}).get("Name"),
        account_name=(record.get("Account__r") or {}).get("Name"),
        amount_requested=record.get("Amount_Requested__c"),
        status=record.get("Status__c"),
        submitted_date=record.get("Submitted_Date__c"),
        decision_date=record.get("Decision_Date__c"),
    )


def _days_since(date_str: str | None) -> int | None:
    if not date_str:
        return None
    try:
        submitted = date.fromisoformat(date_str)
    except ValueError:
        return None
    return (date.today() - submitted).days


def _build_recommendation_prompt(status: str, days_since_submitted: int | None) -> str:
    duration_clause = (
        f"It has been {days_since_submitted} day(s) since it was submitted."
        if days_since_submitted is not None
        else "No submission date is on record."
    )
    return (
        "You are assisting a loan officer reviewing a loan application in a demo system. "
        f"The application's current status is '{status}'. {duration_clause} "
        "In one short sentence, suggest the most useful next action for the loan officer "
        "to take. Be specific and concise — no preamble, no markdown, just the suggestion."
    )


@router.get("/salesforce/loan-applications", response_model=list[LoanApplicationOut])
async def get_loan_applications() -> list[LoanApplicationOut]:
    try:
        records = await list_loan_applications()
    except (SalesforceAuthError, SalesforceAPIError):
        raise HTTPException(status_code=502, detail="Unable to reach Salesforce right now")

    return [_to_loan_application_out(record) for record in records]


@router.get("/salesforce/accounts", response_model=list[AccountGroupOut])
async def get_accounts_view() -> list[AccountGroupOut]:
    try:
        records = await list_loan_applications_by_account()
    except (SalesforceAuthError, SalesforceAPIError):
        raise HTTPException(status_code=502, detail="Unable to reach Salesforce right now")

    groups: dict[str, AccountGroupOut] = {}
    order: list[str] = []
    for record in records:
        account_id = record.get("Account__c")
        account_name = (record.get("Account__r") or {}).get("Name")
        key = account_id or "unknown"
        if key not in groups:
            groups[key] = AccountGroupOut(
                account_id=account_id, account_name=account_name, applications=[]
            )
            order.append(key)
        groups[key].applications.append(_to_loan_application_out(record))

    return [groups[key] for key in order]


@router.get(
    "/salesforce/loan-applications/{record_id}/history", response_model=list[HistoryEntryOut]
)
async def get_loan_application_history(record_id: str) -> list[HistoryEntryOut]:
    if not RECORD_ID_RE.match(record_id):
        raise HTTPException(status_code=422, detail="Invalid record id")

    try:
        records = await get_status_history(record_id)
    except (SalesforceAuthError, SalesforceAPIError):
        raise HTTPException(status_code=502, detail="Unable to reach Salesforce right now")

    return [
        HistoryEntryOut(
            old_value=record.get("OldValue"),
            new_value=record.get("NewValue"),
            changed_at=record.get("CreatedDate"),
        )
        for record in records
    ]


@router.get(
    "/salesforce/loan-applications/{record_id}/recommendation", response_model=RecommendationOut
)
async def get_recommendation_route(record_id: str, request: Request) -> RecommendationOut:
    ip = _client_ip(request)

    if _is_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many requests")

    if not RECORD_ID_RE.match(record_id):
        raise HTTPException(status_code=422, detail="Invalid record id")

    try:
        result = await get_status_and_submitted(record_id)
    except (SalesforceAuthError, SalesforceAPIError):
        raise HTTPException(status_code=502, detail="Unable to reach Salesforce right now")

    if result is None:
        raise HTTPException(status_code=404, detail="Loan application not found")

    status, submitted_date = result
    if not status:
        raise HTTPException(status_code=404, detail="Loan application not found")

    prompt = _build_recommendation_prompt(status, _days_since(submitted_date))

    try:
        suggestion = await get_recommendation(prompt)
    except AnthropicAPIError:
        raise HTTPException(status_code=502, detail="Unable to generate a recommendation right now")

    return RecommendationOut(suggestion=suggestion)


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

    if (
        not applicant_name
        or not account_name
        or payload.amount_requested <= 0
        or payload.status not in SETTABLE_STATUSES
    ):
        raise HTTPException(status_code=422, detail="Invalid submission")

    try:
        record_id = await create_loan_application(
            applicant_name, account_name, payload.amount_requested, payload.status
        )
    except (SalesforceAuthError, SalesforceAPIError):
        raise HTTPException(status_code=502, detail="Unable to reach Salesforce right now")

    return LoanApplicationCreateResponse(status="ok", id=record_id)


@router.patch("/salesforce/loan-applications/{record_id}", response_model=ActionResponse)
async def patch_loan_application(
    record_id: str, payload: LoanApplicationUpdateRequest, request: Request
) -> ActionResponse:
    ip = _client_ip(request)

    if _is_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many requests")

    if not RECORD_ID_RE.match(record_id):
        raise HTTPException(status_code=422, detail="Invalid record id")

    if payload.status not in SETTABLE_STATUSES:
        raise HTTPException(status_code=422, detail="Invalid status")

    try:
        await update_loan_application_status(record_id, payload.status)
    except (SalesforceAuthError, SalesforceAPIError):
        raise HTTPException(status_code=502, detail="Unable to reach Salesforce right now")

    return ActionResponse(status="ok")


@router.delete("/salesforce/loan-applications/{record_id}", response_model=ActionResponse)
async def delete_loan_application_route(record_id: str, request: Request) -> ActionResponse:
    ip = _client_ip(request)

    if _is_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many requests")

    if not RECORD_ID_RE.match(record_id):
        raise HTTPException(status_code=422, detail="Invalid record id")

    try:
        current_status = await _get_status(record_id)
    except (SalesforceAuthError, SalesforceAPIError):
        raise HTTPException(status_code=502, detail="Unable to reach Salesforce right now")

    if current_status is None:
        raise HTTPException(status_code=404, detail="Loan application not found")

    if current_status == "Archived":
        raise HTTPException(status_code=403, detail="Archived records can't be deleted")

    try:
        await delete_loan_application(record_id)
    except (SalesforceAuthError, SalesforceAPIError):
        raise HTTPException(status_code=502, detail="Unable to reach Salesforce right now")

    return ActionResponse(status="ok")
