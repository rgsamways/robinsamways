import time

from app import salesforce


class FakeResponse:
    def __init__(self, status_code: int, json_body: dict | list):
        self.status_code = status_code
        self._json_body = json_body
        self.text = str(json_body)

    def json(self):
        return self._json_body


def _valid_token_cache():
    return {
        "access_token": "fake-token",
        "instance_url": "https://fake.my.salesforce.com",
        "expires_at": time.monotonic() + 900,
    }


def test_list_loan_applications_returns_mapped_records(client, monkeypatch):
    salesforce._token_cache.update(_valid_token_cache())

    async def fake_request(method, path, **kwargs):
        assert method == "GET"
        assert path.endswith("/query")
        assert "Loan_Application__c" in kwargs["params"]["q"]
        return FakeResponse(
            200,
            {
                "records": [
                    {
                        "Id": "a0Bxx0000001",
                        "Applicant__r": {"Name": "Alice Anderson"},
                        "Account__r": {"Name": "Acme Co"},
                        "Amount_Requested__c": 25000,
                        "Status__c": "Submitted",
                        "Submitted_Date__c": "2026-07-01",
                        "Decision_Date__c": None,
                    }
                ]
            },
        )

    monkeypatch.setattr(salesforce, "_request", fake_request)

    response = client.get("/salesforce/loan-applications")

    assert response.status_code == 200
    body = response.json()
    assert body == [
        {
            "id": "a0Bxx0000001",
            "applicant_name": "Alice Anderson",
            "account_name": "Acme Co",
            "amount_requested": 25000,
            "status": "Submitted",
            "submitted_date": "2026-07-01",
            "decision_date": None,
        }
    ]


def test_create_loan_application_finds_or_creates_related_records(client, monkeypatch):
    salesforce._token_cache.update(_valid_token_cache())
    calls: list[tuple[str, str]] = []

    async def fake_request(method, path, **kwargs):
        calls.append((method, path))
        if method == "GET" and path.endswith("/query"):
            # No existing Contact/Account -- forces the create branch.
            return FakeResponse(200, {"records": []})
        if method == "POST" and path.endswith("/sobjects/Contact"):
            return FakeResponse(201, {"id": "003xx000Contact"})
        if method == "POST" and path.endswith("/sobjects/Account"):
            return FakeResponse(201, {"id": "001xx000Account"})
        if method == "POST" and path.endswith("/sobjects/Loan_Application__c"):
            return FakeResponse(201, {"id": "a0Bxx000NewApp"})
        raise AssertionError(f"unexpected Salesforce call: {method} {path}")

    monkeypatch.setattr(salesforce, "_request", fake_request)

    response = client.post(
        "/salesforce/loan-applications",
        json={
            "applicant_name": "Bob Builder",
            "account_name": "New Homes Ltd",
            "amount_requested": 15000,
            "status": "Draft",
            "honeypot": "",
            "rendered_at": time.time() - 5,
        },
    )

    assert response.status_code == 201
    assert response.json() == {"status": "ok", "id": "a0Bxx000NewApp"}
    # Contact and Account each get looked up before being created.
    assert ("POST", "/services/data/v61.0/sobjects/Contact") in calls
    assert ("POST", "/services/data/v61.0/sobjects/Account") in calls
    assert ("POST", "/services/data/v61.0/sobjects/Loan_Application__c") in calls


def test_create_loan_application_rejects_a_blocked_word_before_calling_salesforce(client, monkeypatch):
    async def fake_request(method, path, **kwargs):
        raise AssertionError("Salesforce should not be called for a rejected submission")

    monkeypatch.setattr(salesforce, "_request", fake_request)

    response = client.post(
        "/salesforce/loan-applications",
        json={
            "applicant_name": "Total Bullshit",
            "account_name": "Acme Co",
            "amount_requested": 15000,
            "status": "Draft",
            "honeypot": "",
            "rendered_at": time.time() - 5,
        },
    )

    assert response.status_code == 422


def test_create_loan_application_silently_drops_honeypot_submissions(client, monkeypatch):
    async def fake_request(method, path, **kwargs):
        raise AssertionError("Salesforce should not be called for a honeypot-tripped submission")

    monkeypatch.setattr(salesforce, "_request", fake_request)

    response = client.post(
        "/salesforce/loan-applications",
        json={
            "applicant_name": "Bob Builder",
            "account_name": "New Homes Ltd",
            "amount_requested": 15000,
            "status": "Draft",
            "honeypot": "filled-in-by-a-bot",
            "rendered_at": time.time() - 5,
        },
    )

    assert response.status_code == 201
    assert response.json() == {"status": "ok", "id": None}
