# Los KPI del dashboard se calculan en el cliente

## Regla

El panel debe seguir pidiendo `GET /api/metrics` y calculando las tarjetas y las series con `computeKPIs` y `computeMonthlyData`.

No cambies el dashboard a `/api/metrics/summary`, `/api/metrics/comparison` u otra ruta agregada, salvo que la tarea lo pida de forma explícita.

## Hecho del repo

`frontend/src/App.tsx` hace fetch de `${API_BASE_URL}/api/metrics` y pasa el resultado a `computeKPIs` y `computeMonthlyData`, definidas en `frontend/src/lib/financial-utils.ts`.
