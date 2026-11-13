# Estado actual

El dashboard funciona contra datos mock deterministas. No hay persistencia ni usuarios.

## Datos y API

- La fuente de la API es `generate_mock_movements(seed=42)` en `backend/app/routes.py`: 360 movimientos, 30 por mes durante 12 meses.
- Las fechas no son el año civil 2024. `_year_for_month` usa `date.today()`.
- La etiqueta visible sigue siendo `2024 - Full Year`. Esa diferencia no está unificada.
- `frontend/src/lib/mock-data.ts` existe y nadie lo importa. No es la fuente del panel.
- El frontend solo llama a `GET /api/metrics` y calcula KPI y series en `frontend/src/lib/financial-utils.ts`.
- También existen, y tienen tests, `/health`, `/api/metrics/facets`, `/api/metrics/summary`, `/api/metrics/categories/top`, `/api/metrics/comparison`, `/api/metrics/alerts`, `/api/metrics/b2b` y `/api/metrics/b2c`. La UI no los usa.
- Los campos de un movimiento van en snake_case. Los KPI calculados van en camelCase.

## Agentes

- Las reglas aplicables están en `.agents/rules/`.
- No hay skills en `.agents/skills`.
- Este banco de memoria acaba de crearse. No sustituye a esas reglas.

## Estado Actual 

* Reglas de cors validadas y acceso protegido