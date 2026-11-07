from fastapi import APIRouter

from cuatro_tablas.api.schemas import QuoteOut, TableConfigurationIn
from cuatro_tablas.domain.catalog import Catalog
from cuatro_tablas.domain.pricing import calculate_quote


def build_quotes_router(catalog: Catalog) -> APIRouter:
    router = APIRouter(tags=["quotes"])

    @router.post("/quote", response_model=QuoteOut)
    def quote(configuration: TableConfigurationIn) -> QuoteOut:
        """Stateless price calculation. Returns only the total, not the cost breakdown."""
        result = calculate_quote(configuration.to_domain(), catalog)
        return QuoteOut(total_cop=result.total_cop)

    return router
