import pytest
from fastapi.testclient import TestClient

from cuatro_tablas.api.app import create_app
from cuatro_tablas.infrastructure.memory_repository import InMemoryQuoteRequestRepository

KEY = "s3cret-key"
BODY = {
    "configuration": {
        "width_cm": 120,
        "depth_cm": 60,
        "height_cm": 75,
        "material_id": "pino",
        "finish_id": "natural",
    },
    "contact": {"name": "Ana", "email": "ana@example.com", "phone": "3001234567"},
}


@pytest.fixture
def client():
    return TestClient(create_app(quote_requests=InMemoryQuoteRequestRepository(), admin_api_key=KEY))


def test_admin_api_does_not_exist_without_a_configured_key():
    client = TestClient(create_app())

    assert client.get("/admin/quote-requests").status_code == 404


def test_missing_key_is_rejected(client):
    assert client.get("/admin/quote-requests").status_code == 401


def test_wrong_key_is_rejected(client):
    assert client.get("/admin/quote-requests", headers={"X-API-Key": "nope"}).status_code == 401


def test_listing_returns_contact_data_and_cost_breakdown(client):
    client.post("/quote-requests", json=BODY)

    response = client.get("/admin/quote-requests", headers={"X-API-Key": KEY})

    assert response.status_code == 200
    [item] = response.json()
    assert item["contact"]["name"] == "Ana"
    assert item["contact"]["phone"] == "3001234567"
    assert item["total_cop"] == 435000
    assert item["subtotal_cop"] == 334680
    assert {i["concept"]: i["amount_cop"] for i in item["items"]} == {
        "Madera (Pino)": 99900,
        "Acabado (Sellador natural)": 55980,
        "Mano de obra": 178800,
    }


def test_public_endpoints_never_return_what_the_admin_sees(client):
    created = client.post("/quote-requests", json=BODY).json()

    assert set(created) == {"id", "total_cop"}
