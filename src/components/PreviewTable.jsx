export default function PreviewTable({ rows }) {
  if (!rows.length) return null;

  const columns = Object.keys(rows[0]);
  const previewRows = rows.slice(0, 10);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/[0.06]">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Preview</p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 dark:text-white">Data Preview</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">First 10 rows from the uploaded file.</p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{rows.length.toLocaleString()} rows</span>
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10">
        <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/80 dark:border-white/10 dark:bg-white/[0.06]">
              {columns.map((column) => (
                <th key={column} className="whitespace-nowrap px-4 py-3 font-black text-slate-700 dark:text-slate-300">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-100 transition hover:bg-cyan-50/70 last:border-0 dark:border-white/5 dark:hover:bg-cyan-400/10">
                {columns.map((column) => (
                  <td key={column} className="max-w-64 truncate px-4 py-3 text-slate-700 dark:text-slate-300">
                    {String(row[column] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  );
}
