export default function ColumnTypes({ columns }) {
  if (!columns.length) return null;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/[0.06]">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Schema</p>
      <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 dark:text-white">Column Types</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {columns.map((column) => (
          <article key={column.name} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:bg-white hover:shadow-lg dark:border-white/10 dark:bg-white/[0.05] dark:hover:border-cyan-300/40 dark:hover:bg-white/[0.08]">
            <div className="flex items-start justify-between gap-3">
              <h3 className="break-words text-sm font-bold text-slate-900 dark:text-white">{column.name}</h3>
              <span className={column.type === 'number' ? badgeClass('teal') : badgeClass('amber')}>{column.type}</span>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div>
                <dt className="font-bold uppercase tracking-wide text-slate-500 dark:text-slate-500">Filled</dt>
                <dd className="mt-1 font-bold text-slate-900 dark:text-white">{column.filled}</dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-wide text-slate-500 dark:text-slate-500">Missing</dt>
                <dd className="mt-1 font-bold text-slate-900 dark:text-white">{column.missing}</dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-wide text-slate-500 dark:text-slate-500">Unique</dt>
                <dd className="mt-1 font-bold text-slate-900 dark:text-white">{column.unique}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function badgeClass(color) {
  const colors = {
    teal: 'bg-teal-500/10 text-teal-700 ring-teal-500/20 dark:text-teal-200',
    amber: 'bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-200',
  };

  return `shrink-0 rounded-full px-2.5 py-1 text-xs font-black ring-1 ${colors[color]}`;
}
