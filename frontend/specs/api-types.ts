import type { BusinessType, Category, OperationType } from '../src/lib/financial-types'

export interface FacetsResponse {
  /** Tipos disponibles: `income` y `outcome`. */
  operation_types: OperationType[]
  /** Tipos de negocio disponibles: `B2B` y `B2C`. */
  business_types: BusinessType[]
  /** Categorias disponibles: `suppliers`, `sales`, `operational`, `administrative` y `others`. */
  categories: Category[]
  /** Primera fecha disponible, en formato `YYYY-MM-DD`. */
  min_date: string
  /** Ultima fecha disponible, en formato `YYYY-MM-DD`. */
  max_date: string
}

export interface AlertEntry {
  /** Periodo: `YYYY-MM-DD` para dia, `YYYY-Www` para semana o `YYYY-MM` para mes. */
  period: string
  /** Gasto total registrado durante el periodo. */
  outcome_total: number
  /** Media de gastos de los tres periodos anteriores; mayor que cero para una alerta. */
  baseline_average: number
  /** Incremento respecto a la media, como ratio; por ejemplo, 0.3 representa un 30 %. */
  increase_ratio: number
}

/** Lista de alertas; puede estar vacia. */
export type AlertsResponse = AlertEntry[]

export interface CategoryEntry {
  /** Categoria: `suppliers`, `sales`, `operational`, `administrative` u `others`. */
  category: Category
  /** Tipo de movimiento: `income` o `outcome`. */
  operation_type: OperationType
  /** Importe total de la categoria para el tipo de movimiento seleccionado. */
  total_amount: number
}

/** Lista de categorias ordenadas por importe total descendente; puede estar vacia. */
export type TopCategoriesResponse = CategoryEntry[]