from fastapi.testclient import TestClient

from cuatro_tablas.api.app import create_app

client = TestClient(create_app())

VALID = {
    "width_cm": 120,
    "depth_cm": 60,
    "height_cm": 75,
    "material_id": "pino",
    "finish_id": "natural",
}


def test_quote_returns_the_total_for_a_valid_configuration():
    response = client.post("/quote", json=VALID)

    assert response.status_code == 200
    assert response.json() == {"total_cop": 435000, "currency": "COP"}


def test_quote_does_not_leak_the_cost_breakdown():
    body = client.post("/quote", json=VALID).json()

    assert set(body) == {"total_cop", "currency"}


def test_quote_uses_domain_defaults_for_optional_dimensions():
    explicit = {**VALID, "top_thickness_cm": 3, "leg_section_cm": 6}

    assert client.post("/quote", json=VALID).json() == client.post("/quote", json=explicit).json()


def test_invalid_configuration_returns_every_issue():
    bad = {**VALID, "width_cm": 10, "material_id": "oro"}

    response = client.post("/quote", json=bad)

    assert response.status_code == 422
    body = response.json()
    assert body["error"] == "invalid_configuration"
    assert {i["code"] for i in body["issues"]} == {"width_cm_out_of_range", "unknown_material"}


def test_missing_fields_are_rejected_by_schema_validation():
    response = client.post("/quote", json={"width_cm": 120})

    assert response.status_code == 422
