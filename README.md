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

## Run the frontend

Requires Node.js. With the backend running on port 8000:

```powershell
cd frontend
npm install
npm run dev              # http://localhost:5173
npm test
npm run build
```

In development the app calls `/api/*`, which Vite proxies to
`http://127.0.0.1:8000`, so the backend must be running on port 8000. The
browser never makes a cross-origin request, so the dev hostname and port do not
matter. If the API and the app are deployed on different origins, set
`VITE_API_URL` in the frontend and list the app's origin in the backend's
`TABLAS_CORS_ORIGINS`.

## Estado

En construcción. Los precios y límites de medidas del catálogo son **datos de
ejemplo** hasta validarlos con un carpintero real.

Las decisiones de diseño y convenciones están en [CLAUDE.md](CLAUDE.md).
