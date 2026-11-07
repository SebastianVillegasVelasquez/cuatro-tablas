from collections.abc import Sequence
from dataclasses import asdict

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from cuatro_tablas.api.routers.catalog import build_catalog_router
from cuatro_tablas.api.routers.quotes import build_quotes_router
from cuatro_tablas.domain.catalog import DEFAULT_CATALOG, Catalog
from cuatro_tablas.domain.pricing import InvalidConfiguration


def create_app(
    catalog: Catalog = DEFAULT_CATALOG,
    cors_origins: Sequence[str] = (),
) -> FastAPI:
    app = FastAPI(title="4-tablas API", version="0.1.0")

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

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(build_catalog_router(catalog))
    app.include_router(build_quotes_router(catalog))
    return app
