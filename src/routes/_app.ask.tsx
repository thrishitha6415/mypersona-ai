import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { useUserRows } from "@/hooks/use-user-data";

export const Route = createFileRoute("/_app/ask")({
  head: () => ({ meta: [{ title: "Ask Persona · PersonaAI" }] }),
  component: AskPage,
});

type Skill = { id: string; name: string; level: number };

function AskPage() {
  const { profile } = useProfile();
  const { rows: skills } = useUserRows<Skill>("skills");

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in">
      <header>
        <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Ask Persona
        </div>
        <h1 className="mt-2 text-display text-3xl tracking-tight lg:text-4xl">
          A quiet companion for your next question.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Persona uses what it knows about you to help you reflect and plan.
        </p>
      </header>

      <section className="surface-card p-6">
        <h2 className="text-display text-lg">What Persona knows so far</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Name</dt>
            <dd className="mt-1 font-medium">{profile?.full_name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Dream career</dt>
            <dd className="mt-1 font-medium">{profile?.dream_career ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Current goal</dt>
            <dd className="mt-1 font-medium">{profile?.career_goal ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Skills tracked</dt>
            <dd className="mt-1 font-medium">{skills.length}</dd>
          </div>
        </dl>
        {!profile?.dream_career && (
          <p className="mt-5 text-xs text-muted-foreground">
            Tip: <Link to="/my-persona" className="text-primary hover:underline">fill in your persona</Link> for sharper guidance.
          </p>
        )}
      </section>

      <section className="surface-card p-6">
        <h2 className="text-display text-lg">Try asking</h2>
        <ul className="mt-4 space-y-2">
          {[
            "What should I learn next quarter?",
            "Which projects would strengthen my profile?",
            "How do I prepare for an ML internship interview?",
          ].map((q) => (
            <li key={q} className="rounded-xl border border-border bg-[color:var(--surface)]/60 px-4 py-3 text-sm text-foreground/90">
              {q}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-muted-foreground">
          Conversational AI is coming soon. For now, browse your <Link to="/compass" className="text-primary hover:underline">Compass</Link> for tailored recommendations.
        </p>
      </section>
    </div>
  );
}
