from fastapi import APIRouter

from cuatro_tablas.api.schemas import QuoteRequestCreatedOut, QuoteRequestIn
from cuatro_tablas.application.submit_quote_request import submit_quote_request
from cuatro_tablas.domain.catalog import Catalog
from cuatro_tablas.domain.quote_request import QuoteRequestRepository


def build_quote_requests_router(
    catalog: Catalog, repository: QuoteRequestRepository
) -> APIRouter:
    router = APIRouter(tags=["quote requests"])

    @router.post("/quote-requests", response_model=QuoteRequestCreatedOut, status_code=201)
    def create_quote_request(body: QuoteRequestIn) -> QuoteRequestCreatedOut:
        """Store a customer's request. The price is recomputed server-side."""
        request = submit_quote_request(
            body.configuration.to_domain(),
            body.contact.to_domain(),
            catalog=catalog,
            repository=repository,
        )
        return QuoteRequestCreatedOut(id=request.id, total_cop=request.quote.total_cop)

    return router
