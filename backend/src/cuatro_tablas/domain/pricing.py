"""Motor de precio.

Cada concepto de costo es una regla independiente (patrón Strategy): agregar
"transporte" o "instalación" es agregar una clase, no editar una función
gigante. El dinero se maneja con Decimal (nunca float) y el total se entrega
como entero en COP.
"""

from dataclasses import dataclass
from decimal import ROUND_HALF_UP, Decimal
from typing import Protocol

from cuatro_tablas.domain import geometry
from cuatro_tablas.domain.catalog import Catalog
from cuatro_tablas.domain.configuration import TableConfiguration, ValidationIssue, validate


class InvalidConfiguration(Exception):
    """No se cotiza una configuración inválida."""

    def __init__(self, issues: list[ValidationIssue]) -> None:
        super().__init__("; ".join(i.message for i in issues))
        self.issues = issues


@dataclass(frozen=True)
class LineItem:
    concept: str
    amount: Decimal


class PricingRule(Protocol):
    def apply(self, config: TableConfiguration, catalog: Catalog) -> LineItem: ...


@dataclass(frozen=True)
class MaterialRule:
    waste_factor: Decimal = Decimal("1.25")  # desperdicio de corte (ejemplo)

    def apply(self, config: TableConfiguration, catalog: Catalog) -> LineItem:
        material = catalog.materials[config.material_id]
        volume = geometry.wood_volume_m3(config) * self.waste_factor
        return LineItem(f"Madera ({material.name})", volume * material.price_per_m3)


@dataclass(frozen=True)
class FinishRule:
    def apply(self, config: TableConfiguration, catalog: Catalog) -> LineItem:
        finish = catalog.finishes[config.finish_id]
        return LineItem(
            f"Acabado ({finish.name})", geometry.finish_area_m2(config) * finish.price_per_m2
        )


@dataclass(frozen=True)
class LaborRule:
    base: Decimal = Decimal("150000")  # ejemplo
    per_top_m2: Decimal = Decimal("40000")  # ejemplo

    def apply(self, config: TableConfiguration, catalog: Catalog) -> LineItem:
        return LineItem("Mano de obra", self.base + geometry.top_area_m2(config) * self.per_top_m2)


DEFAULT_RULES: tuple[PricingRule, ...] = (MaterialRule(), FinishRule(), LaborRule())


@dataclass(frozen=True)
class Quote:
    items: tuple[LineItem, ...]
    subtotal: Decimal
    markup_rate: Decimal
    total_cop: int


def _round_to(value: Decimal, step: int) -> int:
    step_d = Decimal(step)
    return int((value / step_d).quantize(Decimal(1), rounding=ROUND_HALF_UP) * step_d)


def calculate_quote(
    config: TableConfiguration,
    catalog: Catalog,
    rules: tuple[PricingRule, ...] = DEFAULT_RULES,
    markup_rate: Decimal = Decimal("0.30"),
    round_to_cop: int = 1000,
) -> Quote:
    """Calcula la cotización. `markup_rate` es recargo sobre costo (no margen)."""
    issues = validate(config, catalog)
    if issues:
        raise InvalidConfiguration(issues)

    items = tuple(rule.apply(config, catalog) for rule in rules)
    subtotal = sum((i.amount for i in items), Decimal(0))
    total = _round_to(subtotal * (1 + markup_rate), round_to_cop)
    return Quote(items=items, subtotal=subtotal, markup_rate=markup_rate, total_cop=total)
