"""Production-like entrypoint: wires real infrastructure from environment variables.

    uv run uvicorn cuatro_tablas.api.main:build_app --factory

Variables:
    TABLAS_DB_PATH          SQLite file (default: data/4tablas.db)
    TABLAS_CORS_ORIGINS     comma-separated allowed origins (default: Vite dev server)
    TABLAS_ADMIN_API_KEY    enables the admin API when set; leave unset to keep it off
"""

import os
from pathlib import Path

from fastapi import FastAPI

from cuatro_tablas.api.app import create_app
from cuatro_tablas.infrastructure.sqlite_repository import SQLiteQuoteRequestRepository

DEFAULT_DB_PATH = "data/4tablas.db"
DEFAULT_CORS_ORIGINS = "http://localhost:5173"


def build_app() -> FastAPI:
    origins = [
        o.strip()
        for o in os.environ.get("TABLAS_CORS_ORIGINS", DEFAULT_CORS_ORIGINS).split(",")
        if o.strip()
    ]
    return create_app(
        cors_origins=origins,
        quote_requests=SQLiteQuoteRequestRepository(
            Path(os.environ.get("TABLAS_DB_PATH", DEFAULT_DB_PATH))
        ),
        admin_api_key=os.environ.get("TABLAS_ADMIN_API_KEY") or None,
    )
