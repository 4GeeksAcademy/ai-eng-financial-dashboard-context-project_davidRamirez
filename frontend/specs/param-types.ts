import type { BusinessType, OperationType } from '../src/lib/financial-types'

export interface DateRangeFilter {
  /** Fecha inicial inclusiva, opcional, en formato `YYYY-MM-DD`. */
  start_date?: string
  /** Fecha final inclusiva, opcional, en formato `YYYY-MM-DD`. */
  end_date?: string
}

export interface AlertsParams extends DateRangeFilter {
  /** Umbral de incremento como ratio, entre 0.01 y 1; por defecto, 0.3. */
  threshold?: number
  /** Agrupacion por `day`, `week` o `month`; por defecto, `month`. */
  group_by?: 'day' | 'week' | 'month'
  /** Filtra por tipo de negocio: `B2B` o `B2C`; si se omite, incluye ambos. */
  business_type?: BusinessType
}

export interface TopCategoriesParams extends DateRangeFilter {
  /** Tipo de movimiento: `income` o `outcome`; por defecto, `outcome`. */
  operation_type?: OperationType
  /** Numero maximo de categorias: entero entre 1 y 20; por defecto, 5. */
  limit?: number
  /** Filtra por tipo de negocio: `B2B` o `B2C`; si se omite, incluye ambos. */
  business_type?: BusinessType
}