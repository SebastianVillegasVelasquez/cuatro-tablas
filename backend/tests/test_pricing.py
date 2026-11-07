from dataclasses import replace
from decimal import Decimal

import pytest

from cuatro_tablas.domain.catalog import DEFAULT_CATALOG
from cuatro_tablas.domain.configuration import TableConfiguration
from cuatro_tablas.domain.pricing import (
    DEFAULT_RULES,
    InvalidConfiguration,
    LineItem,
    calculate_quote,
)

BASE = TableConfiguration(
    width_cm=120,
    depth_cm=60,
    height_cm=75,
    material_id="pino",
    finish_id="natural",
    top_thickness_cm=3,
    leg_section_cm=6,
)


def total(config: TableConfiguration) -> int:
    return calculate_quote(config, DEFAULT_CATALOG).total_cop


def test_hand_calculated_case():
    """Calculado a mano, independiente de la implementación.

    Madera: tapa 1.2*0.6*0.03 = 0.0216 m³; patas 4*0.06²*0.72 = 0.010368 m³
            total 0.031968 m³ * 1.25 desperdicio = 0.03996 m³ * 2.500.000 = 99.900
    Acabado: caras 1.44 + canto 3.6*0.03=0.108 + patas 4*(4*0.06*0.72)=0.6912
             = 2.2392 m² * 25.000 = 55.980
    Mano de obra: 150.000 + 0.72 m² * 40.000 = 178.800
    Subtotal: 334.680 ; con recargo 30% = 435.084 ; redondeado a 1000 -> 435.000
    """
    quote = calculate_quote(BASE, DEFAULT_CATALOG)
    amounts = {i.concept: i.amount for i in quote.items}

    assert amounts["Madera (Pino)"] == Decimal("99900")
    assert amounts["Acabado (Sellador natural)"] == Decimal("55980")
    assert amounts["Mano de obra"] == Decimal("178800")
    assert quote.subtotal == Decimal("334680")
    assert quote.total_cop == 435000


def test_total_is_int_and_multiple_of_rounding_step():
    value = total(BASE)
    assert isinstance(value, int)
    assert value % 1000 == 0


def test_price_grows_with_each_dimension():
    assert total(replace(BASE, width_cm=160)) > total(BASE)
    assert total(replace(BASE, depth_cm=80)) > total(BASE)
    assert total(replace(BASE, height_cm=90)) > total(BASE)


def test_better_material_costs_more():
    assert total(replace(BASE, material_id="roble")) > total(replace(BASE, material_id="pino"))


def test_invalid_configuration_is_not_quoted():
    with pytest.raises(InvalidConfiguration) as exc:
        calculate_quote(replace(BASE, width_cm=10), DEFAULT_CATALOG)
    assert any(i.code == "width_cm_out_of_range" for i in exc.value.issues)


def test_markup_is_applied_over_cost():
    no_markup = calculate_quote(BASE, DEFAULT_CATALOG, markup_rate=Decimal("0"))
    with_markup = calculate_quote(BASE, DEFAULT_CATALOG, markup_rate=Decimal("0.5"))
    assert with_markup.total_cop > no_markup.total_cop
    assert with_markup.subtotal == no_markup.subtotal


def test_custom_rule_can_be_added_without_touching_engine():
    class Delivery:
        def apply(self, config, catalog):
            return LineItem("Transporte", Decimal("50000"))

    base = calculate_quote(BASE, DEFAULT_CATALOG)
    extended = calculate_quote(BASE, DEFAULT_CATALOG, rules=(*DEFAULT_RULES, Delivery()))
    assert extended.subtotal == base.subtotal + Decimal("50000")
