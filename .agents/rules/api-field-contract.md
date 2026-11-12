# Contrato de campos de la API

## Regla

No renombres los campos de un movimiento financiero.

- En la API y en el tipo compartido del frontend usa `snake_case`: `create_date`, `amount`, `operation_type`, `category`, `business_type`.
- Los KPI calculados en la UI se quedan en camelCase: `totalIncome`, `totalOutcome`, `profit`, `profitPercent`.

No conviertas el JSON de la API a camelCase ni los KPI a snake_case.

## Hecho del repo

`frontend/src/lib/financial-types.ts` define `FinancialMovement` en snake_case y `KPIMetrics` en camelCase. `backend/app/routes.py` usa los mismos nombres snake_case en el modelo `FinancialMovement`.
