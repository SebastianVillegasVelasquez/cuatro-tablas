from datetime import UTC, datetime

import pytest

from cuatro_tablas.application.submit_quote_request import submit_quote_request
from cuatro_tablas.domain.catalog import DEFAULT_CATALOG
from cuatro_tablas.domain.configuration import TableConfiguration
from cuatro_tablas.domain.pricing import InvalidConfiguration
from cuatro_tablas.domain.quote_request import Contact
from cuatro_tablas.infrastructure.memory_repository import InMemoryQuoteRequestRepository

CONFIG = TableConfiguration(
    width_cm=120, depth_cm=60, height_cm=75, material_id="pino", finish_id="natural"
)
CONTACT = Contact(name="Ana", email="ana@example.com")
NOW = datetime(2026, 11, 7, 12, 0, tzinfo=UTC)


def submit(config=CONFIG, repository=None):
    repository = repository if repository is not None else InMemoryQuoteRequestRepository()
    request = submit_quote_request(
        config,
        CONTACT,
        catalog=DEFAULT_CATALOG,
        repository=repository,
        now=lambda: NOW,
        new_id=lambda: "req-1",
    )
    return request, repository


def test_request_is_priced_on_the_server_and_stored():
    request, repository = submit()

    assert request.id == "req-1"
    assert request.created_at == NOW
    assert request.quote.total_cop == 435000
    assert repository.list_all() == [request]


def test_invalid_configuration_stores_nothing():
    repository = InMemoryQuoteRequestRepository()
    bad = TableConfiguration(
        width_cm=10, depth_cm=60, height_cm=75, material_id="pino", finish_id="natural"
    )

    with pytest.raises(InvalidConfiguration):
        submit(bad, repository)

    assert repository.list_all() == []


def test_in_memory_repository_lists_newest_first():
    repository = InMemoryQuoteRequestRepository()
    older, _ = submit(repository=repository)
    newer = submit_quote_request(
        CONFIG,
        CONTACT,
        catalog=DEFAULT_CATALOG,
        repository=repository,
        now=lambda: datetime(2026, 11, 8, tzinfo=UTC),
        new_id=lambda: "req-2",
    )

    assert [r.id for r in repository.list_all()] == [newer.id, older.id]
