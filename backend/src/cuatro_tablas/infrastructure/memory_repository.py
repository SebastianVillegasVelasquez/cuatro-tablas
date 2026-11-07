from cuatro_tablas.domain.quote_request import QuoteRequest


class InMemoryQuoteRequestRepository:
    """Volatile repository for tests and local experiments."""

    def __init__(self) -> None:
        self._items: list[QuoteRequest] = []

    def add(self, request: QuoteRequest) -> None:
        self._items.append(request)

    def list_all(self) -> list[QuoteRequest]:
        return sorted(self._items, key=lambda r: r.created_at, reverse=True)
