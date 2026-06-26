import { createFileRoute } from "@tanstack/react-router";
import {
  Sparkles,
  Target,
  Briefcase,
  TrendingUp,
  FileText,
  Github,
  Linkedin,
  BookOpen,
  Heart,
  Zap,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { CircularProgress } from "@/components/circular-progress";

export const Route = createFileRoute("/_app/my-persona")({
  head: () => ({ meta: [{ title: "My Persona · PersonaAI" }] }),
  component: MyPersona,
});

const TOP_SKILLS = [
  { name: "Machine Learning", level: 88 },
  { name: "Python", level: 92 },
  { name: "Deep Learning", level: 81 },
  { name: "Data Visualization", level: 74 },
  { name: "System Design", level: 58 },
];

const STRENGTHS = ["Research depth", "Fast prototyping", "Clear written reasoning", "Self-directed learning"];
const GROWTH = ["System design at scale", "Public speaking", "Product thinking"];
const INTERESTS = ["LLM agents", "Computer vision", "MLOps", "Robotics", "HCI"];

function MyPersona() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-primary-foreground shadow-[0_18px_40px_-18px_var(--primary)]">
              T
            </div>
            <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-success">
              <CheckCircle2 className="h-3 w-3 text-background" />
            </span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              My Persona
            </p>
            <h1 className="mt-1 text-display text-3xl tracking-tight lg:text-4xl">Thrishi</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Aspiring ML Engineer · 2nd year, IIT
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 self-start rounded-xl border border-border bg-[color:var(--card)]/60 px-4 py-2.5 text-sm font-medium backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-border-strong">
          Edit persona <ArrowUpRight className="h-4 w-4" />
        </button>
      </header>

      {/* AI Summary */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-[color:var(--card)]/70 p-6 backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Here's how Persona understands you
        </div>
        <p className="relative mt-4 text-[17px] leading-relaxed text-foreground">
          You're a <span className="font-semibold text-primary">research-oriented builder</span>{" "}
          who learns fast and ships often. Your work in NLP and applied ML, combined with
          consistent course completion, suggests a trajectory toward{" "}
          <span className="font-semibold text-secondary">ML research and applied-AI</span> roles.
          Your written depth is a quiet superpower — lean into it.
        </p>
      </section>

      {/* Dream / Goal */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface-card p-6">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Heart className="h-3.5 w-3.5 text-primary" />
            Dream Career
          </div>
          <h3 className="mt-3 text-display text-2xl">Research Scientist at a top AI lab</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Building foundation models that reason — DeepMind, OpenAI, Anthropic.
          </p>
        </div>
        <div className="surface-card p-6">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Target className="h-3.5 w-3.5 text-secondary" />
            Career Goal
          </div>
          <h3 className="mt-3 text-display text-2xl">Land an ML internship by summer</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Targeting research-leaning teams. 2 case studies and 1 published demo away.
          </p>
        </div>
      </section>

      {/* Top Skills */}
      <section className="surface-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-display text-lg">Top Skills</h2>
          <p className="text-xs text-muted-foreground">Inferred from your work</p>
        </div>
        <ul className="mt-5 space-y-4">
          {TOP_SKILLS.map((s) => (
            <li key={s.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{s.name}</span>
                <span className="tabular-nums text-muted-foreground">{s.level}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--surface)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${s.level}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Strengths + Growth */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface-card p-6">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-success" />
            Strengths
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {STRENGTHS.map((s) => (
              <li
                key={s}
                className="rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="surface-card p-6">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-warning" />
            Growth Areas
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {GROWTH.map((s) => (
              <li
                key={s}
                className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Scores */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface-elev flex items-center gap-6 p-6">
          <CircularProgress value={84} size={120} stroke={10} label="resume" />
          <div>
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <FileText className="h-3.5 w-3.5 text-primary" /> Resume Score
            </div>
            <p className="mt-2 text-display text-xl">Recruiter-ready</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add quantified outcomes to 2 projects to reach 90+.
            </p>
          </div>
        </div>
        <div className="surface-elev flex items-center gap-6 p-6">
          <CircularProgress value={74} size={120} stroke={10} label="readiness" />
          <div>
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5 text-secondary" /> Career Readiness
            </div>
            <p className="mt-2 text-display text-xl">Internship-tier</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Strong for ML interns. 2 gaps for senior-track roles.
            </p>
          </div>
        </div>
      </section>

      {/* Connected accounts */}
      <section className="surface-card p-6">
        <h2 className="text-display text-lg">Connected accounts</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Live signals make your persona sharper.
        </p>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {[
            { icon: Github, name: "GitHub", handle: "@thrishi", state: "Connected", tone: "text-success" },
            { icon: Linkedin, name: "LinkedIn", handle: "Not connected", state: "Connect", tone: "text-muted-foreground" },
          ].map((c) => {
            const I = c.icon;
            return (
              <li
                key={c.name}
                className="flex items-center justify-between rounded-xl border border-border bg-[color:var(--surface)]/60 px-4 py-3 transition-all hover:border-border-strong"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-[color:var(--card)]">
                    <I className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className={`text-xs ${c.tone}`}>{c.handle}</p>
                  </div>
                </div>
                <button className="text-xs font-medium text-primary hover:underline">
                  {c.state}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Learning Interests */}
      <section className="surface-card p-6">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5 text-secondary" />
          Learning Interests
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <li
              key={i}
              className="rounded-full border border-border bg-[color:var(--surface)] px-3 py-1.5 text-xs font-medium text-foreground/90 transition-colors hover:border-border-strong hover:text-foreground"
            >
              {i}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
