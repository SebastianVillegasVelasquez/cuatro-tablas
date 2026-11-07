from fastapi.testclient import TestClient

from cuatro_tablas.api.main import build_app

BODY = {
    "configuration": {
        "width_cm": 120,
        "depth_cm": 60,
        "height_cm": 75,
        "material_id": "pino",
        "finish_id": "natural",
    },
    "contact": {"name": "Ana", "email": "ana@example.com"},
}


def test_requests_are_persisted_to_the_configured_database(monkeypatch, tmp_path):
    db = tmp_path / "data" / "app.db"
    monkeypatch.setenv("TABLAS_DB_PATH", str(db))
    monkeypatch.setenv("TABLAS_ADMIN_API_KEY", "k")

    client = TestClient(build_app())
    client.post("/quote-requests", json=BODY)

    assert db.exists()
    rebuilt = TestClient(build_app())  # simulates a restart
    listed = rebuilt.get("/admin/quote-requests", headers={"X-API-Key": "k"}).json()
    assert [r["contact"]["name"] for r in listed] == ["Ana"]


def test_admin_stays_off_without_a_key(monkeypatch, tmp_path):
    monkeypatch.setenv("TABLAS_DB_PATH", str(tmp_path / "app.db"))
    monkeypatch.delenv("TABLAS_ADMIN_API_KEY", raising=False)

    assert TestClient(build_app()).get("/admin/quote-requests").status_code == 404


def test_cors_origins_come_from_the_environment(monkeypatch, tmp_path):
    monkeypatch.setenv("TABLAS_DB_PATH", str(tmp_path / "app.db"))
    monkeypatch.setenv("TABLAS_CORS_ORIGINS", "https://a.example, https://b.example")
    headers = {"Origin": "https://b.example", "Access-Control-Request-Method": "POST"}

    response = TestClient(build_app()).options("/quote", headers=headers)

    assert response.headers["access-control-allow-origin"] == "https://b.example"
