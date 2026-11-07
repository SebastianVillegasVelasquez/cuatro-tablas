"""Valores calculados a mano para una mesa de 120x60x75, tapa de 3 cm, patas de 6 cm."""

from decimal import Decimal

from cuatro_tablas.domain import geometry
from cuatro_tablas.domain.configuration import TableConfiguration

TABLE = TableConfiguration(
    width_cm=120,
    depth_cm=60,
    height_cm=75,
    material_id="pino",
    finish_id="natural",
    top_thickness_cm=3,
    leg_section_cm=6,
)


def test_top_area():
    assert geometry.top_area_m2(TABLE) == Decimal("0.72")


def test_wood_volume():
    # tapa 1.2*0.6*0.03 = 0.0216 ; patas 4*0.06^2*0.72 = 0.010368
    assert geometry.wood_volume_m3(TABLE) == Decimal("0.031968")


def test_finish_area():
    # caras 1.44 + canto 3.6*0.03=0.108 + patas 4*(4*0.06*0.72)=0.6912
    assert geometry.finish_area_m2(TABLE) == Decimal("2.2392")


def test_volume_grows_with_width():
    wider = TableConfiguration(
        width_cm=160, depth_cm=60, height_cm=75, material_id="pino", finish_id="natural"
    )
    assert geometry.wood_volume_m3(wider) > geometry.wood_volume_m3(TABLE)
