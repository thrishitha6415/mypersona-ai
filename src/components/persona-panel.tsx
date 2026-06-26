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
  type LucideIcon,
} from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { CircularProgress } from "./circular-progress";

type Insight = {
  noticedIcon: LucideIcon;
  noticed: React.ReactNode;
  momentum: string;
  actionLabel: string;
  actionTitle: string;
  actionBody: string;
  suggestionsHeader: string;
  suggestions: string[];
  showHealth?: boolean;
};

const FALLBACK: Insight = {
  noticedIcon: Lightbulb,
  noticed: (
    <>
      You've completed <span className="font-semibold text-primary">3 ML projects</span> in the
      last 60 days. Your trajectory aligns with research-track roles.
    </>
  ),
  momentum: "Momentum up 24% this month",
  actionLabel: "Next best action",
  actionTitle: "Document your NLP capstone as a case study",
  actionBody: "Recruiters in your target roles weight written depth highly.",
  suggestionsHeader: "Smart suggestions",
  suggestions: [
    "Add your Coursera DL specialization",
    "Link your GitHub for live signals",
    "Tag your top 3 skills with proof",
  ],
  showHealth: true,
};

const BY_ROUTE: Record<string, Insight> = {
  "/my-persona": {
    noticedIcon: UserCircle2,
    noticed: (
      <>
        Your persona is <span className="font-semibold text-primary">82% defined</span>. Adding
        proof to your top skills will sharpen recommendations.
      </>
    ),
    momentum: "Identity confidence: Strong",
    actionLabel: "Strengthen your persona",
    actionTitle: "Add 2 proof artifacts to your top skills",
    actionBody: "Linked repos, certificates, or demos increase recruiter trust.",
    suggestionsHeader: "To complete your identity",
    suggestions: [
      "Write a 2-line career goal",
      "Connect LinkedIn for verified history",
      "Pick 3 learning interests",
    ],
    showHealth: true,
  },
  "/compass": {
    noticedIcon: Compass,
    noticed: (
      <>
        Based on your trajectory, <span className="font-semibold text-primary">3 new paths</span>{" "}
        match your strengths this week.
      </>
    ),
    momentum: "Opportunity fit improving",
    actionLabel: "Today's recommendation",
    actionTitle: "Apply to the Meta ML internship",
    actionBody: "Deadline in 6 days. Your profile matches 88% of the requirements.",
    suggestionsHeader: "Worth exploring",
    suggestions: [
      "Try the new System Design course",
      "Join the AI4Good hackathon",
      "Earn the AWS ML certification",
    ],
  },
  "/journey": {
    noticedIcon: GitBranch,
    noticed: (
      <>
        You've shipped <span className="font-semibold text-primary">9 projects</span> across 4
        domains. ML is now your strongest signal.
      </>
    ),
    momentum: "Consistency streak: 5 weeks",
    actionLabel: "Reflect & document",
    actionTitle: "Turn last month into a milestone summary",
    actionBody: "A clean monthly recap makes your story easy to share.",
    suggestionsHeader: "Worth revisiting",
    suggestions: [
      "Add context to your first project",
      "Tag domains across your timeline",
      "Mark a turning-point moment",
    ],
  },
  "/ask": {
    noticedIcon: MessageSquare,
    noticed: (
      <>
        Ask Persona anything — career decisions, skill paths, or what to build next.
      </>
    ),
    momentum: "Context loaded from your persona",
    actionLabel: "Try asking",
    actionTitle: "“What should I learn next quarter?”",
    actionBody: "Persona will reason from your skills, goals, and recent work.",
    suggestionsHeader: "Conversation starters",
    suggestions: [
      "Compare research vs product roles for me",
      "Draft a cold email to a recruiter",
      "Plan my next 90 days",
    ],
  },
  "/settings": {
    noticedIcon: ShieldCheck,
    noticed: (
      <>
        Your data stays yours. Persona only uses what you choose to share.
      </>
    ),
    momentum: "Privacy posture: Strong",
    actionLabel: "Recommended",
    actionTitle: "Review connected accounts",
    actionBody: "Confirm what Persona can read from GitHub and LinkedIn.",
    suggestionsHeader: "Quick toggles",
    suggestions: [
      "Enable weekly insight digest",
      "Set quiet hours for nudges",
      "Export your persona as JSON",
    ],
  },
};

function pick(pathname: string): Insight {
  return BY_ROUTE[pathname] ?? FALLBACK;
}

export function PersonaPanel() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const i = pick(pathname);
  const NoticedIcon = i.noticedIcon;

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
        {/* Noticed */}
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

        {/* Next best action */}
        <section className="surface-card p-5">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {i.actionLabel}
          </div>
          <h3 className="mt-2 text-display text-[17px] leading-snug">{i.actionTitle}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{i.actionBody}</p>
          <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_8px_24px_-8px_var(--primary)]">
            Start now <ArrowRight className="h-4 w-4" />
          </button>
        </section>

        {/* Profile Health (only on relevant routes) */}
        {i.showHealth && (
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
        )}

        {/* Suggestions */}
        <section>
          <div className="px-1 pb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {i.suggestionsHeader}
          </div>
          <ul className="space-y-2">
            {i.suggestions.map((s) => (
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
