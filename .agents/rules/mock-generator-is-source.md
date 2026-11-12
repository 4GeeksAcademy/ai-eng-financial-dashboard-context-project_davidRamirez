# El generador mock es la fuente de la API

## Regla

La fuente de datos de la API es `generate_mock_movements(seed=42)`.

- No sustituyas esa función por `frontend/src/lib/mock-data.ts`.
- No cambies la semilla ni el tamaño de 360 movimientos (12 meses × 30) sin actualizar `backend/tests/test_routes.py`.
- No reemplaces el generador por una base de datos.

## Hecho del repo

Los endpoints de `backend/app/routes.py` llaman a `generate_mock_movements(seed=42)`. `backend/tests/test_routes.py` afirma que esa llamada devuelve 360 movimientos ordenados por fecha. `frontend/src/lib/mock-data.ts` exporta `mockMovements` de 2024 y ningún archivo del frontend lo importa.
