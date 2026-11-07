from fastapi.testclient import TestClient

from cuatro_tablas.api.app import create_app
from cuatro_tablas.domain import configuration as rules

client = TestClient(create_app())


def test_catalog_lists_materials_and_finishes():
    body = client.get("/catalog").json()

    assert {m["id"] for m in body["materials"]} == {"pino", "cedro", "roble"}
    assert {f["id"] for f in body["finishes"]} == {"natural", "lacado", "poliuretano"}


def test_catalog_limits_come_from_the_domain_rules():
    limits = client.get("/catalog").json()["limits"]

    assert limits["width_cm"] == {"min": rules.WIDTH_RANGE[0], "max": rules.WIDTH_RANGE[1]}
    assert set(limits) == {
        "width_cm",
        "depth_cm",
        "height_cm",
        "top_thickness_cm",
        "leg_section_cm",
    }


def test_catalog_never_exposes_prices():
    text = client.get("/catalog").text.lower()

    assert "price" not in text
    assert "2500000" not in text
