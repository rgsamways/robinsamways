import logging
import os

import httpx

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_MODEL = "claude-haiku-4-5"
ANTHROPIC_VERSION = "2023-06-01"
ANTHROPIC_MAX_TOKENS = 150


class AnthropicAPIError(Exception):
    """Raised when the Anthropic API call fails or returns something unusable."""


async def get_recommendation(prompt: str) -> str:
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                ANTHROPIC_API_URL,
                headers={
                    "content-type": "application/json",
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": ANTHROPIC_VERSION,
                },
                json={
                    "model": ANTHROPIC_MODEL,
                    "max_tokens": ANTHROPIC_MAX_TOKENS,
                    "messages": [{"role": "user", "content": prompt}],
                },
            )
    except httpx.RequestError as exc:
        logging.error("Anthropic API request errored: %s", exc)
        raise AnthropicAPIError("Anthropic API request errored") from exc

    if response.status_code != 200:
        logging.error("Anthropic API request failed: %s %s", response.status_code, response.text)
        raise AnthropicAPIError("Anthropic API request failed")

    data = response.json()
    try:
        text = "".join(
            block["text"] for block in data["content"] if block.get("type") == "text"
        ).strip()
    except (KeyError, TypeError) as exc:
        logging.error("Anthropic API response malformed: %s", data)
        raise AnthropicAPIError("Anthropic API response malformed") from exc

    if not text:
        logging.error("Anthropic API returned empty content: %s", data)
        raise AnthropicAPIError("Anthropic API returned empty content")

    return text
