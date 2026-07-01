import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Compass, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { useUserRows } from "@/hooks/use-user-data";
import { CrudSection } from "@/components/crud-section";
import { generateCompass } from "@/lib/ai.functions";

export const Route = createFileRoute("/_app/compass")({
  head: () => ({ meta: [{ title: "Compass · PersonaAI" }] }),
  component: CompassPage,
});

type Reco = {
  id: string;
  title: string;
  description: string | null;
  reason: string | null;
  category: string;
  link: string | null;
  priority: number;
  is_dismissed: boolean;
};

const CATEGORIES = [
  { id: "skill", label: "Recommended Skills" },
  { id: "project", label: "Recommended Projects" },
  { id: "internship", label: "Internship Opportunities" },
  { id: "hackathon", label: "Hackathons" },
  { id: "course", label: "Courses" },
  { id: "certification", label: "Certifications" },
];

function CompassPage() {
  const { rows } = useUserRows<Reco>("recommendations");
  const active = rows.filter((r) => !r.is_dismissed);

  return (
    <div className="mx-auto max-w-5xl space-y-10 animate-fade-in">
      <header>
        <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <Compass className="h-3.5 w-3.5 text-primary" /> Compass
        </div>
        <h1 className="mt-2 text-display text-3xl tracking-tight lg:text-4xl">Your guidance center.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Save recommended skills, projects, opportunities, and courses you want to pursue.
        </p>
      </header>

      {active.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">
            No recommendations yet. Add ones you want to track below.
          </p>
        </div>
      ) : (
        CATEGORIES.map((cat) => {
          const items = active.filter((r) => r.category === cat.id).sort((a, b) => b.priority - a.priority);
          if (items.length === 0) return null;
          return (
            <section key={cat.id} className="surface-card p-6">
              <h2 className="text-display text-lg">{cat.label}</h2>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {items.map((r) => (
                  <li key={r.id} className="rounded-xl border border-border bg-[color:var(--surface)]/60 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold">{r.title}</h3>
                      {r.link && (
                        <a href={r.link} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    {r.description && <p className="mt-1.5 text-xs text-muted-foreground">{r.description}</p>}
                    {r.reason && (
                      <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary">Why this</p>
                        <p className="mt-1 text-xs text-foreground/80">{r.reason}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}

      <CrudSection<Reco>
        table="recommendations"
        icon={Sparkles}
        title="Manage Recommendations"
        subtitle="Add anything you want to explore next — Persona will track it for you."
        emptyHint="No recommendations tracked."
        fields={[
          { name: "title", label: "Title", required: true },
          { name: "category", label: "Category", placeholder: "skill / project / internship / hackathon / course / certification", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "reason", label: "Why this matters", type: "textarea" },
          { name: "link", label: "Link", type: "url" },
          { name: "priority", label: "Priority (0-10)", type: "number" },
        ]}
        renderItem={(r) => ({ primary: r.title, secondary: r.description ?? undefined, tag: r.category })}
      />

      <p className="text-center text-xs text-muted-foreground">
        Need to update your goals? <Link to="/my-persona" className="text-primary hover:underline">Edit your persona</Link>.
      </p>
    </div>
  );
}
