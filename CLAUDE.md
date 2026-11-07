# 4-tablas

Configurador 3D de muebles a medida. Primer producto: mesa/escritorio.
Repositorio en GitHub: `cuatro-tablas`. Proyecto de portafolio para ofrecer
como servicio freelance a carpinterías y fabricantes de muebles.

## Stack

- `backend/`: Python + FastAPI, gestionado con **uv**. Paquete `cuatro_tablas`
  (layout `src/`). Pruebas con pytest.
- `frontend/`: React + TypeScript + **Vite**. Visor 3D con React Three Fiber.

## Decisiones de diseño

- La **configuración es dato puro**; el 3D es una *vista* de ese estado.
- El **dominio es puro** (`domain/`, sin FastAPI): precio y validación se
  prueban sin levantar un servidor.
- Reglas de precio como **Strategy**: agregar un concepto de costo = agregar
  una clase, no editar el motor.
- Dinero con `Decimal`, nunca `float`; el total sale como entero en COP.
- La validación devuelve **todas** las incidencias, no solo la primera.
- `markup_rate` es recargo sobre costo, **no margen** sobre venta.
- No abstraer a "plataforma multi-sector" hasta tener un segundo caso real.

## Datos de ejemplo

Precios, límites de medidas y la regla de tapa larga son **valores de ejemplo**.
No son cotizaciones reales. Validar con un carpintero antes de cualquier demo.

## Convenciones

- Commits: Conventional Commits in English. Atomic (one logical change each,
  tests green at every commit) and ordered so the history tells the story of
  how the system grew. No AI attribution trailers.
- TDD en el dominio: caso calculado a mano, independiente de la implementación.
- No versionar `.venv` ni `node_modules`. Si se trabaja desde una VM Linux
  sobre la carpeta de Windows, usar `UV_PROJECT_ENVIRONMENT` fuera del repo.

## Trabajo con el asistente

Sebas está aprendiendo ingeniería de nivel senior: explicar el porqué y los
trade-offs, cuestionar decisiones, y señalar los errores de forma explícita
(qué está mal, por qué, cómo corregirlo, qué lección queda).
El asistente avanza de forma autónoma y se detiene solo cuando necesita una
decisión de Sebas.
