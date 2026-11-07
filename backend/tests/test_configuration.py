from dataclasses import replace

from cuatro_tablas.domain.catalog import DEFAULT_CATALOG
from cuatro_tablas.domain.configuration import TableConfiguration, validate

VALID = TableConfiguration(
    width_cm=120, depth_cm=60, height_cm=75, material_id="pino", finish_id="natural"
)


def codes(config: TableConfiguration) -> set[str]:
    return {i.code for i in validate(config, DEFAULT_CATALOG)}


def test_valid_configuration_has_no_issues():
    assert validate(VALID, DEFAULT_CATALOG) == []


def test_width_out_of_range():
    assert "width_cm_out_of_range" in codes(replace(VALID, width_cm=30))
    assert "width_cm_out_of_range" in codes(replace(VALID, width_cm=300))


def test_boundaries_are_valid():
    assert validate(replace(VALID, width_cm=60), DEFAULT_CATALOG) == []
    assert validate(replace(VALID, width_cm=240, top_thickness_cm=4), DEFAULT_CATALOG) == []


def test_unknown_material_and_finish():
    result = codes(replace(VALID, material_id="oro", finish_id="brillo"))
    assert {"unknown_material", "unknown_finish"} <= result


def test_long_span_requires_thick_top():
    assert "thin_top_for_long_span" in codes(replace(VALID, width_cm=200, top_thickness_cm=3))
    assert "thin_top_for_long_span" not in codes(replace(VALID, width_cm=200, top_thickness_cm=4))


def test_all_issues_are_reported_together():
    bad = replace(VALID, width_cm=10, depth_cm=500, material_id="oro")
    assert len(validate(bad, DEFAULT_CATALOG)) >= 3
