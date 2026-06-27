import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_app/my-persona")({
  head: () => ({ meta: [{ title: "My Persona · PersonaAI" }] }),
  component: MyPersona,
});

type Skill = Database["public"]["Tables"]["skills"]["Row"];

const FALLBACK_TOP_SKILLS = [
  { name: "Machine Learning", level: 88 },
  { name: "Python", level: 92 },
  { name: "Deep Learning", level: 81 },
  { name: "Data Visualization", level: 74 },
  { name: "System Design", level: 58 },
];
const FALLBACK_STRENGTHS = ["Research depth", "Fast prototyping", "Clear written reasoning", "Self-directed learning"];
const FALLBACK_GROWTH = ["System design at scale", "Public speaking", "Product thinking"];
const FALLBACK_INTERESTS = ["LLM agents", "Computer vision", "MLOps", "Robotics", "HCI"];

function MyPersona() {
  const { profile } = useProfile();
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    supabase
      .from("skills")
      .select("*")
      .order("level", { ascending: false })
      .limit(5)
      .then(({ data }) => setSkills(data ?? []));
  }, []);

  const name = profile?.full_name ?? "Your Persona";
  const headline = profile?.headline ?? "Add a headline to your profile";
  const initial = (name?.trim()?.[0] ?? "P").toUpperCase();
  const dreamCareer = profile?.dream_career ?? "Research Scientist at a top AI lab";
  const careerGoal = profile?.career_goal ?? "Land an ML internship by summer";
  const resumeScore = profile?.resume_score ?? 84;
  const readiness = profile?.career_readiness ?? 74;
  const strengths = profile?.strengths?.length ? profile.strengths : FALLBACK_STRENGTHS;
  const growth = profile?.growth_areas?.length ? profile.growth_areas : FALLBACK_GROWTH;
  const interests = profile?.learning_interests?.length ? profile.learning_interests : FALLBACK_INTERESTS;
  const topSkills = skills.length
    ? skills.map((s) => ({ name: s.name, level: s.level }))
    : FALLBACK_TOP_SKILLS;
  const github = profile?.github_handle;
  const linkedin = profile?.linkedin_handle;

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-primary-foreground shadow-[0_18px_40px_-18px_var(--primary)]">
              {initial}
            </div>
            <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-success">
              <CheckCircle2 className="h-3 w-3 text-background" />
            </span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              My Persona
            </p>
            <h1 className="mt-1 text-display text-3xl tracking-tight lg:text-4xl">{name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{headline}</p>
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
          {profile?.bio ?? (
            <>
              You're a <span className="font-semibold text-primary">research-oriented builder</span>{" "}
              who learns fast and ships often. Your work in NLP and applied ML, combined with
              consistent course completion, suggests a trajectory toward{" "}
              <span className="font-semibold text-secondary">ML research and applied-AI</span> roles.
              Your written depth is a quiet superpower — lean into it.
            </>
          )}
        </p>
      </section>

      {/* Dream / Goal */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface-card p-6">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Heart className="h-3.5 w-3.5 text-primary" />
            Dream Career
          </div>
          <h3 className="mt-3 text-display text-2xl">{dreamCareer}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Building foundation models that reason — DeepMind, OpenAI, Anthropic.
          </p>
        </div>
        <div className="surface-card p-6">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Target className="h-3.5 w-3.5 text-secondary" />
            Career Goal
          </div>
          <h3 className="mt-3 text-display text-2xl">{careerGoal}</h3>
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
          {topSkills.map((s) => (
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
            {strengths.map((s) => (
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
            {growth.map((s) => (
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
          <CircularProgress value={resumeScore} size={120} stroke={10} label="resume" />
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
          <CircularProgress value={readiness} size={120} stroke={10} label="readiness" />
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
            {
              icon: Github,
              name: "GitHub",
              handle: github ? `@${github}` : "Not connected",
              state: github ? "Connected" : "Connect",
              tone: github ? "text-success" : "text-muted-foreground",
            },
            {
              icon: Linkedin,
              name: "LinkedIn",
              handle: linkedin ? `@${linkedin}` : "Not connected",
              state: linkedin ? "Connected" : "Connect",
              tone: linkedin ? "text-success" : "text-muted-foreground",
            },
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
          {interests.map((i) => (
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
