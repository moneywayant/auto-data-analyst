export default function Insights({ insights }) {
  if (!insights.length) return null;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/[0.06]">
      <SectionTitle eyebrow="Narrative" title="Simple Insights" />
      <ul className="mt-5 grid gap-3 md:grid-cols-2">
        {insights.map((insight) => (
          <li key={insight} className="group rounded-3xl border border-slate-200 bg-slate-50/90 px-4 py-4 text-sm leading-6 text-slate-700 transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:bg-white hover:shadow-lg dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:border-cyan-300/40 dark:hover:bg-white/[0.08]">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/10 align-middle text-xs font-black text-cyan-700 dark:text-cyan-200">i</span>
            <span className="align-middle">{insight}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">{eyebrow}</p>
      <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h2>
    </div>
  );
}
