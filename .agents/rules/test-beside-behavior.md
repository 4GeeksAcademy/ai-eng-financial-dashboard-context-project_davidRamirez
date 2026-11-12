# Probar junto al comportamiento que cambia

## Regla

- Un cambio de API se prueba con pytest en `backend/tests`, usando `TestClient`. No hace falta levantar Uvicorn.
- Un cambio de KPI o de series mensuales se prueba con Vitest en `frontend/src/lib/financial-utils.test.ts`, con fixtures locales. Esos tests no llaman a la API.
- Ejecuta solo el archivo de test del cambio. No lances toda la suite para un ajuste pequeño.

## Hecho del repo

`backend/tests/conftest.py` inserta el directorio del backend en `sys.path` para importar `app`. `backend/tests/test_routes.py` usa `TestClient(app)`. `frontend/src/lib/financial-utils.test.ts` importa `./financial-utils` y arma `FinancialMovement` en el propio archivo. El script de test del frontend es `vitest run`.
