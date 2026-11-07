"""Cálculos geométricos puros de la mesa (entrada en cm, salida en m³ / m²).

Se separan del precio porque son hechos físicos, no reglas de negocio: el
carpintero puede cambiar precios, pero el volumen de una tapa no cambia.
"""

from decimal import Decimal

from cuatro_tablas.domain.configuration import TableConfiguration

_CM_PER_M = Decimal(100)
_LEGS = 4


def _m(cm: int) -> Decimal:
    return Decimal(cm) / _CM_PER_M


def top_area_m2(c: TableConfiguration) -> Decimal:
    return _m(c.width_cm) * _m(c.depth_cm)


def wood_volume_m3(c: TableConfiguration) -> Decimal:
    top = top_area_m2(c) * _m(c.top_thickness_cm)
    leg_height = _m(c.height_cm - c.top_thickness_cm)
    legs = _LEGS * _m(c.leg_section_cm) ** 2 * leg_height
    return top + legs


def finish_area_m2(c: TableConfiguration) -> Decimal:
    """Superficie a acabar: dos caras de la tapa, su canto y las 4 patas."""
    faces = 2 * top_area_m2(c)
    perimeter = 2 * (_m(c.width_cm) + _m(c.depth_cm))
    edges = perimeter * _m(c.top_thickness_cm)
    leg_height = _m(c.height_cm - c.top_thickness_cm)
    legs = _LEGS * (4 * _m(c.leg_section_cm) * leg_height)
    return faces + edges + legs
