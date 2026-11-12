# No sincronizar en silencio la etiqueta de periodo

## Regla

No alinees por tu cuenta la etiqueta del encabezado con el generador de fechas, ni el generador con la etiqueta.

- La etiqueta renderizada es `2024 - Full Year`.
- Las fechas de la API dependen de `date.today()` mediante `_year_for_month`.

Si hay que unificarlas, hazlo solo cuando la tarea lo pida y cambia los dos lados junto con sus tests.

## Hecho del repo

`frontend/src/App.tsx` pasa `period="2024 - Full Year"` a `DashboardHeader`. En `backend/app/routes.py`, `_year_for_month` usa el año actual si el mes ya pasó y el año anterior en caso contrario. `generate_mock_movements` toma `today = date.today()`.
