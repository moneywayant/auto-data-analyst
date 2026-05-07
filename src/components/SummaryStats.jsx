import { formatNumber } from '../utils/analysis';

export default function SummaryStats({ stats }) {
  if (!stats.length) return null;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/[0.06]">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Statistics</p>
      <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 dark:text-white">Numeric Summary</h2>
      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10">
        <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/80 dark:border-white/10 dark:bg-white/[0.06]">
              <th className="px-4 py-3 font-black text-slate-700 dark:text-slate-300">Column</th>
              <th className="px-4 py-3 font-black text-slate-700 dark:text-slate-300">Count</th>
              <th className="px-4 py-3 font-black text-slate-700 dark:text-slate-300">Average</th>
              <th className="px-4 py-3 font-black text-slate-700 dark:text-slate-300">Min</th>
              <th className="px-4 py-3 font-black text-slate-700 dark:text-slate-300">Max</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((item) => (
              <tr key={item.column} className="border-b border-slate-100 transition hover:bg-cyan-50/70 last:border-0 dark:border-white/5 dark:hover:bg-cyan-400/10">
                <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{item.column}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.count}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatNumber(item.average)}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatNumber(item.min)}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatNumber(item.max)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  );
}
