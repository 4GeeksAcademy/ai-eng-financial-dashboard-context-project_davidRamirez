# Funcionalidades del dashboard

Las rutas y restricciones siguientes se contrastaron con el esquema OpenAPI publicado en `/docs`. Los ejemplos de respuesta son ilustrativos. Los estados de UI descritos son el comportamiento previsto en la [especificacion de componentes](../specs/components.md).

Los tipos compartidos estan en [api-types.ts](../specs/api-types.ts), [param-types.ts](../specs/param-types.ts) y [financial-types.ts](../src/lib/financial-types.ts). Todas las peticiones son `GET`; sus parametros son opcionales y deben omitirse cuando no tienen valor.

## Parametros comunes

| Parametro | Tipo | Valores y restricciones |
| --- | --- | --- |
| `start_date` | `string` | Fecha inicial inclusiva, `YYYY-MM-DD`; sin valor no hay limite inferior. |
| `end_date` | `string` | Fecha final inclusiva, `YYYY-MM-DD`; sin valor no hay limite superior. |
| `category` | `Category` | `suppliers`, `sales`, `operational`, `administrative` u `others`. |
| `operation_type` | `OperationType` | `income` o `outcome`. |
| `business_type` | `BusinessType` | `B2B` o `B2C`; si se omite, incluye ambos. |

Las fechas deben ser fechas validas. La UI debe rechazar un inicio posterior al fin, aunque la API no valida explicitamente ese orden. Un valor fuera de los tipos o limites del esquema puede producir una respuesta `422`.

## 1. Filtro de fechas

| Endpoint | Tipo de peticion | Tipo de respuesta |
| --- | --- | --- |
| `GET /api/metrics/facets` | Sin parametros | `FacetsResponse` |
| `GET /api/metrics` | `MovementParams` | `FinancialMovement[]` |

Para esta funcionalidad se envia `DateRangeFilter`. El endpoint de movimientos tambien admite `category` y `operation_type`:

```ts
type MovementParams = DateRangeFilter & {
  category?: Category
  operation_type?: OperationType
}
```

Ejemplo de peticion: `GET /api/metrics?start_date=2026-02-01&end_date=2026-02-28`. Sin fechas se incluyen todos los movimientos; `category` y `operation_type` tampoco filtran si se omiten.

Ejemplo de respuesta `FinancialMovement[]`:

```json
[
  {
    "create_date": "2026-02-12",
    "amount": 1500,
    "operation_type": "income",
    "category": "sales",
    "business_type": "B2B"
  }
]
```

- **Sin movimientos en el rango:** mostrar estado vacio y KPI y graficos coherentes con una lista vacia, sin conservar resultados anteriores como actuales.
- **Inicio posterior al fin o fecha invalida:** mostrar error de validacion y mantener el rango aplicado anterior; no enviar la consulta invalida.
- **Un solo limite o ambos vacios:** mostrar resultados desde o hasta el limite indicado; sin limites mostrar todos. El rango disponible proviene de `FacetsResponse`, no de fechas fijas.

## 2. Alertas de gastos

| Endpoint | Tipo de peticion | Tipo de respuesta |
| --- | --- | --- |
| `GET /api/metrics/alerts` | `AlertsParams` | `AlertsResponse` (`AlertEntry[]`) |

Ademas de `start_date`, `end_date` y `business_type`, admite:

| Parametro | Tipo | Valores y restricciones |
| --- | --- | --- |
| `threshold` | `number` | Ratio entre `0.01` y `1`, inclusive; por defecto `0.3` (30 %). |
| `group_by` | `'day' \| 'week' \| 'month'` | Agrupacion diaria, semanal o mensual; por defecto `month`. |

Ejemplo de peticion: `GET /api/metrics/alerts?threshold=0.3&group_by=month`.

Ejemplo de respuesta `AlertsResponse`:

```json
[
  {
    "period": "2026-03",
    "outcome_total": 1300,
    "baseline_average": 1000,
    "increase_ratio": 0.3
  }
]
```

La tabla muestra periodo, gasto, media de los tres periodos anteriores y `increase_ratio * 100` como porcentaje. El backend emite una alerta cuando el ratio calculado supera estrictamente el umbral; el ratio de respuesta se redondea, por lo que puede coincidir con el umbral visualmente.

- **Sin alertas:** mantener la tabla y mostrar una fila de estado vacio.
- **Menos de tres periodos anteriores o media cero:** la API no emite alerta para ese periodo; no mostrar porcentajes infinitos ni fabricar filas.
- **Umbral fuera del intervalo:** mostrar error en el input y conservar el umbral aplicado. Para rangos que empiezan a mitad del historial, la API utiliza periodos anteriores al rango para la media.

## 3. Comparacion B2B y B2C

| Endpoint | Tipo de peticion | Tipo de respuesta |
| --- | --- | --- |
| `GET /api/metrics/categories/top` | `TopCategoriesParams` | `TopCategoriesResponse` (`CategoryEntry[]`) |
| `GET /api/metrics/b2b` | `MovementParams` | `FinancialMovement[]` |
| `GET /api/metrics/b2c` | `MovementParams` | `FinancialMovement[]` |

`TopCategoriesParams` acepta las fechas y `business_type` de la tabla comun, ademas de:

| Parametro | Tipo | Valores y restricciones |
| --- | --- | --- |
| `operation_type` | `OperationType` | `income` u `outcome`; por defecto `outcome`. |
| `limit` | `number` | Entero entre `1` y `20`, inclusive; por defecto `5`. |

Los endpoints de movimientos B2B y B2C aceptan fechas, `category` y `operation_type`; el negocio lo determina la ruta. Para la comparacion de ingresos, solicitar el top con `operation_type=income`, `limit=5` y `business_type` igual a `B2B` o `B2C`; pedir movimientos de ingresos con el mismo rango para calcular el total de cada negocio.

Ejemplo de peticion: `GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B`.

Ejemplo de respuesta `TopCategoriesResponse`:

```json
[
  {
    "category": "sales",
    "operation_type": "income",
    "total_amount": 1500
  }
]
```

Cada tabla muestra categoria, importe y porcentaje respecto al total de ingresos del negocio, no solo al importe del top.

- **Sin categorias para uno de los negocios:** mostrar una fila de estado vacio en su tabla y conservar la otra tabla.
- **Total de ingresos cero:** mostrar `0 %` y evitar la division por cero.
- **Menos de cinco categorias:** mostrar solo las devueltas, en orden descendente; no inventar categorias adicionales.

En las tres funcionalidades, un fallo de red o de la API debe mostrar un error y permitir reintentar; no debe confundirse con una respuesta vacia.