"""Catálogo de materiales y acabados.

IMPORTANTE: los precios de este archivo son DATOS DE EJEMPLO para desarrollo.
Los valores reales los define el carpintero. En producción vivirán en base de
datos (patrón Repository), no en código; aquí están como constantes para poder
probar el dominio sin infraestructura.
"""

from dataclasses import dataclass, field
from decimal import Decimal


@dataclass(frozen=True)
class Material:
    id: str
    name: str
    price_per_m3: Decimal  # COP por m³ de madera en bruto


@dataclass(frozen=True)
class Finish:
    id: str
    name: str
    price_per_m2: Decimal  # COP por m² de superficie a acabar


@dataclass(frozen=True)
class Catalog:
    materials: dict[str, Material] = field(default_factory=dict)
    finishes: dict[str, Finish] = field(default_factory=dict)


DEFAULT_CATALOG = Catalog(
    materials={
        "pino": Material("pino", "Pino", Decimal("2500000")),
        "cedro": Material("cedro", "Cedro", Decimal("4500000")),
        "roble": Material("roble", "Roble", Decimal("8000000")),
    },
    finishes={
        "natural": Finish("natural", "Sellador natural", Decimal("25000")),
        "lacado": Finish("lacado", "Lacado", Decimal("45000")),
        "poliuretano": Finish("poliuretano", "Poliuretano", Decimal("60000")),
    },
)
