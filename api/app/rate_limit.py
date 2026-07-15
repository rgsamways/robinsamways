import time
from collections import defaultdict

from fastapi import Request


class RateLimiter:
    def __init__(self, window_seconds: float, max_requests: int):
        self.window_seconds = window_seconds
        self.max_requests = max_requests
        self._hits: dict[str, list[float]] = defaultdict(list)

    def is_rate_limited(self, ip: str) -> bool:
        now = time.monotonic()
        hits = self._hits[ip]
        cutoff = now - self.window_seconds
        while hits and hits[0] < cutoff:
            hits.pop(0)
        if len(hits) >= self.max_requests:
            return True
        hits.append(now)
        return False

    def reset(self) -> None:
        self._hits.clear()


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"
