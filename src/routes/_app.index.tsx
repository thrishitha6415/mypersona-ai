import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Award, Code2, GraduationCap, Medal, Sparkles, Target, Flame, Compass as CompassIcon,
} from "lucide-react";
import { InsightCard } from "@/components/insight-card";
import { CircularProgress } from "@/components/circular-progress";
import { useProfile } from "@/hooks/use-profile";
import { useUserRows } from "@/hooks/use-user-data";
import { EditProfileButton } from "@/components/edit-profile-dialog";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Home · PersonaAI" },
      { name: "description", content: "Know what you've done. Discover what's next." },
    ],
  }),
  component: HomePage,
});

function computeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

type Skill = { id: string; name: string; level: number; is_top: boolean; created_at: string };
type Achievement = { id: string; title: string; description: string | null; achieved_on: string | null; created_at: string };
type Project = { id: string; title: string; summary: string | null; completed_on: string | null; created_at: string };
type Cert = { id: string; name: string; issuer: string | null; issued_on: string | null; created_at: string };
type Goal = { id: string; title: string; progress: number; status: string; created_at: string };

function HomePage() {
  const { profile } = useProfile();
  const [greeting, setGreeting] = useState("Welcome");
  useEffect(() => setGreeting(computeGreeting()), []);

  const { rows: skills } = useUserRows<Skill>("skills");
  const { rows: achievements } = useUserRows<Achievement>("achievements");
  const { rows: projects } = useUserRows<Project>("projects");
  const { rows: certs } = useUserRows<Cert>("certificates");
  const { rows: goals } = useUserRows<Goal>("career_goals");

  const name = profile?.full_name ?? "there";
  const topSkill = [...skills].sort((a, b) => b.level - a.level)[0];

  // Profile completion calculation
  const completionFields = [
    profile?.full_name, profile?.headline, profile?.bio, profile?.dream_career,
    profile?.career_goal, profile?.github_handle, profile?.linkedin_handle,
    profile?.strengths?.length, profile?.growth_areas?.length, profile?.learning_interests?.length,
    skills.length, projects.length,
  ];
  const filled = completionFields.filter(Boolean).length;
  const completion = Math.round((filled / completionFields.length) * 100);

  const recent = [
    ...achievements.map((a) => ({ id: a.id, kind: "Achievement", icon: Medal, title: a.title, meta: a.achieved_on ?? a.created_at, desc: a.description })),
    ...projects.map((p) => ({ id: p.id, kind: "Project", icon: Code2, title: p.title, meta: p.completed_on ?? p.created_at, desc: p.summary })),
    ...certs.map((c) => ({ id: c.id, kind: "Certificate", icon: Award, title: c.name, meta: c.issuer ?? c.created_at, desc: null as string | null })),
  ]
    .sort((a, b) => (b.meta || "").localeCompare(a.meta || ""))
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-5xl space-y-14">
      {/* Hero */}
      <section className="pt-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-[color:var(--card)]/60 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
          Persona is listening
        </div>
        <p className="mt-5 text-sm font-medium text-muted-foreground">
          {greeting}, <span className="text-foreground">{name}</span>
        </p>
        <h1 className="mt-3 text-display text-[44px] leading-[1.04] tracking-tight lg:text-[56px]">
          Know what you've done.
          <br />
          <span className="bg-gradient-to-r from-primary via-foreground to-secondary bg-clip-text text-transparent">
            Discover what's next.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Your intelligent workspace for understanding the journey behind your work — and the paths still open to you.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <EditProfileButton label="Edit persona" />
          <Link to="/journey" className="inline-flex items-center gap-2 rounded-xl border border-border bg-[color:var(--card)]/60 px-4 py-2.5 text-sm font-medium text-foreground/90 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-border-strong">
            View Journey
          </Link>
        </div>
      </section>

      {/* Insights */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <h2 className="text-display text-lg">Persona insights</h2>
            <p className="mt-1 text-xs text-muted-foreground">Live signals from your data.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <InsightCard
            icon={Sparkles}
            label="Strongest Skill"
            headline={topSkill?.name ?? "Add your first skill"}
            detail={topSkill ? `Self-rated ${topSkill.level}%. Tracked across your work.` : "Tell Persona what you're great at to unlock insights."}
            tone="primary"
            progress={topSkill?.level}
          />
          <InsightCard
            icon={Target}
            label="Career Readiness"
            headline={profile?.career_readiness ? `${profile.career_readiness}% ready` : "Not set"}
            detail={profile?.dream_career ? `Aligned to: ${profile.dream_career}` : "Set your dream career to calibrate readiness."}
            tone="success"
            progress={profile?.career_readiness ?? undefined}
          />
          <InsightCard
            icon={CompassIcon}
            label="Today's Focus"
            headline={goals[0]?.title ?? "Set a career goal"}
            detail={goals[0]?.status ? `Status: ${goals[0].status} · ${goals[0].progress}% done` : "Open the Compass to start one."}
            tone="secondary"
            progress={goals[0]?.progress}
          />
          <InsightCard
            icon={Flame}
            label="Learning Momentum"
            headline={`${achievements.length + projects.length + certs.length} milestones`}
            detail={`${projects.length} projects · ${certs.length} certificates · ${achievements.length} achievements logged.`}
            tone="warning"
            progress={Math.min(100, (achievements.length + projects.length + certs.length) * 10)}
          />
        </div>
      </section>

      {/* Recent + Health */}
      <section className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-display text-lg">Recent Progress</h2>
            <Link to="/journey" className="text-xs font-medium text-muted-foreground hover:text-foreground">See all</Link>
          </div>
          {recent.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-border bg-[color:var(--surface)]/40 px-5 py-10 text-center">
              <p className="text-sm text-muted-foreground">No milestones yet.</p>
              <Link to="/my-persona" className="mt-2 inline-block text-xs font-medium text-primary hover:underline">
                Add projects, certificates, or achievements →
              </Link>
            </div>
          ) : (
            <ul className="mt-6 space-y-1">
              {recent.map((r) => {
                const Icon = r.icon;
                return (
                  <li key={r.id} className="group relative pl-10 pb-5">
                    <span className="absolute left-0 top-0 grid h-7 w-7 place-items-center rounded-lg border border-border bg-[color:var(--card)] text-muted-foreground group-hover:text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">{r.title}</h4>
                      <span className="rounded-full border border-border bg-[color:var(--surface)] px-2 py-0.5 text-[10px] text-muted-foreground">{r.kind}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{(r.meta ?? "").slice(0, 10)}</p>
                    {r.desc && <p className="mt-1.5 text-sm text-foreground/80 leading-relaxed">{r.desc}</p>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="surface-elev flex flex-col items-center p-6 text-center">
          <h2 className="text-display text-lg">Profile Health</h2>
          <p className="mt-1 text-xs text-muted-foreground">A complete persona unlocks better suggestions.</p>
          <div className="my-6">
            <CircularProgress value={completion} size={184} stroke={14} label="complete" />
          </div>
          <div className="grid w-full grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl border border-border bg-[color:var(--surface)] py-3">
              <div className="text-display text-lg text-primary">{skills.length}</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Skills</div>
            </div>
            <div className="rounded-xl border border-border bg-[color:var(--surface)] py-3">
              <div className="text-display text-lg text-secondary">{projects.length}</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Projects</div>
            </div>
            <div className="rounded-xl border border-border bg-[color:var(--surface)] py-3">
              <div className="text-display text-lg text-success">{certs.length}</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Certs</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
