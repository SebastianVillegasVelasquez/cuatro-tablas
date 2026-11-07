from datetime import UTC, datetime

import pytest

from cuatro_tablas.application.submit_quote_request import submit_quote_request
from cuatro_tablas.domain.catalog import DEFAULT_CATALOG
from cuatro_tablas.domain.configuration import TableConfiguration
from cuatro_tablas.domain.quote_request import Contact
from cuatro_tablas.infrastructure.sqlite_repository import SQLiteQuoteRequestRepository

CONFIG = TableConfiguration(
    width_cm=120, depth_cm=60, height_cm=75, material_id="pino", finish_id="natural"
)


def make_request(request_id: str, day: int):
    scratch = []

    class _Capture:
        def add(self, request):
            scratch.append(request)

        def list_all(self):
            return scratch

    return submit_quote_request(
        CONFIG,
        Contact(name="Ana", email="ana@example.com", phone="3001234567", message="Hola"),
        catalog=DEFAULT_CATALOG,
        repository=_Capture(),
        now=lambda: datetime(2026, 11, day, 12, 0, tzinfo=UTC),
        new_id=lambda: request_id,
    )


def test_a_request_survives_a_round_trip_unchanged(tmp_path):
    repository = SQLiteQuoteRequestRepository(tmp_path / "db.sqlite")
    original = make_request("req-1", 7)

    repository.add(original)

    assert repository.list_all() == [original]


def test_data_persists_across_repository_instances(tmp_path):
    path = tmp_path / "db.sqlite"
    SQLiteQuoteRequestRepository(path).add(make_request("req-1", 7))

    assert [r.id for r in SQLiteQuoteRequestRepository(path).list_all()] == ["req-1"]


def test_requests_are_listed_newest_first(tmp_path):
    repository = SQLiteQuoteRequestRepository(tmp_path / "db.sqlite")
    repository.add(make_request("old", 7))
    repository.add(make_request("new", 9))

    assert [r.id for r in repository.list_all()] == ["new", "old"]


def test_parent_directories_are_created(tmp_path):
    SQLiteQuoteRequestRepository(tmp_path / "nested" / "dir" / "db.sqlite")

    assert (tmp_path / "nested" / "dir" / "db.sqlite").exists()


def test_naive_timestamps_are_rejected(tmp_path):
    repository = SQLiteQuoteRequestRepository(tmp_path / "db.sqlite")
    request = make_request("req-1", 7)
    naive = type(request)(
        id=request.id,
        created_at=datetime(2026, 11, 7, 12, 0),
        configuration=request.configuration,
        contact=request.contact,
        quote=request.quote,
    )

    with pytest.raises(ValueError):
        repository.add(naive)
