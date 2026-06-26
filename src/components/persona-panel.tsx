import { Lightbulb, ArrowRight, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";
import { CircularProgress } from "./circular-progress";

export function PersonaPanel() {
  return (
    <aside className="hidden xl:flex fixed inset-y-0 right-0 z-20 w-[360px] flex-col border-l border-border bg-[color:var(--surface)]/60 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="grid h-6 w-6 place-items-center rounded-md bg-primary/15 text-primary">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <span className="text-display text-sm">Persona</span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-[color:var(--card)] px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
          Listening
        </span>
      </div>
      <div className="hairline mx-4" />

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {/* Noticed */}
        <section className="surface-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <Lightbulb className="h-3.5 w-3.5 text-warning" />
            Here's what I noticed
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-foreground">
            You've completed <span className="font-semibold text-primary">3 ML projects</span> in
            the last 60 days. Your trajectory aligns with research-track roles.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-success" />
            <span>Momentum up 24% this month</span>
          </div>
        </section>

        {/* Next best action */}
        <section className="surface-card p-5">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Next best action
          </div>
          <h3 className="mt-2 text-display text-[17px] leading-snug">
            Document your NLP capstone as a case study
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Recruiters in your target roles weight written depth highly.
          </p>
          <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_8px_24px_-8px_var(--primary)]">
            Start now <ArrowRight className="h-4 w-4" />
          </button>
        </section>

        {/* Profile Health */}
        <section className="surface-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            Profile health
          </div>
          <div className="mt-4 flex items-center gap-4">
            <CircularProgress value={78} size={88} stroke={8} />
            <div className="min-w-0">
              <p className="text-display text-lg">Strong</p>
              <p className="text-xs text-muted-foreground">
                2 gaps to fill for a complete persona.
              </p>
            </div>
          </div>
        </section>

        {/* Suggestions */}
        <section>
          <div className="px-1 pb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Smart suggestions
          </div>
          <ul className="space-y-2">
            {[
              "Add your Coursera DL specialization",
              "Link your GitHub for live signals",
              "Tag your top 3 skills with proof",
            ].map((s) => (
              <li
                key={s}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-[color:var(--card)]/70 px-4 py-3 text-sm transition-all duration-200 hover:border-border-strong hover:bg-[color:var(--card)]"
              >
                <span className="text-foreground/90">{s}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}
