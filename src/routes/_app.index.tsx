import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  FolderGit2,
  Sparkles,
  Briefcase,
  Trophy,
  Plus,
  GraduationCap,
  Code2,
  Medal,
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
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

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

function HomePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12">
      {/* Hero */}
      <section className="pt-6">
        <p className="text-sm font-medium text-muted-foreground">
          {greeting()}, <span className="text-foreground">Thrishi</span>
        </p>
        <h1 className="mt-4 text-display text-4xl leading-[1.05] tracking-tight lg:text-5xl">
          Know what you've done.
          <br />
          <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Discover what's next.
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Your intelligent workspace for understanding the journey behind your work — and the
          paths still open to you.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_10px_30px_-10px_var(--primary)]">
            <Plus className="h-4 w-4" /> Add to Persona
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-[color:var(--card)]/60 px-4 py-2.5 text-sm font-medium text-foreground/90 transition-all duration-200 hover:border-border-strong hover:bg-[color:var(--card)]">
            View Journey
          </button>
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-display text-lg">Journey Overview</h2>
          <p className="text-xs text-muted-foreground">Updated just now</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Certificates" value={14} delta="2" icon={Award} tone="primary" />
          <StatCard label="Projects" value={9} delta="3" icon={FolderGit2} tone="secondary" />
          <StatCard label="Skills" value={32} delta="5" icon={Sparkles} tone="success" />
          <StatCard label="Internships" value={2} icon={Briefcase} tone="warning" />
          <StatCard label="Achievements" value={7} delta="1" icon={Trophy} tone="primary" />
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
