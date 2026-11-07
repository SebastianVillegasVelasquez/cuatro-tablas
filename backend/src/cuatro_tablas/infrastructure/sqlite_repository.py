import json
import sqlite3
from contextlib import closing
from dataclasses import asdict
from datetime import datetime
from decimal import Decimal
from pathlib import Path

from cuatro_tablas.domain.configuration import TableConfiguration
from cuatro_tablas.domain.pricing import LineItem, Quote
from cuatro_tablas.domain.quote_request import Contact, QuoteRequest

_SCHEMA = """
CREATE TABLE IF NOT EXISTS quote_requests (
    id            TEXT PRIMARY KEY,
    created_at    TEXT NOT NULL,     -- ISO 8601, always UTC
    configuration TEXT NOT NULL,     -- JSON
    contact       TEXT NOT NULL,     -- JSON
    items         TEXT NOT NULL,     -- JSON: [{"concept": str, "amount": "decimal string"}]
    subtotal      TEXT NOT NULL,
    markup_rate   TEXT NOT NULL,
    total_cop     INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests (created_at);
"""


class SQLiteQuoteRequestRepository:
    """Stores quote requests in a SQLite file.

    A connection is opened per operation: SQLite connections are cheap and this
    avoids sharing one across the worker threads that serve requests. Amounts
    are stored as decimal strings so no precision is lost.
    """

    def __init__(self, path: Path | str) -> None:
        self._path = Path(path)
        self._path.parent.mkdir(parents=True, exist_ok=True)
        with closing(self._connect()) as conn, conn:
            conn.executescript(_SCHEMA)

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self._path)
        conn.row_factory = sqlite3.Row
        return conn

    def add(self, request: QuoteRequest) -> None:
        if request.created_at.tzinfo is None:
            raise ValueError("created_at must be timezone-aware (UTC).")
        items = [{"concept": i.concept, "amount": str(i.amount)} for i in request.quote.items]
        with closing(self._connect()) as conn, conn:
            conn.execute(
                "INSERT INTO quote_requests "
                "(id, created_at, configuration, contact, items, subtotal, markup_rate, total_cop) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    request.id,
                    request.created_at.isoformat(),
                    json.dumps(asdict(request.configuration)),
                    json.dumps(asdict(request.contact)),
                    json.dumps(items),
                    str(request.quote.subtotal),
                    str(request.quote.markup_rate),
                    request.quote.total_cop,
                ),
            )

    def list_all(self) -> list[QuoteRequest]:
        with closing(self._connect()) as conn:
            rows = conn.execute(
                "SELECT * FROM quote_requests ORDER BY created_at DESC, rowid DESC"
            ).fetchall()
        return [_to_request(row) for row in rows]


def _to_request(row: sqlite3.Row) -> QuoteRequest:
    items = tuple(
        LineItem(concept=i["concept"], amount=Decimal(i["amount"])) for i in json.loads(row["items"])
    )
    return QuoteRequest(
        id=row["id"],
        created_at=datetime.fromisoformat(row["created_at"]),
        configuration=TableConfiguration(**json.loads(row["configuration"])),
        contact=Contact(**json.loads(row["contact"])),
        quote=Quote(
            items=items,
            subtotal=Decimal(row["subtotal"]),
            markup_rate=Decimal(row["markup_rate"]),
            total_cop=row["total_cop"],
        ),
    )
