import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getCategoricalChartData, getNumericChartData } from '../utils/analysis';

export default function AutoCharts({ rows, columns }) {
  if (!rows.length || !columns.length) return null;

  const selectedColumns = columns.slice(0, 6);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-ink">Automatic Charts</h2>
        <p className="text-sm text-slate-600">Categorical columns use bar charts. Numeric columns use histogram-style line charts.</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {selectedColumns.map((column) => (
          <ChartCard key={column.name} rows={rows} column={column} />
        ))}
      </div>
    </section>
  );
}

function ChartCard({ rows, column }) {
  const isNumeric = column.type === 'number';
  const data = isNumeric ? getNumericChartData(rows, column.name) : getCategoricalChartData(rows, column.name);

  return (
    <article className="rounded-md border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="min-w-0 truncate text-sm font-semibold text-slate-800">{column.name}</h3>
        <span className="shrink-0 text-xs font-medium text-slate-500">{isNumeric ? 'Histogram' : 'Bar chart'}</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {isNumeric ? (
            <LineChart data={data} margin={{ top: 12, right: 12, bottom: 12, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 12, right: 12, bottom: 12, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </article>
  );
}
