from fastapi import APIRouter

from cuatro_tablas.api.schemas import CatalogOut, LimitsOut, OptionOut, RangeOut
from cuatro_tablas.domain import configuration as rules
from cuatro_tablas.domain.catalog import Catalog


def _range(bounds: tuple[int, int]) -> RangeOut:
    return RangeOut(min=bounds[0], max=bounds[1])


def build_catalog_router(catalog: Catalog) -> APIRouter:
    router = APIRouter(tags=["catalog"])

    @router.get("/catalog", response_model=CatalogOut)
    def get_catalog() -> CatalogOut:
        """Options and limits the configurator needs. Prices are never exposed."""
        return CatalogOut(
            materials=[OptionOut(id=m.id, name=m.name) for m in catalog.materials.values()],
            finishes=[OptionOut(id=f.id, name=f.name) for f in catalog.finishes.values()],
            limits=LimitsOut(
                width_cm=_range(rules.WIDTH_RANGE),
                depth_cm=_range(rules.DEPTH_RANGE),
                height_cm=_range(rules.HEIGHT_RANGE),
                top_thickness_cm=_range(rules.THICKNESS_RANGE),
                leg_section_cm=_range(rules.LEG_SECTION_RANGE),
            ),
        )

    return router
