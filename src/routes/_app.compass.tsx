import { createFileRoute } from "@tanstack/react-router";
import {
  Sparkles,
  Hammer,
  Briefcase,
  Trophy,
  GraduationCap,
  Award,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/_app/compass")({
  head: () => ({ meta: [{ title: "Compass · PersonaAI" }] }),
  component: CompassPage,
});

type Reco = {
  title: string;
  meta: string;
  why: string;
  tag?: string;
};

type Section = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: "primary" | "secondary" | "success" | "warning";
  items: Reco[];
};

const SECTIONS: Section[] = [
  {
    id: "skills",
    title: "Recommended Skills",
    subtitle: "Closing the gap between today and your dream role.",
    icon: Sparkles,
    tone: "primary",
    items: [
      {
        title: "Transformer architectures",
        meta: "Intermediate · 3 weeks",
        why: "Builds directly on your NLP capstone and unlocks research-track conversations.",
        tag: "ML",
      },
      {
        title: "System design fundamentals",
        meta: "Foundational · 4 weeks",
        why: "Your strongest growth area — required for most ML internship interviews.",
        tag: "Engineering",
      },
      {
        title: "Experimental rigor & evaluation",
        meta: "Short course · 1 week",
        why: "Raises the credibility of every project you ship from here on.",
        tag: "Research",
      },
    ],
  },
  {
    id: "projects",
    title: "Recommended Projects",
    subtitle: "Builds that match your trajectory and showcase depth.",
    icon: Hammer,
    tone: "secondary",
    items: [
      {
        title: "Fine-tune a small LLM for code review",
        meta: "~2 weeks · GitHub-ready",
        why: "Pairs your Python and ML strengths with a portfolio-worthy artifact.",
        tag: "LLM",
      },
      {
        title: "Vision-based attendance system",
        meta: "~3 weeks · Demo deployable",
        why: "Cross-domain reach makes your persona feel versatile to recruiters.",
        tag: "CV",
      },
      {
        title: "MLOps mini-pipeline with monitoring",
        meta: "~10 days · DevX",
        why: "Touches a growth area while staying within your comfort zone.",
        tag: "MLOps",
      },
    ],
  },
  {
    id: "internships",
    title: "Internship Opportunities",
    subtitle: "Live openings that align with your skills and goals.",
    icon: Briefcase,
    tone: "success",
    items: [
      {
        title: "Meta — ML Engineering Intern",
        meta: "Bangalore · Apply in 6 days",
        why: "Your profile matches 88% of the listed requirements.",
        tag: "Internship",
      },
      {
        title: "Hugging Face — Research Intern",
        meta: "Remote · Rolling",
        why: "Their team values written case studies — your strongest signal.",
        tag: "Research",
      },
      {
        title: "Zomato — Data Science Intern",
        meta: "Gurugram · 12 days left",
        why: "Good entry path to applied-ML roles in product teams.",
        tag: "Applied ML",
      },
    ],
  },
  {
    id: "hackathons",
    title: "Hackathons",
    subtitle: "Short sprints to compress learning into momentum.",
    icon: Trophy,
    tone: "warning",
    items: [
      {
        title: "AI4Good Global",
        meta: "48 hrs · Starts Nov 22",
        why: "Themes overlap with your applied-ML interests.",
        tag: "Global",
      },
      {
        title: "Smart India Hackathon",
        meta: "36 hrs · Regional finals soon",
        why: "Strong networking value and a credible resume line.",
        tag: "National",
      },
    ],
  },
  {
    id: "courses",
    title: "Courses",
    subtitle: "Curated learning that matches your level — not too easy, not too steep.",
    icon: GraduationCap,
    tone: "primary",
    items: [
      {
        title: "CS25: Transformers United (Stanford)",
        meta: "Free · Lecture series",
        why: "Deepens the foundation your NLP work is already standing on.",
        tag: "Free",
      },
      {
        title: "Full Stack Deep Learning",
        meta: "Self-paced · ~6 weeks",
        why: "Bridges your research instincts with production engineering.",
        tag: "Applied",
      },
    ],
  },
  {
    id: "certifications",
    title: "Certifications",
    subtitle: "Credentials recruiters in your target roles actively scan for.",
    icon: Award,
    tone: "secondary",
    items: [
      {
        title: "AWS Certified Machine Learning – Specialty",
        meta: "3 months prep · High signal",
        why: "Frequently filtered for by applied-ML hiring teams in India.",
        tag: "Cloud",
      },
      {
        title: "DeepLearning.AI MLOps Specialization",
        meta: "~2 months · Cohort or self-paced",
        why: "Directly addresses your top growth area.",
        tag: "MLOps",
      },
    ],
  },
];

const TONE_CLASS = {
  primary:   { ring: "text-primary",   bg: "bg-primary/10" },
  secondary: { ring: "text-secondary", bg: "bg-secondary/10" },
  success:   { ring: "text-success",   bg: "bg-success/10" },
  warning:   { ring: "text-warning",   bg: "bg-warning/10" },
} as const;

function CompassPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 animate-fade-in">
      {/* Hero */}
      <header className="pt-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Compass · AI Guidance
        </p>
        <h1 className="mt-3 text-display text-4xl leading-tight tracking-tight lg:text-5xl">
          Paths that match
          <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            where you're heading.
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Every recommendation is shaped by your persona — your skills, goals, and recent work.
          Tap any card to see the reasoning.
        </p>
      </header>

      {SECTIONS.map((sec) => {
        const Icon = sec.icon;
        const tc = TONE_CLASS[sec.tone];
        return (
          <section key={sec.id}>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-xl border border-border ${tc.bg} ${tc.ring}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-display text-lg">{sec.title}</h2>
                  <p className="text-xs text-muted-foreground">{sec.subtitle}</p>
                </div>
              </div>
              <button className="hidden text-xs font-medium text-muted-foreground hover:text-foreground md:inline-flex">
                See all
              </button>
            </div>

            <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {sec.items.map((item) => (
                <li
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-[color:var(--card)]/70 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_18px_40px_-22px_rgba(99,102,241,0.5)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-display text-[15px] leading-snug">{item.title}</h3>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{item.meta}</p>
                  <div className="mt-4 rounded-xl border border-border bg-[color:var(--surface)]/70 p-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      <Sparkles className={`h-3 w-3 ${tc.ring}`} />
                      Why this
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/85">
                      {item.why}
                    </p>
                  </div>
                  {item.tag && (
                    <span className="mt-4 inline-flex rounded-full border border-border bg-[color:var(--surface)] px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                      {item.tag}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
