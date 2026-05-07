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
    <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/[0.06]">
      <div className="mb-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Visualization</p>
        <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 dark:text-white">Automatic Charts</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Categorical columns use bar charts. Numeric columns use histogram-style line charts.</p>
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
    <article className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:bg-white hover:shadow-lg dark:border-white/10 dark:bg-white/[0.05] dark:hover:border-cyan-300/40 dark:hover:bg-white/[0.08]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="min-w-0 truncate text-sm font-bold text-slate-900 dark:text-white">{column.name}</h3>
        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-500 ring-1 ring-slate-200 dark:bg-white/10 dark:text-slate-300 dark:ring-white/10">{isNumeric ? 'Histogram' : 'Bar chart'}</span>
      </div>

      <div className="h-72 rounded-3xl bg-white p-3 ring-1 ring-slate-200 dark:bg-[#0d1422] dark:ring-white/10">
        <ResponsiveContainer width="100%" height="100%">
          {isNumeric ? (
            <LineChart data={data} margin={{ top: 12, right: 12, bottom: 12, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.65} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval="preserveStartEnd" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid rgba(148, 163, 184, 0.3)', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.14)' }} />
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} dot={{ r: 3, fill: '#06b6d4' }} activeDot={{ r: 6 }} />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 12, right: 12, bottom: 12, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.65} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval="preserveStartEnd" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid rgba(148, 163, 184, 0.3)', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.14)' }} />
              <Bar dataKey="value" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </article>
  );
}
