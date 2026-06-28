import { createFileRoute, Link } from "@tanstack/react-router";
import { GitBranch, Award, Code2, GraduationCap, Medal, Target } from "lucide-react";
import { useUserRows } from "@/hooks/use-user-data";

export const Route = createFileRoute("/_app/journey")({
  head: () => ({ meta: [{ title: "Journey · PersonaAI" }] }),
  component: JourneyPage,
});

type Achievement = { id: string; title: string; description: string | null; achieved_on: string | null; created_at: string };
type Project = { id: string; title: string; summary: string | null; completed_on: string | null; created_at: string };
type Cert = { id: string; name: string; issuer: string | null; issued_on: string | null; created_at: string };
type Internship = { id: string; role: string; company: string; start_date: string | null; created_at: string };
type Goal = { id: string; title: string; status: string; created_at: string };

function JourneyPage() {
  const { rows: achievements } = useUserRows<Achievement>("achievements");
  const { rows: projects } = useUserRows<Project>("projects");
  const { rows: certs } = useUserRows<Cert>("certificates");
  const { rows: internships } = useUserRows<Internship>("internships");
  const { rows: goals } = useUserRows<Goal>("career_goals");

  const events = [
    ...achievements.map((a) => ({ id: `a-${a.id}`, kind: "Achievement", icon: Medal, title: a.title, desc: a.description, date: a.achieved_on ?? a.created_at })),
    ...projects.map((p) => ({ id: `p-${p.id}`, kind: "Project", icon: Code2, title: p.title, desc: p.summary, date: p.completed_on ?? p.created_at })),
    ...certs.map((c) => ({ id: `c-${c.id}`, kind: "Certificate", icon: Award, title: c.name, desc: c.issuer, date: c.issued_on ?? c.created_at })),
    ...internships.map((i) => ({ id: `i-${i.id}`, kind: "Internship", icon: GraduationCap, title: `${i.role} · ${i.company}`, desc: null, date: i.start_date ?? i.created_at })),
    ...goals.map((g) => ({ id: `g-${g.id}`, kind: "Goal", icon: Target, title: g.title, desc: g.status, date: g.created_at })),
  ].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in">
      <header>
        <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <GitBranch className="h-3.5 w-3.5 text-primary" /> Journey
        </div>
        <h1 className="mt-2 text-display text-3xl tracking-tight lg:text-4xl">Every step, in context.</h1>
        <p className="mt-2 text-sm text-muted-foreground">A chronological map of everything in your persona.</p>
      </header>

      {events.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <p className="text-sm text-muted-foreground">Your journey is empty.</p>
          <Link to="/my-persona" className="mt-3 inline-block text-xs font-medium text-primary hover:underline">
            Add your first milestone →
          </Link>
        </div>
      ) : (
        <ul className="surface-card p-6">
          {events.map((e) => {
            const Icon = e.icon;
            return (
              <li key={e.id} className="group relative pl-10 pb-6 last:pb-0">
                <span className="absolute left-0 top-0 grid h-7 w-7 place-items-center rounded-lg border border-border bg-[color:var(--card)] text-muted-foreground group-hover:text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="absolute left-[13px] top-7 bottom-0 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-foreground">{e.title}</h4>
                  <span className="rounded-full border border-border bg-[color:var(--surface)] px-2 py-0.5 text-[10px] text-muted-foreground">{e.kind}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{e.date.slice(0, 10)}</p>
                {e.desc && <p className="mt-1.5 text-sm text-foreground/80 leading-relaxed">{e.desc}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
