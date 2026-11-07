import pytest
from fastapi.testclient import TestClient

from cuatro_tablas.api.app import create_app
from cuatro_tablas.infrastructure.memory_repository import InMemoryQuoteRequestRepository

CONFIGURATION = {
    "width_cm": 120,
    "depth_cm": 60,
    "height_cm": 75,
    "material_id": "pino",
    "finish_id": "natural",
}
CONTACT = {"name": "Ana", "email": "ana@example.com"}
BODY = {"configuration": CONFIGURATION, "contact": CONTACT}


@pytest.fixture
def repository():
    return InMemoryQuoteRequestRepository()


@pytest.fixture
def client(repository):
    return TestClient(create_app(quote_requests=repository))


def test_request_is_stored_and_priced(client, repository):
    response = client.post("/quote-requests", json=BODY)

    assert response.status_code == 201
    assert response.json()["total_cop"] == 435000
    [stored] = repository.list_all()
    assert stored.id == response.json()["id"]
    assert stored.contact.name == "Ana"


def test_a_total_sent_by_the_client_is_ignored(client, repository):
    client.post("/quote-requests", json={**BODY, "total_cop": 1})

    assert repository.list_all()[0].quote.total_cop == 435000


def test_invalid_configuration_is_rejected_and_not_stored(client, repository):
    bad = {**BODY, "configuration": {**CONFIGURATION, "width_cm": 10}}

    response = client.post("/quote-requests", json=bad)

    assert response.status_code == 422
    assert response.json()["error"] == "invalid_configuration"
    assert repository.list_all() == []


def test_a_way_to_reach_the_customer_is_required(client, repository):
    response = client.post(
        "/quote-requests", json={"configuration": CONFIGURATION, "contact": {"name": "Ana"}}
    )

    assert response.status_code == 422
    assert response.json()["error"] == "invalid_contact"
    assert repository.list_all() == []


def test_malformed_email_is_rejected(client, repository):
    bad = {**BODY, "contact": {"name": "Ana", "email": "not-an-email"}}

    assert client.post("/quote-requests", json=bad).status_code == 422
    assert repository.list_all() == []


def test_oversized_message_is_rejected(client):
    bad = {**BODY, "contact": {**CONTACT, "message": "x" * 1001}}

    assert client.post("/quote-requests", json=bad).status_code == 422
