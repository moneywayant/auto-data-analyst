import { useMemo, useState } from 'react';
import Papa from 'papaparse';
import AutoCharts from './components/AutoCharts';
import ChatAssistant from './components/ChatAssistant';
import ColumnTypes from './components/ColumnTypes';
import FileUploader from './components/FileUploader';
import Insights from './components/Insights';
import PreviewTable from './components/PreviewTable';
import SummaryStats from './components/SummaryStats';
import { detectColumns, generateInsights, getNumericStats, normalizeRows } from './utils/analysis';

export default function App() {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const columns = useMemo(() => detectColumns(rows), [rows]);
  const stats = useMemo(() => getNumericStats(rows, columns), [rows, columns]);
  const insights = useMemo(() => generateInsights(rows, columns, stats), [rows, columns, stats]);

  function handleFileUpload(fileOrEvent) {
    const file = fileOrEvent?.target?.files?.[0] ?? fileOrEvent;
    if (!file) return;

    setFileName(file.name);
    setError('');
    setRows([]);
    setIsLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length) {
          setError(result.errors[0].message);
          setRows([]);
          setIsLoading(false);
          return;
        }

        const parsedRows = normalizeRows(result.data).filter((row) =>
          Object.values(row).some((value) => String(value ?? '').trim() !== ''),
        );

        if (!parsedRows.length) {
          setError('No rows were found in this CSV file.');
          setRows([]);
          setIsLoading(false);
          return;
        }

        setRows(parsedRows);
        setIsLoading(false);
      },
      error: (parseError) => {
        setError(parseError.message);
        setRows([]);
        setIsLoading(false);
      },
    });
  }

  return (
    <main className={isDark ? 'dark min-h-screen' : 'min-h-screen'}>
      <div className="app-surface min-h-screen overflow-hidden bg-slate-50 text-slate-950 transition-colors duration-500 dark:bg-[#090e18] dark:text-white">

        <nav className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#090e18]/78">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-white shadow-lg shadow-cyan-500/20">
                <Icon name="spark" className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-tight">Auto Data Analyst</p>
                <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">Browser-native CSV intelligence</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-100/80 p-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 md:flex">
              <a href="#upload" className="rounded-full px-3 py-1.5 transition hover:bg-white hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white">Upload</a>
              <a href="#insights" className="rounded-full px-3 py-1.5 transition hover:bg-white hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white">Insights</a>
              <a href="#charts" className="rounded-full px-3 py-1.5 transition hover:bg-white hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white">Charts</a>
              <a href="#assistant" className="rounded-full px-3 py-1.5 transition hover:bg-white hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white">Assistant</a>
            </div>
            <button
              type="button"
              onClick={() => setIsDark((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-300/50"
            >
              <Icon name={isDark ? 'sun' : 'moon'} className="h-4 w-4" />
              <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </nav>

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-8 md:pt-12">
          <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-200">
                <Icon name="chart" className="h-3.5 w-3.5" />
                CSV analytics workspace
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-6xl">
                Turn raw spreadsheets into a polished analyst dashboard.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
                Upload a CSV and get column profiling, summary statistics, automatic charts, data preview, and plain-English insights without sending your file to a server.
              </p>
              <div className="mt-7 grid grid-cols-3 gap-3 sm:max-w-xl">
                <Metric label="Rows" value={rows.length} icon="rows" />
                <Metric label="Columns" value={columns.length} icon="columns" />
                <Metric label="Numeric" value={columns.filter((column) => column.type === 'number').length} icon="hash" />
              </div>
            </div>

            <div id="upload">
              <FileUploader fileName={fileName} error={error} isLoading={isLoading} onFileUpload={handleFileUpload} />
            </div>
          </section>

          {!rows.length && !isLoading && (
            <section className="mt-8 rounded-[2rem] border border-dashed border-slate-300 bg-white/65 p-8 text-center shadow-soft backdrop-blur dark:border-white/15 dark:bg-white/[0.04]">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">Ready for your first CSV</h2>
              <p className="mx-auto mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
                Try a sales export, survey results, customer list, finance data, or any spreadsheet saved as CSV.
              </p>
            </section>
          )}

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="min-w-0">
              {isLoading ? (
                <LoadingDashboard />
              ) : (
                <div className="grid gap-6">
                <div id="insights">
                  <Insights insights={insights} />
                </div>
                <div className="grid gap-6 2xl:grid-cols-[1fr_1.1fr]">
                  <ColumnTypes columns={columns} />
                  <SummaryStats stats={stats} />
                </div>
                <div id="charts">
                  <AutoCharts rows={rows} columns={columns} />
                </div>
                <PreviewTable rows={rows} />
              </div>
              )}
            </div>
            <div id="assistant" className="min-w-0">
              <ChatAssistant rows={rows} columns={columns} stats={stats} insights={insights} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value, icon }) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-300 dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-cyan-300/40">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-cyan-700 dark:bg-white/10 dark:text-cyan-200">
        <Icon name={icon} className="h-4 w-4" />
      </div>
      <p className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">{Number(value).toLocaleString()}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function LoadingDashboard() {
  return (
    <section className="mt-8 grid gap-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/[0.05]">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 animate-ping rounded-full bg-cyan-400" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Profiling columns and preparing charts...</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-white/10" />
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-soft dark:border-white/10 dark:bg-white/[0.05]">
            <div className="h-5 w-44 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
            <div className="mt-5 h-64 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-white/10" />
          </div>
        ))}
      </div>
    </section>
  );
}

function Icon({ name, className }) {
  const icons = {
    chart: <path d="M4 19V5m6 14V9m6 10V3m4 16H2" />,
    columns: <path d="M4 5h16M4 12h16M4 19h16M8 5v14m8-14v14" />,
    hash: <path d="M5 9h14M5 15h14M10 3 8 21m8-18-2 18" />,
    moon: <path d="M20.4 14.5A8.5 8.5 0 0 1 9.5 3.6 8.5 8.5 0 1 0 20.4 14.5Z" />,
    rows: <path d="M4 6h16M4 12h16M4 18h16" />,
    spark: <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2Zm7 13 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" />,
    sun: <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.7-5.7 1.4-1.4M4.9 19.1l1.4-1.4m0-11.4L4.9 4.9m14.2 14.2-1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />,
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}
