import time

from app import feedback


def test_submit_feedback_with_only_sentiment_is_accepted(client, fake_db_session):
    response = client.post(
        "/feedback",
        json={
            "page": "/farpost",
            "sentiment": "positive",
            "comment": None,
            "honeypot": "",
            "rendered_at": time.time() - 5,
        },
    )

    assert response.status_code == 201
    assert response.json() == {"status": "ok"}
    assert len(fake_db_session) == 1
    saved = fake_db_session[0]
    assert saved.page == "/farpost"
    assert saved.sentiment == "positive"
    assert saved.comment is None


def test_submit_feedback_with_only_comment_is_accepted(client, fake_db_session):
    response = client.post(
        "/feedback",
        json={
            "page": "/dev-log",
            "sentiment": None,
            "comment": "This page was really helpful.",
            "honeypot": "",
            "rendered_at": time.time() - 5,
        },
    )

    assert response.status_code == 201
    assert response.json() == {"status": "ok"}
    assert len(fake_db_session) == 1
    saved = fake_db_session[0]
    assert saved.page == "/dev-log"
    assert saved.sentiment is None
    assert saved.comment == "This page was really helpful."


def test_submit_feedback_rejected_when_both_sentiment_and_comment_are_absent(client, fake_db_session):
    response = client.post(
        "/feedback",
        json={
            "page": "/techstacks",
            "sentiment": None,
            "comment": None,
            "honeypot": "",
            "rendered_at": time.time() - 5,
        },
    )

    assert response.status_code == 422
    assert fake_db_session == []


def test_submit_feedback_silently_drops_honeypot_submissions(client, fake_db_session):
    response = client.post(
        "/feedback",
        json={
            "page": "/farpost",
            "sentiment": "negative",
            "comment": None,
            "honeypot": "filled-in-by-a-bot",
            "rendered_at": time.time() - 5,
        },
    )

    assert response.status_code == 201
    assert response.json() == {"status": "ok"}
    assert fake_db_session == []


def test_feedback_rate_limit_is_independent_of_contact(client, fake_db_session):
    for _ in range(feedback._rate_limiter.max_requests):
        response = client.post(
            "/feedback",
            json={
                "page": "/farpost",
                "sentiment": "positive",
                "comment": None,
                "honeypot": "",
                "rendered_at": time.time() - 5,
            },
        )
        assert response.status_code == 201

    limited_response = client.post(
        "/feedback",
        json={
            "page": "/farpost",
            "sentiment": "positive",
            "comment": None,
            "honeypot": "",
            "rendered_at": time.time() - 5,
        },
    )
    assert limited_response.status_code == 429

    # /contact has its own, separate rate-limit bucket -- exhausting /feedback's
    # budget above must not affect it.
    contact_response = client.post(
        "/contact",
        json={
            "name": "Jane Doe",
            "email": "jane@example.com",
            "message": "Hello there",
            "honeypot": "",
            "rendered_at": time.time() - 5,
        },
    )
    assert contact_response.status_code == 201
