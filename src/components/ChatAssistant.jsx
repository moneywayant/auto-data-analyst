import { useMemo, useState } from 'react';
import { formatNumber } from '../utils/analysis';

const starterQuestions = [
  'What columns are in this dataset?',
  'Which numeric column has the highest average?',
  'Which department appears most often?',
  'What is the average salary?',
  'Give me 3 insights from this dataset',
];

export default function ChatAssistant({ rows, columns, stats, insights, isLoading }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Upload a CSV, then ask me about columns, averages, top categories, salary, or high-level insights.',
    },
  ]);
  const [draft, setDraft] = useState('');

  const context = useMemo(() => ({ rows, columns, stats, insights }), [rows, columns, stats, insights]);

  function askAssistant(question) {
    const trimmed = question.trim();
    if (!trimmed) return;

    const answer = buildAssistantAnswer(trimmed, context);
    setMessages((current) => [
      ...current,
      { role: 'user', text: trimmed },
      { role: 'assistant', text: answer },
    ]);
    setDraft('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    askAssistant(draft);
  }

  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/[0.07] xl:sticky xl:top-24">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-white shadow-lg shadow-cyan-500/20">
            <AssistantIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Local AI</p>
            <h2 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">Data Assistant</h2>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
          Offline
        </span>
      </div>

      <div className="mt-4 flex h-[26rem] flex-col gap-3 overflow-y-auto pr-1 sm:h-[30rem] xl:h-[34rem]">
        {messages.map((message, index) => (
          <ChatBubble key={`${message.role}-${index}`} message={message} />
        ))}
        {isLoading && (
          <div className="max-w-[86%] rounded-3xl rounded-bl-md bg-slate-100 px-4 py-3 dark:bg-white/10">
            <div className="h-3 w-36 animate-pulse rounded-full bg-slate-300 dark:bg-white/20" />
            <div className="mt-2 h-3 w-24 animate-pulse rounded-full bg-slate-300 dark:bg-white/20" />
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {starterQuestions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => askAssistant(question)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-xs font-bold text-slate-600 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:border-cyan-300/40 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-200"
          >
            {question}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              askAssistant(draft);
            }
          }}
          placeholder="Ask about this CSV..."
          className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-300/60 dark:focus:bg-white/[0.08]"
        />
        <button
          type="submit"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-cyan-600 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-100"
          aria-label="Send question"
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </form>
    </aside>
  );
}

function ChatBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? 'rounded-br-md bg-gradient-to-br from-cyan-500 to-violet-500 font-semibold text-white shadow-lg shadow-cyan-500/15'
            : 'rounded-bl-md bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

function buildAssistantAnswer(question, { rows, columns, stats, insights }) {
  if (!rows.length) {
    return 'Upload a CSV first and I can answer questions using the parsed data in this dashboard.';
  }

  const normalized = question.toLowerCase();

  if (matchesAny(normalized, ['column', 'field', 'headers'])) {
    return `This dataset has ${columns.length} columns: ${columns.map((column) => column.name).join(', ')}.`;
  }

  if (matchesAny(normalized, ['highest average', 'largest average', 'top average', 'highest mean'])) {
    const highest = [...stats].sort((a, b) => b.average - a.average)[0];
    return highest
      ? `${highest.column} has the highest average at ${formatNumber(highest.average)}.`
      : 'I could not find any numeric columns to compare averages.';
  }

  if (matchesAny(normalized, ['average salary', 'mean salary', 'salary average'])) {
    const salary = findStatByName(stats, ['salary', 'compensation', 'pay', 'wage', 'income']);
    return salary
      ? `The average ${salary.column} is ${formatNumber(salary.average)} across ${salary.count.toLocaleString()} numeric values.`
      : 'I could not find a numeric salary, compensation, pay, wage, or income column in this dataset.';
  }

  if (matchesAny(normalized, ['department', 'category', 'appears most', 'most often', 'most common', 'mode'])) {
    const preferredColumn = findCategoryColumn(columns, normalized);
    if (!preferredColumn) return 'I could not find a categorical column to count.';

    const topValue = getTopCategory(rows, preferredColumn.name);
    return topValue
      ? `${preferredColumn.name} appears most often as "${topValue.name}" with ${topValue.count.toLocaleString()} rows.`
      : `I could not find filled values in ${preferredColumn.name}.`;
  }

  if (matchesAny(normalized, ['3 insights', 'three insights', 'insights', 'summarize', 'summary'])) {
    return insights.slice(0, 3).map((insight, index) => `${index + 1}. ${insight}`).join(' ');
  }

  return 'I can answer local rule-based questions like: what columns are in this dataset, which numeric column has the highest average, which category appears most often, what is the average salary, or give me 3 insights.';
}

function findStatByName(stats, names) {
  return stats.find((item) => names.some((name) => item.column.toLowerCase().includes(name)));
}

function findCategoryColumn(columns, question) {
  const categoryColumns = columns.filter((column) => column.type === 'category');
  if (!categoryColumns.length) return null;

  const namedMatch = categoryColumns.find((column) => question.includes(column.name.toLowerCase()));
  if (namedMatch) return namedMatch;

  return (
    categoryColumns.find((column) => column.name.toLowerCase().includes('department')) ??
    categoryColumns.find((column) => column.name.toLowerCase().includes('category')) ??
    categoryColumns[0]
  );
}

function getTopCategory(rows, columnName) {
  const counts = rows.reduce((totals, row) => {
    const value = String(row[columnName] ?? '').trim();
    if (!value) return totals;
    totals[value] = (totals[value] || 0) + 1;
    return totals;
  }, {});

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)[0];
}

function matchesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function AssistantIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v3m7 6h2M3 12h2m12.5-6.5-2.1 2.1M6.6 17.4l-2.1 2.1M18 14.5V17a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-5a6 6 0 0 1 12 0v2.5Z" />
      <path d="M9 13h.01M15 13h.01M10 16h4" />
    </svg>
  );
}

function SendIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 14-7-7 14-2-5-5-2Z" />
      <path d="m10 14 4-4" />
    </svg>
  );
}
