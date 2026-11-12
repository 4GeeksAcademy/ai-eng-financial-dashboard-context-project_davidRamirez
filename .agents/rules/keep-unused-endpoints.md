# No borrar endpoints no usados por la UI

## Regla

No elimines ni fusiones rutas de métricas solo porque el dashboard no las llama.

Conserva, salvo petición explícita:

- `GET /health`
- `GET /api/metrics`
- `GET /api/metrics/facets`
- `GET /api/metrics/summary`
- `GET /api/metrics/categories/top`
- `GET /api/metrics/comparison`
- `GET /api/metrics/alerts`
- `GET /api/metrics/b2b`
- `GET /api/metrics/b2c`

## Hecho del repo

`frontend/src/App.tsx` solo hace fetch de `/api/metrics`. Esas rutas adicionales están implementadas en `backend/app/routes.py` y cubiertas por `backend/tests/test_routes.py`.
