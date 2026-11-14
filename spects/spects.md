
Especificación final: filtro de fechas
Objetivo
Permitir filtrar los movimientos financieros por fecha y actualizar los KPI y gráficos con los resultados filtrados.

Endpoints

GET /api/metrics/facets: obtiene el rango de fechas disponible.
GET /api/metrics: devuelve los movimientos, con filtros opcionales.
Rango disponible verificado
Según la respuesta guardada en spects.json, el rango actual es 2025-11-01 a 2026-10-28. Las facetas también indican los tipos income y outcome, negocios B2B y B2C, y categorías administrative, operational, others, sales y suppliers. El rango debe obtenerse de /api/metrics/facets, no fijarse permanentemente en el código.

Parámetros

start_date: opcional, formato YYYY-MM-DD; incluye movimientos desde esa fecha.
end_date: opcional, formato YYYY-MM-DD; incluye movimientos hasta esa fecha.
Ambos límites son inclusivos. Se pueden enviar juntos o por separado; si se omiten ambos, se devuelven todos los movimientos.
Ejemplo:

 GET /api/metrics?start_date=2026-02-01&end_date=2026-02-28
 
Comportamiento esperado

Al cargar el dashboard, consultar /api/metrics/facets y mostrar su min_date y max_date como rango disponible.
Al aplicar el filtro, enviar solamente los parámetros que tengan valor.
Calcular KPI y series mensuales usando los movimientos que devuelve /api/metrics.
Si el rango no coincide con ningún movimiento, la API devuelve una lista vacía. La implementación actual no impone en los campos de fecha los límites de las facetas ni valida explícitamente que start_date sea anterior o igual a end_date; estos casos deben considerarse al definir pruebas o ajustes de UI.