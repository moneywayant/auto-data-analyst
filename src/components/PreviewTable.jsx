export default function PreviewTable({ rows }) {
  if (!rows.length) return null;

  const columns = Object.keys(rows[0]);
  const previewRows = rows.slice(0, 10);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Data Preview</h2>
          <p className="text-sm text-slate-600">First 10 rows from the uploaded file.</p>
        </div>
        <span className="text-sm font-medium text-slate-500">{rows.length.toLocaleString()} rows</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {columns.map((column) => (
                <th key={column} className="whitespace-nowrap px-3 py-3 font-semibold text-slate-700">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-100 last:border-0">
                {columns.map((column) => (
                  <td key={column} className="max-w-64 truncate px-3 py-3 text-slate-700">
                    {String(row[column] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
