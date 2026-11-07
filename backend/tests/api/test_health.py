from fastapi.testclient import TestClient

from cuatro_tablas.api.app import create_app


def test_health_reports_ok():
    client = TestClient(create_app())

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
