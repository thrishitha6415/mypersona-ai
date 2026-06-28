import {
  Lightbulb,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Compass,
  UserCircle2,
  GitBranch,
  MessageSquare,
  Settings as SettingsIcon,
  type LucideIcon,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { CircularProgress } from "./circular-progress";
import { useProfile } from "@/hooks/use-profile";
import { useUserRows } from "@/hooks/use-user-data";

type Suggestion = { label: string; to?: string };

type Insight = {
  noticedIcon: LucideIcon;
  noticed: React.ReactNode;
  momentum: string;
  actionLabel: string;
  actionTitle: string;
  actionBody: string;
  actionTo?: string;
  suggestionsHeader: string;
  suggestions: Suggestion[];
  showHealth?: boolean;
};

export function PersonaPanel() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { profile } = useProfile();
  const { rows: skills } = useUserRows<{ id: string; name: string; level: number }>("skills");
  const { rows: projects } = useUserRows<{ id: string }>("projects");
  const { rows: certs } = useUserRows<{ id: string }>("certificates");
  const { rows: achievements } = useUserRows<{ id: string }>("achievements");
  const { rows: goals } = useUserRows<{ id: string; title: string; progress: number }>("career_goals");
  const { rows: recos } = useUserRows<{ id: string; title: string; category: string; is_dismissed: boolean }>("recommendations");

  // Completion calc shared with Home
  const completionFields = [
    profile?.full_name, profile?.headline, profile?.bio, profile?.dream_career,
    profile?.career_goal, profile?.github_handle, profile?.linkedin_handle,
    profile?.strengths?.length, profile?.growth_areas?.length, profile?.learning_interests?.length,
    skills.length, projects.length,
  ];
  const filled = completionFields.filter(Boolean).length;
  const completion = Math.round((filled / completionFields.length) * 100);
  const topSkill = [...skills].sort((a, b) => b.level - a.level)[0];
  const totalMilestones = projects.length + certs.length + achievements.length;
  const activeRecos = recos.filter((r) => !r.is_dismissed);

  const missing: Suggestion[] = [];
  if (!profile?.bio) missing.push({ label: "Add a short bio", to: "/my-persona" });
  if (!profile?.dream_career) missing.push({ label: "Set your dream career", to: "/my-persona" });
  if (skills.length === 0) missing.push({ label: "Add your first skill", to: "/my-persona" });
  if (projects.length === 0) missing.push({ label: "Log a project", to: "/my-persona" });
  if (!profile?.github_handle) missing.push({ label: "Connect your GitHub", to: "/my-persona" });
  if (!profile?.linkedin_handle) missing.push({ label: "Connect your LinkedIn", to: "/my-persona" });

  const fallback: Insight = {
    noticedIcon: Lightbulb,
    noticed: topSkill ? (
      <>Your strongest signal is <span className="font-semibold text-primary">{topSkill.name}</span> at {topSkill.level}%.</>
    ) : (
      <>Add your first skill so Persona can start mapping your trajectory.</>
    ),
    momentum: `${totalMilestones} milestones logged`,
    actionLabel: "Next best action",
    actionTitle: missing[0]?.label ?? "Plan your next milestone",
    actionBody: missing[0]
      ? "Small additions sharpen every recommendation Persona makes."
      : "Capture what you ship to keep your story current.",
    actionTo: missing[0]?.to ?? "/my-persona",
    suggestionsHeader: "To complete your persona",
    suggestions: missing.slice(0, 3),
    showHealth: true,
  };

  const byRoute: Record<string, Insight> = {
    "/my-persona": {
      noticedIcon: UserCircle2,
      noticed: <>Your persona is <span className="font-semibold text-primary">{completion}% defined</span>. Keep filling the gaps.</>,
      momentum: completion >= 75 ? "Identity confidence: Strong" : "Identity confidence: Building",
      actionLabel: "Strengthen your persona",
      actionTitle: missing[0]?.label ?? "You're all set",
      actionBody: "Linked accounts and proof artifacts increase trust.",
      actionTo: missing[0]?.to,
      suggestionsHeader: "To complete your identity",
      suggestions: missing.slice(0, 3),
      showHealth: true,
    },
    "/compass": {
      noticedIcon: Compass,
      noticed: activeRecos.length ? (
        <><span className="font-semibold text-primary">{activeRecos.length}</span> active recommendations are on your radar.</>
      ) : (
        <>Save recommendations to track skills, projects, and opportunities here.</>
      ),
      momentum: `${activeRecos.length} active items`,
      actionLabel: "Today's focus",
      actionTitle: activeRecos[0]?.title ?? "Add your first recommendation",
      actionBody: activeRecos[0]
        ? `Category: ${activeRecos[0].category}.`
        : "Capture skills, projects, or courses you want to pursue.",
      actionTo: "/compass",
      suggestionsHeader: "Worth exploring",
      suggestions: activeRecos.slice(0, 3).map((r) => ({ label: r.title, to: "/compass" })),
    },
    "/journey": {
      noticedIcon: GitBranch,
      noticed: totalMilestones ? (
        <>You've shipped <span className="font-semibold text-primary">{totalMilestones}</span> milestones across your timeline.</>
      ) : (
        <>Your journey is empty. Add a project, certificate, or achievement to start the story.</>
      ),
      momentum: `${projects.length} projects · ${certs.length} certs`,
      actionLabel: "Reflect & document",
      actionTitle: "Log a new milestone",
      actionBody: "A clean record makes your story easier to share.",
      actionTo: "/my-persona",
      suggestionsHeader: "Recently added",
      suggestions: [],
    },
    "/ask": {
      noticedIcon: MessageSquare,
      noticed: <>Ask Persona anything — career decisions, skill paths, or what to build next.</>,
      momentum: skills.length ? `Context: ${skills.length} skills loaded` : "Add data for richer answers",
      actionLabel: "Try asking",
      actionTitle: '"What should I learn next quarter?"',
      actionBody: "Persona will reason from your skills, goals, and recent work.",
      actionTo: "/ask",
      suggestionsHeader: "Conversation starters",
      suggestions: [
        { label: "Compare research vs product roles for me" },
        { label: "Draft a cold email to a recruiter" },
        { label: "Plan my next 90 days" },
      ],
    },
    "/settings": {
      noticedIcon: SettingsIcon,
      noticed: <>Your data stays yours. Persona only uses what you choose to share.</>,
      momentum: "Privacy posture: Strong",
      actionLabel: "Recommended",
      actionTitle: "Keep your persona fresh",
      actionBody: "Update goals as they shift so guidance stays relevant.",
      actionTo: "/my-persona",
      suggestionsHeader: "Quick links",
      suggestions: [
        { label: "Edit your persona", to: "/my-persona" },
        { label: "Manage recommendations", to: "/compass" },
      ],
    },
  };

  const i = byRoute[pathname] ?? fallback;
  const NoticedIcon = i.noticedIcon;

  const healthLabel = completion >= 75 ? "Strong" : completion >= 40 ? "Building" : "Just starting";
  const gapsCount = missing.length;

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

      <div key={pathname} className="flex-1 overflow-y-auto px-5 py-5 space-y-5 animate-fade-in">
        <section className="surface-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <NoticedIcon className="h-3.5 w-3.5 text-warning" />
            Here's what I noticed
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-foreground">{i.noticed}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-success" />
            <span>{i.momentum}</span>
          </div>
        </section>

        <section className="surface-card p-5">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {i.actionLabel}
          </div>
          <h3 className="mt-2 text-display text-[17px] leading-snug">{i.actionTitle}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{i.actionBody}</p>
          {i.actionTo && (
            <Link
              to={i.actionTo}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_8px_24px_-8px_var(--primary)]"
            >
              Open <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </section>

        {i.showHealth && (
          <section className="surface-card p-5">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              Profile health
            </div>
            <div className="mt-4 flex items-center gap-4">
              <CircularProgress value={completion} size={88} stroke={8} />
              <div className="min-w-0">
                <p className="text-display text-lg">{healthLabel}</p>
                <p className="text-xs text-muted-foreground">
                  {gapsCount === 0 ? "Your persona is complete." : `${gapsCount} gap${gapsCount === 1 ? "" : "s"} to fill.`}
                </p>
              </div>
            </div>
          </section>
        )}

        {i.suggestions.length > 0 && (
          <section>
            <div className="px-1 pb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {i.suggestionsHeader}
            </div>
            <ul className="space-y-2">
              {i.suggestions.map((s, idx) => {
                const inner = (
                  <>
                    <span className="text-foreground/90">{s.label}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </>
                );
                const cls = "group flex items-center justify-between gap-3 rounded-xl border border-border bg-[color:var(--card)]/70 px-4 py-3 text-sm transition-all duration-200 hover:border-border-strong hover:bg-[color:var(--card)]";
                return (
                  <li key={`${s.label}-${idx}`}>
                    {s.to ? <Link to={s.to} className={cls}>{inner}</Link> : <div className={cls}>{inner}</div>}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {goals.length > 0 && pathname === "/" && (
          <section className="surface-card p-5">
            <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Active goals</div>
            <ul className="mt-3 space-y-2">
              {goals.slice(0, 3).map((g) => (
                <li key={g.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate text-foreground/90">{g.title}</span>
                    <span className="tabular-nums text-muted-foreground">{g.progress}%</span>
                  </div>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[color:var(--surface)]">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${g.progress}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </aside>
  );
}
