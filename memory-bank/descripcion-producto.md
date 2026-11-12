# Descripción de producto

Panel de métricas financieras para un ejercicio de 4Geeks Academy. Muestra el estado de ingresos, gastos, beneficio y margen a partir de movimientos simulados.

## Qué ve el usuario

Un dashboard en tema oscuro, en inglés, con:

- cuatro tarjetas: Total Income, Total Outcome, Profit y Profit Margin
- un gráfico de ingreso frente a gasto
- un gráfico de margen
- la etiqueta de periodo `2024 - Full Year`

No hay login, filtros en pantalla ni persistencia. Si la API falla, se muestra el error en español: `No se pudo cargar la informacion financiera. Revisa la API de backend.`

## Unidad de negocio

Cada movimiento tiene fecha, importe, tipo (`income` o `outcome`), categoría (`sales`, `suppliers`, `operational`, `administrative`, `others`) y tipo de negocio (`B2B` o `B2C`).

El panel no edita esos movimientos. Solo los agrega.
