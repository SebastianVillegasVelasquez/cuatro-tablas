"""Configuración de una mesa y sus reglas de validez.

La configuración es DATO PURO: no sabe nada de 3D ni de precios. El visor 3D
y el motor de precios son consumidores de este estado.

La validación devuelve TODAS las incidencias en lugar de lanzar en la primera,
para que la interfaz pueda mostrarlas juntas. Los límites son valores de
ejemplo: deben ser confirmados por el carpintero.
"""

from dataclasses import dataclass

from cuatro_tablas.domain.catalog import Catalog

WIDTH_RANGE = (60, 240)
DEPTH_RANGE = (40, 120)
HEIGHT_RANGE = (45, 110)
THICKNESS_RANGE = (2, 6)
LEG_SECTION_RANGE = (4, 10)

DEFAULT_TOP_THICKNESS_CM = 3
DEFAULT_LEG_SECTION_CM = 6

# Tapas largas con poco espesor se deforman (flecha). Regla de ejemplo.
LONG_SPAN_CM = 180
MIN_THICKNESS_FOR_LONG_SPAN_CM = 4


@dataclass(frozen=True)
class TableConfiguration:
    width_cm: int
    depth_cm: int
    height_cm: int
    material_id: str
    finish_id: str
    top_thickness_cm: int = DEFAULT_TOP_THICKNESS_CM
    leg_section_cm: int = DEFAULT_LEG_SECTION_CM


@dataclass(frozen=True)
class ValidationIssue:
    field: str
    code: str
    message: str


def _check_range(
    issues: list[ValidationIssue], field: str, value: int, bounds: tuple[int, int]
) -> None:
    low, high = bounds
    if not low <= value <= high:
        issues.append(
            ValidationIssue(
                field=field,
                code=f"{field}_out_of_range",
                message=f"{field} debe estar entre {low} y {high} cm (recibido: {value}).",
            )
        )


def validate(config: TableConfiguration, catalog: Catalog) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []

    _check_range(issues, "width_cm", config.width_cm, WIDTH_RANGE)
    _check_range(issues, "depth_cm", config.depth_cm, DEPTH_RANGE)
    _check_range(issues, "height_cm", config.height_cm, HEIGHT_RANGE)
    _check_range(issues, "top_thickness_cm", config.top_thickness_cm, THICKNESS_RANGE)
    _check_range(issues, "leg_section_cm", config.leg_section_cm, LEG_SECTION_RANGE)

    if config.material_id not in catalog.materials:
        issues.append(
            ValidationIssue(
                "material_id", "unknown_material", f"Material desconocido: {config.material_id}."
            )
        )
    if config.finish_id not in catalog.finishes:
        issues.append(
            ValidationIssue(
                "finish_id", "unknown_finish", f"Acabado desconocido: {config.finish_id}."
            )
        )

    if (
        config.width_cm > LONG_SPAN_CM
        and config.top_thickness_cm < MIN_THICKNESS_FOR_LONG_SPAN_CM
    ):
        issues.append(
            ValidationIssue(
                "top_thickness_cm",
                "thin_top_for_long_span",
                f"Tapas de más de {LONG_SPAN_CM} cm requieren espesor de al menos "
                f"{MIN_THICKNESS_FOR_LONG_SPAN_CM} cm.",
            )
        )

    return issues
