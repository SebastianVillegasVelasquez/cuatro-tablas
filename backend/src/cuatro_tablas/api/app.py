from collections.abc import Sequence
from dataclasses import asdict

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from cuatro_tablas.api.routers.admin import build_admin_router
from cuatro_tablas.api.routers.catalog import build_catalog_router
from cuatro_tablas.api.routers.quote_requests import build_quote_requests_router
from cuatro_tablas.api.routers.quotes import build_quotes_router
from cuatro_tablas.domain.catalog import DEFAULT_CATALOG, Catalog
from cuatro_tablas.domain.pricing import InvalidConfiguration
from cuatro_tablas.domain.quote_request import InvalidContact, QuoteRequestRepository
from cuatro_tablas.infrastructure.memory_repository import InMemoryQuoteRequestRepository


def create_app(
    catalog: Catalog = DEFAULT_CATALOG,
    cors_origins: Sequence[str] = (),
    quote_requests: QuoteRequestRepository | None = None,
    admin_api_key: str | None = None,
) -> FastAPI:
    app = FastAPI(title="4-tablas API", version="0.1.0")
    repository = quote_requests if quote_requests is not None else InMemoryQuoteRequestRepository()

    if cors_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=list(cors_origins),
            allow_methods=["GET", "POST"],
            allow_headers=["Content-Type", "X-API-Key"],
        )

    @app.exception_handler(InvalidConfiguration)
    async def invalid_configuration(_: Request, exc: InvalidConfiguration) -> JSONResponse:
        return JSONResponse(
            status_code=422,
            content={"error": "invalid_configuration", "issues": [asdict(i) for i in exc.issues]},
        )

    @app.exception_handler(InvalidContact)
    async def invalid_contact(_: Request, exc: InvalidContact) -> JSONResponse:
        return JSONResponse(
            status_code=422, content={"error": "invalid_contact", "message": str(exc)}
        )

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(build_catalog_router(catalog))
    app.include_router(build_quotes_router(catalog))
    app.include_router(build_quote_requests_router(catalog, repository))
    if admin_api_key:  # without a key the admin API does not exist at all
        app.include_router(build_admin_router(repository, admin_api_key))
    return app
