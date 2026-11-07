from fastapi.testclient import TestClient

from cuatro_tablas.api.app import create_app

ORIGIN = "http://localhost:5173"
PREFLIGHT = {"Origin": ORIGIN, "Access-Control-Request-Method": "POST"}


def test_configured_origin_is_allowed():
    client = TestClient(create_app(cors_origins=[ORIGIN]))

    response = client.options("/quote", headers=PREFLIGHT)

    assert response.headers["access-control-allow-origin"] == ORIGIN


def test_other_origins_are_not_allowed():
    client = TestClient(create_app(cors_origins=[ORIGIN]))

    response = client.options("/quote", headers={**PREFLIGHT, "Origin": "http://evil.example"})

    assert "access-control-allow-origin" not in response.headers


def test_cors_is_off_by_default():
    client = TestClient(create_app())

    response = client.options("/quote", headers=PREFLIGHT)

    assert "access-control-allow-origin" not in response.headers
