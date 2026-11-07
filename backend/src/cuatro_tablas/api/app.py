from fastapi import FastAPI

from cuatro_tablas.api.routers.catalog import build_catalog_router
from cuatro_tablas.domain.catalog import DEFAULT_CATALOG, Catalog


def create_app(catalog: Catalog = DEFAULT_CATALOG) -> FastAPI:
    app = FastAPI(title="4-tablas API", version="0.1.0")

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(build_catalog_router(catalog))
    return app
