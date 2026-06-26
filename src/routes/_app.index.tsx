import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Award,
  Code2,
  GraduationCap,
  Medal,
  Plus,
  Sparkles,
  Target,
  Flame,
  Compass as CompassIcon,
} from "lucide-react";
import { InsightCard } from "@/components/insight-card";
import { TimelineItem } from "@/components/timeline-item";
import { CircularProgress } from "@/components/circular-progress";

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

function HomePage() {
  // Client-only — avoid SSR/CSR hydration mismatch on time-of-day greeting.
  const [greeting, setGreeting] = useState("Welcome back");
  useEffect(() => setGreeting(computeGreeting()), []);

  return (
    <div className="mx-auto max-w-5xl space-y-14">
      {/* Hero */}
      <section className="pt-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-[color:var(--card)]/60 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
          Persona is listening
        </div>
        <p className="mt-5 text-sm font-medium text-muted-foreground">
          {greeting}, <span className="text-foreground">Thrishi</span>
        </p>
        <h1 className="mt-3 text-display text-[44px] leading-[1.04] tracking-tight lg:text-[56px]">
          Know what you've done.
          <br />
          <span className="bg-gradient-to-r from-primary via-foreground to-secondary bg-clip-text text-transparent">
            Discover what's next.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Your intelligent workspace for understanding the journey behind your work — and the
          paths still open to you.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-secondary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-12px_var(--primary)]">
            <Plus className="h-4 w-4" /> Add to Persona
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-[color:var(--card)]/60 px-4 py-2.5 text-sm font-medium text-foreground/90 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-[color:var(--card)]">
            View Journey
          </button>
        </div>
      </section>

      {/* AI Insight Cards */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <h2 className="text-display text-lg">Persona insights</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Living signals, refreshed from your work this week.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Updated just now</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <InsightCard
            icon={Sparkles}
            label="Strongest Skill"
            headline="Machine Learning"
            detail="Top 12% of peers. Reinforced by 3 shipped projects and a specialization."
            tone="primary"
            progress={88}
          />
          <InsightCard
            icon={Target}
            label="Career Readiness"
            headline="Internship-ready"
            detail="Profile aligned to ML & data-science roles. 2 gaps to fill for senior fits."
            tone="success"
            progress={74}
          />
          <InsightCard
            icon={CompassIcon}
            label="Today's Focus"
            headline="Document your NLP capstone"
            detail="A short case study unlocks the next tier of recruiter signals."
            tone="secondary"
          />
          <InsightCard
            icon={Flame}
            label="Learning Momentum"
            headline="5-week streak"
            detail="Consistency up 24%. Keep one deep-work block on Wednesdays."
            tone="warning"
            progress={62}
          />
        </div>
      </section>

      {/* Recent + Health */}
      <section className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-display text-lg">Recent Progress</h2>
            <button className="text-xs font-medium text-muted-foreground hover:text-foreground">
              See all
            </button>
          </div>
          <ul className="mt-6">
            <TimelineItem
              icon={Award}
              title="Completed Deep Learning Specialization"
              meta="Coursera · 2 days ago"
              tag="Certificate"
              description="Five-course specialization covering neural networks, optimization, and sequence models."
            />
            <TimelineItem
              icon={Code2}
              title="Shipped NLP Sentiment Classifier"
              meta="GitHub · 5 days ago"
              tag="Project"
              description="Transformer-based classifier with 92% F1 on the SST-2 benchmark."
            />
            <TimelineItem
              icon={GraduationCap}
              title="Research assistant — IIT lab"
              meta="Started · 2 weeks ago"
              tag="Experience"
            />
            <TimelineItem
              icon={Medal}
              title="2nd place, Inter-college Hackathon"
              meta="3 weeks ago"
              tag="Achievement"
            />
          </ul>
        </div>

        <div className="surface-elev flex flex-col items-center p-6 text-center">
          <h2 className="text-display text-lg">Profile Health</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            A complete persona unlocks better suggestions.
          </p>
          <div className="my-6">
            <CircularProgress value={78} size={184} stroke={14} label="complete" />
          </div>
          <div className="grid w-full grid-cols-3 gap-2 text-xs">
            {[
              { k: "Verified", v: 12, tone: "text-success" },
              { k: "Pending", v: 3, tone: "text-warning" },
              { k: "Missing", v: 2, tone: "text-muted-foreground" },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-xl border border-border bg-[color:var(--surface)] py-3"
              >
                <div className={`text-display text-lg ${s.tone}`}>{s.v}</div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {s.k}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
