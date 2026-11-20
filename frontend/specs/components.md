# Especificacion de componentes

Estos contratos son una propuesta para las tres funcionalidades. No describen componentes nuevos ya implementados. Los tipos de respuestas y parametros se importan de `frontend/specs/api-types.ts` y `frontend/specs/param-types.ts`; `BusinessType`, `FinancialMovement`, `KPIMetrics` y `MonthlyDataPoint` proceden de `frontend/src/lib/financial-types.ts`.

## Estado compartido

```ts
type LoadState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T }
```

Los contenedores consultan la API y gestionan el estado; los componentes de presentacion reciben datos y acciones por props. Un error muestra un mensaje y una accion para reintentar; una respuesta vacia no es un error. Las solicitudes anteriores no deben sobrescribir los resultados de filtros aplicados posteriormente.

## Filtro de fechas

`DateRangeFilter` es el tipo de parametros, no el componente. Se propone un componente `DateRangeForm` con estas props:

```ts
interface DateRangeFormProps {
  facets: LoadState<FacetsResponse>
  appliedRange: DateRangeFilter
  onApply: (range: DateRangeFilter) => void
  onRetryFacets: () => void
}
```

- `GET /api/metrics/facets` proporciona el rango disponible; mostrar `min_date` y `max_date` sin fijarlos en codigo.
- Los campos editables son un borrador local; solo `onApply` cambia el rango aplicado. Cada extremo es opcional, inclusivo y utiliza `YYYY-MM-DD`; omitir las fechas vacias de la consulta. Limpiar ambos campos y aplicar elimina el filtro.
- Rechazar fechas invalidas o un inicio posterior al fin, mostrando el error sin cambiar el rango aplicado. El rango disponible es informativo: no se restringen los campos a sus limites. Un rango sin movimientos produce resultados vacios.
- Consultar `GET /api/metrics` con el rango aplicado y calcular los KPI y series mensuales en el cliente mediante las utilidades existentes. Actualizar alertas con el mismo rango aplicado del dashboard.
- El dashboard y la pagina de comparacion conservan sus propios filtros, como en la implementacion actual; no se sincronizan entre paginas sin una decision adicional.

Los componentes existentes `KPIRow`, `IncomeOutcomeChart` y `ProfitPercentChart` siguen recibiendo los datos derivados de `FinancialMovement[]`, `KPIMetrics` y `MonthlyDataPoint[]` segun sus contratos actuales.

## Alertas de gastos

Se proponen un contenedor `AlertsSection` y una tabla `AlertsTable` debajo de los graficos:

```ts
interface AlertsSectionProps {
  range: DateRangeFilter
  businessType?: BusinessType
}

interface AlertsTableProps {
  alerts: AlertsResponse
}
```

- El contenedor consulta `GET /api/metrics/alerts` con `AlertsParams`: rango aplicado, `business_type` cuando corresponda, `group_by: 'month'` y `threshold`. El umbral inicial es 0.3; el input acepta numeros entre 0.01 y 1, inclusive. Aplicar un valor invalido muestra un error y conserva el ultimo umbral aplicado.
- La tabla presenta periodo, `outcome_total`, `baseline_average` e `increase_ratio * 100`, con importes formateados y porcentaje visible. Usar los valores devueltos por la API, sin recalcular el ratio a partir de importes redondeados.
- La media es la suma de los tres periodos anteriores dividida entre tres; el ratio es `(gasto actual - media) / media`. Se alerta solo cuando el ratio supera estrictamente el umbral.
- El backend usa el historial completo del negocio seleccionado para los tres periodos anteriores, incluso si estan fuera del rango solicitado. Si hay menos de tres periodos anteriores o la media es cero, no emite alerta. Los periodos son los que existen en los datos, sin rellenar periodos ausentes.
- Los limites de fechas filtran movimientos antes de agrupar: un mes parcial muestra el gasto de los movimientos incluidos, mientras que los periodos historicos anteriores se calculan con el historial completo.
- Si la respuesta esta vacia, mantener la tabla y mostrar una fila de estado vacio. La carga y el error se gestionan por separado de los resultados del resto del dashboard.

## Comparacion B2B y B2C

La pagina existente `BusinessComparisonPage` es el contenedor. Se propone que delegue cada tabla a `CategoryTable` con datos de la fase 2:

```ts
interface CategoryTableProps {
  businessType: BusinessType
  categories: TopCategoriesResponse
  totalIncome: number
}
```

- Para cada negocio, consultar `GET /api/metrics/categories/top` con `TopCategoriesParams`: `business_type` igual a `B2B` o `B2C`, `operation_type: 'income'`, `limit: 5` y el rango aplicado de la pagina.
- Consultar tambien los movimientos de ingresos de `/api/metrics/b2b` y `/api/metrics/b2c` con ese mismo rango. `totalIncome` es la suma de todos los ingresos del negocio, no solo de las categorias del top cinco.
- Cada tabla muestra `category`, `total_amount` y el porcentaje `total_amount / totalIncome * 100`. Si el total es cero, mostrar 0 % y evitar la division por cero. Conservar el orden descendente de la respuesta y no fabricar categorias ausentes.
- Cada negocio puede devolver menos de cinco categorias o ninguna; mostrar una fila de estado vacio en su tabla. La carga y los errores de la comparacion deben ser visibles y permitir reintentar las solicitudes con los filtros aplicados.

## Comprobaciones de implementacion

- Verificar fechas abiertas, limites inclusivos, rango invertido, limpieza y rango sin datos; comprobar que no se envian parametros vacios.
- Verificar umbrales extremos y fuera de rango, respuesta vacia, historial insuficiente, media cero y fechas que cortan un mes; comprobar que el historial anterior sigue disponible.
- Verificar que ambas consultas B2B/B2C usan el mismo rango, que el porcentaje utiliza todos los ingresos del negocio y que los estados vacio, carga y error no se confunden.