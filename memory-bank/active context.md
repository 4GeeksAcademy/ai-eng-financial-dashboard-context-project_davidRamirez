Resumen del estado actual del sistema:
código y líneas que la confirman o la corrigen.

@router.get("/api/metrics/alerts", response_model=list[MetricsAlert])  ✅ 

def test_generate_mock_movements_returns_full_year_sorted_data():
    movements = generate_mock_movements(seed=42)

    assert len(movements) == 360
    assert movements == sorted(movements, key=lambda item: item.create_date) ✅
 
Read 
Completed with input: {
  "path": "/workspaces/ai-eng-financial-dashboard-context-project_davidRamirez/backend/Dockerfile"
}

Read , lines 1 to 40
Completed with input: {
  "path": "/workspaces/ai-eng-financial-dashboard-context-project_davidRamirez/frontend/src/components/dashboard/dashboard-header.tsx",
  "view_range": [
    1,
    40
  ]
}

Read 
Completed with input: {
  "path": "/workspaces/ai-eng-financial-dashboard-context-project_davidRamirez/backend/requirements.txt"
}

Read , lines 360 to 420
Completed with input: {
  "path": "/workspaces/ai-eng-financial-dashboard-context-project_davidRamirez/backend/app/routes.py",
  "view_range": [
    360,
    420
  ]
}

Read , lines 80 to 220
Completed with input: {
  "path": "/workspaces/ai-eng-financial-dashboard-context-project_davidRamirez/backend/tests/test_routes.py",
  "view_range": [
    80,
    220
  ]
}

Search for `auth|database|sqlalchemy|postgres|sqlite`                                                  ❌       

Read , lines 48 to 68
Completed with input: {
  "path": "/workspaces/ai-eng-financial-dashboard-context-project_davidRamirez/frontend/src/App.tsx",
  "view_range": [
    48,
    68
  ]
}

def _year_for_month(month: int, today: date) -> int:
    if month < today.month:
        return today.year 
    return today.year - 1                                                  ✅
 
def _year_for_month(month: int, today: date) -> int:
    if month < today.month:
        return today.year
    return today.year - 1                                                  ✅

<main className="dark min-h-screen bg-background text-foreground">         ✅

def test_filter_movements_by_date_includes_range_edges():
    movements = generate_mock_movements(seed=42)
    target_date = movements[0].create_date                                 ✅     
                                             
app = FastAPI(title="Financial Metrics API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)                                                                          ✅

Documentación API: http://localhost:8000/docs                              ✅    

Necesito los números de línea exactos de los puntos que el resumen afirma.

Read , lines 55 to 110
Completed with input: {
  "path": "/workspaces/ai-eng-financial-dashboard-context-project_davidRamirez/backend/app/routes.py",
  "view_range": [
    55,
    110
  ]
}

Read , lines 240 to 270
Completed with input: {
  "path": "/workspaces/ai-eng-financial-dashboard-context-project_davidRamirez/backend/app/routes.py",
  "view_range": [
    240,
    270
  ]
}

Read , lines 39 to 52
Completed with input: {
  "path": "/workspaces/ai-eng-financial-dashboard-context-project_davidRamirez/README.es.md",
  "view_range": [
    39,
    52
  ]
}

Read , lines 11 to 48
Completed with input: {
  "path": "/workspaces/ai-eng-financial-dashboard-context-project_davidRamirez/frontend/src/components/dashboard/kpi-row.tsx",
  "view_range": [
    11,
    48
  ]
}

Ran terminal command: ls -la .agents .agents/rules .agents/skills memory-bank 2>&1; echo "---"; ls -d .agents .agents/rules .agents/skills memory-bank 2>&1
Tool execution failed with exit code 2

El resumen es correcto. Lo contrasté con el código; solo hay dos matices de redacción, no errores de hecho.

## Qué hace el dashboard

El frontend pide solo `GET /api/metrics` y calcula los KPI en el cliente:

```15:33:frontend/src/App.tsx
async function fetchFinancialData(): Promise<FinancialMovement[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);
  // ...
}
// ...
setMetrics(computeKPIs(movements));
setMonthlyData(computeMonthlyData(movements));
```

```21:33:frontend/src/lib/financial-utils.ts
export function computeKPIs(movements: FinancialMovement[]): KPIMetrics {
  const totalIncome = movements
    .filter((m) => m.operation_type === "income")
    .reduce((sum, m) => sum + m.amount, 0);
  // ...
  const profit = totalIncome - totalOutcome;
  const profitPercent = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;
  return { totalIncome, totalOutcome, profit, profitPercent };
}
```

La UI es oscura, con cuatro tarjetas y dos gráficos:

```46:62:frontend/src/App.tsx
<main className="dark min-h-screen bg-background text-foreground">
  ...
  <DashboardHeader period="2024 - Full Year" />
  <KPIRow metrics={metrics} loading={loading} />
  <IncomeOutcomeChart data={monthlyData} loading={loading} />
  <ProfitPercentChart data={monthlyData} loading={loading} />
```

`kpi-row.tsx` muestra Total Income, Total Outcome, Profit y Profit Margin.

Matiz: el texto que se renderiza es `"2024 - Full Year"`, con guion. El valor por defecto del componente, que no se usa, lleva raya: `'2024 — Full Year'` en `dashboard-header.tsx`.

## Datos simulados, no un año 2024

No hay base de datos ni autenticación: `docker-compose.yml` solo define `frontend` y `backend`, y en el backend no hay referencias a auth ni a SQL.

Los endpoints usan semilla fija y generan 360 movimientos:

```93:101:backend/app/routes.py
def generate_mock_movements(seed: int | None = None) -> list[FinancialMovement]:
    if seed is not None:
        random.seed(seed)
    today = date.today()
    for month in range(1, 13):
        for _ in range(30):
            movements.append(_build_movement(month, income_probability, today))
```

```15:15:backend/tests/test_routes.py
assert len(movements) == 360
```

La fecha no es el año civil 2024. Depende de hoy:

```64:74:backend/app/routes.py
def _year_for_month(month: int, today: date) -> int:
    if month < today.month:
        return today.year
    return today.year - 1
# ...
movement_date = date(_year_for_month(month, today), month, movement_day)
```

Los campos del movimiento están en `financial-types.ts`: `create_date`, `amount`, `operation_type`, `category`, `business_type`.

## Arquitectura

Puertos y dependencia, en `docker-compose.yml`: frontend `5173`, backend `8000` y `5678`, y `frontend` depende de `backend`.

El puerto `5678` es el depurador, no otro servicio:

```10:12:backend/Dockerfile
EXPOSE 8000 5678
CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5678", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

El proxy de Vite:

```11:14:frontend/vite.config.ts
proxy: {
  "/api": {
    target: "http://backend:8000",
    changeOrigin: true,
```

El stack coincide con `package.json`: React `^19.2.4`, Recharts `^3.8.1`, Tailwind `^4.2.2`, Vite `^8.0.4`. FastAPI está en `requirements.txt`, sin versión fijada.

## API y tests

Rutas en `routes.py`:

- `/health` en la línea 243
- `/api/metrics` en la 248, con `seed=42` en la 255
- `/api/metrics/facets` en la 262
- `/api/metrics/summary` en la 268, `group_by` por defecto `"month"`
- `/api/metrics/categories/top` en la 287
- `/api/metrics/comparison` en la 305; compara el neto con el periodo anterior de igual duración
- `/api/metrics/alerts` en la 342
- `/api/metrics/b2b` en la 361 y `/api/metrics/b2c` en la 377

En el frontend solo aparece `/api/metrics`. Los demás endpoints tienen tests en `test_routes.py`: `test_metrics_facets_returns_filter_options_and_date_range`, `test_metrics_summary_by_month_returns_balances`, `test_top_categories_returns_limited_sorted_categories`, `test_metrics_comparison_returns_delta_fields` y `test_metrics_alerts_returns_anomaly_candidates`.

Matiz: el test de alertas comprueba el código 200 y la forma de la respuesta. No exige que haya alguna alerta.

`/docs` no está declarado en el código. Lo documenta `README.es.md` y FastAPI lo sirve por defecto, porque `main.py` no desactiva `docs_url`.

## Agentes

`AGENTS.md` pide `.agents/rules`, `.agents/skills` y `memory-bank`. Esos directorios no existen en el repo.

## Overiew del producto:

Dash board financiero diseñado para procesamiento de metricas contables garantizando seguridad mediante politica cors estrictas, añadiendo un sistema de backend modular para un rendimiento seguro y eficiente.