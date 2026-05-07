import { useState } from 'react';

export default function FileUploader({ fileName, onFileUpload, error, isLoading }) {
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFileUpload(file);
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.06]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Upload CSV</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">Drop a comma-separated file here and the dashboard will profile it in your browser.</p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">Private</span>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`group relative overflow-hidden rounded-[1.7rem] border border-dashed p-8 text-center transition duration-300 ${
          isDragging
            ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-500/10'
            : 'border-slate-300 bg-slate-50/80 hover:border-cyan-400 hover:bg-cyan-50/70 dark:border-white/15 dark:bg-white/[0.04] dark:hover:border-cyan-300/60 dark:hover:bg-cyan-400/10'
        }`}
      >
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-violet-500 text-white shadow-lg shadow-cyan-500/25 transition duration-300 group-hover:scale-105">
          <UploadIcon className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-xl font-black tracking-tight text-slate-950 dark:text-white">Drag and drop your CSV</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">Supports `.csv` files with headers. Large files may take a moment to chart.</p>
        <label className="mt-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-600 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-100">
          Select CSV
          <input type="file" accept=".csv,text/csv" className="sr-only" onChange={onFileUpload} />
        </label>
      </div>

      {isLoading && (
        <div className="mt-4 rounded-2xl bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-800 ring-1 ring-cyan-500/20 dark:text-cyan-200">
          Analyzing {fileName || 'CSV'}...
        </div>
      )}
      {fileName && !isLoading && <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">Loaded: {fileName}</p>}
      {error && <p className="mt-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-200">{error}</p>}
    </section>
  );
}

function UploadIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 16V4m0 0L7 9m5-5 5 5M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}
