# 4-tablas

Configurador 3D de muebles a medida. El cliente ajusta medidas, material y
acabado, ve el mueble en 3D y recibe una cotización calculada por el backend.

Primer producto: mesa / escritorio a medida.

## Estructura

```
backend/    API y dominio (Python, FastAPI, uv)
frontend/   Interfaz y visor 3D (React, TypeScript, Vite)
```

## Run the backend

Requires [uv](https://docs.astral.sh/uv/).

```powershell
cd backend
uv sync
uv run pytest
uv run uvicorn cuatro_tablas.api.main:build_app --factory --reload
```

Interactive API docs: http://localhost:8000/docs

| Variable | Purpose | Default |
| --- | --- | --- |
| `TABLAS_DB_PATH` | SQLite file | `data/4tablas.db` |
| `TABLAS_CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173` |
| `TABLAS_ADMIN_API_KEY` | Enables `GET /admin/quote-requests` (header `X-API-Key`) | unset = admin disabled |

## Estado

En construcción. Los precios y límites de medidas del catálogo son **datos de
ejemplo** hasta validarlos con un carpintero real.

Las decisiones de diseño y convenciones están en [CLAUDE.md](CLAUDE.md).
