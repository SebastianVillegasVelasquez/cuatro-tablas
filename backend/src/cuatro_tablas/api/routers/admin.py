import secrets
from dataclasses import asdict
from decimal import ROUND_HALF_UP, Decimal

from fastapi import APIRouter, Depends, Header, HTTPException

from cuatro_tablas.api.schemas import (
    AdminQuoteRequestOut,
    ContactOut,
    LineItemOut,
    TableConfigurationIn,
)
from cuatro_tablas.domain.quote_request import QuoteRequest, QuoteRequestRepository


def _pesos(amount: Decimal) -> int:
    return int(amount.quantize(Decimal(1), rounding=ROUND_HALF_UP))


def _to_out(request: QuoteRequest) -> AdminQuoteRequestOut:
    return AdminQuoteRequestOut(
        id=request.id,
        created_at=request.created_at,
        configuration=TableConfigurationIn(**asdict(request.configuration)),
        contact=ContactOut(**asdict(request.contact)),
        items=[
            LineItemOut(concept=i.concept, amount_cop=_pesos(i.amount))
            for i in request.quote.items
        ],
        subtotal_cop=_pesos(request.quote.subtotal),
        markup_rate=request.quote.markup_rate,
        total_cop=request.quote.total_cop,
    )


def build_admin_router(repository: QuoteRequestRepository, api_key: str) -> APIRouter:
    def require_api_key(x_api_key: str | None = Header(default=None)) -> None:
        if x_api_key is None or not secrets.compare_digest(
            x_api_key.encode(), api_key.encode()
        ):
            raise HTTPException(status_code=401, detail="Invalid or missing API key.")

    router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_api_key)])

    @router.get("/quote-requests", response_model=list[AdminQuoteRequestOut])
    def list_quote_requests() -> list[AdminQuoteRequestOut]:
        """Every request with contact data and cost breakdown, newest first."""
        return [_to_out(r) for r in repository.list_all()]

    return router
