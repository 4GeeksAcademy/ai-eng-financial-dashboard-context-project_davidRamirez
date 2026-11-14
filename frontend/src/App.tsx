import { useEffect, useState, type FormEvent } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { IncomeOutcomeChart } from "@/components/dashboard/income-outcome-chart";
import { ProfitPercentChart } from "@/components/dashboard/profit-percent-chart";
import {
  type FinancialMovement,
  type KPIMetrics,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface MetricsDateRange {
  min_date: string;
  max_date: string;
}

async function fetchFinancialData(
  startDate = "",
  endDate = "",
): Promise<FinancialMovement[]> {
  const params = new URLSearchParams();
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);
  const query = params.toString();
  const response = await fetch(
    `${API_BASE_URL}/api/metrics${query ? `?${query}` : ""}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

async function fetchMetricsDateRange(): Promise<MetricsDateRange> {
  const response = await fetch(`${API_BASE_URL}/api/metrics/facets`);
  if (!response.ok) {
    throw new Error(`Failed to fetch metrics date range: ${response.status}`);
  }
  return response.json();
}

function App() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [availableDateRange, setAvailableDateRange] =
    useState<MetricsDateRange | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchFinancialData(), fetchMetricsDateRange()])
      .then(([movements, dateRange]) => {
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
        setAvailableDateRange(dateRange);
      })
      .catch(() => {
        setError(
          "No se pudo cargar la informacion financiera. Revisa la API de backend.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function applyDateFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const movements = await fetchFinancialData(startDate, endDate);
      setMetrics(computeKPIs(movements));
      setMonthlyData(computeMonthlyData(movements));
    } catch {
      setError(
        "No se pudo cargar la informacion financiera. Revisa la API de backend.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <DashboardHeader period="2024 - Full Year" />

          <form
            onSubmit={applyDateFilter}
            className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-end"
          >
            <label className="flex flex-col gap-1 text-sm">
              <span>Start date</span>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>End date</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply
            </button>
            {availableDateRange ? (
              <p className="text-sm text-muted-foreground sm:ml-auto sm:pb-2">
                Available range: {availableDateRange.min_date} –{" "}
                {availableDateRange.max_date}
              </p>
            ) : null}
          </form>

          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              {error}
            </div>
          ) : null}

          <section aria-label="Key performance indicators">
            <KPIRow metrics={metrics} loading={loading} />
          </section>

          <section
            aria-label="Financial charts"
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
          >
            <IncomeOutcomeChart data={monthlyData} loading={loading} />
            <ProfitPercentChart data={monthlyData} loading={loading} />
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
