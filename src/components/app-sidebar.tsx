import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  UserCircle2,
  GitBranch,
  Compass,
  Sparkles,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { label: string; to: string; icon: LucideIcon };

const NAV: NavItem[] = [
  { label: "Home", to: "/", icon: Home },
  { label: "My Persona", to: "/my-persona", icon: UserCircle2 },
  { label: "Journey", to: "/journey", icon: GitBranch },
  { label: "Compass", to: "/compass", icon: Compass },
  { label: "Ask Persona", to: "/ask", icon: Sparkles },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-border bg-[color:var(--surface)]/60 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2.5 px-6">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-[0_4px_18px_-6px_var(--primary)]">
          <span className="text-sm font-bold text-primary-foreground">P</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-display text-[15px]">PersonaAI</span>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Digital Identity
          </span>
        </div>
      </div>

      <div className="hairline mx-4" />

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Workspace
        </p>
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-[color:var(--card)] text-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0_/_0.06)]"
                      : "text-muted-foreground hover:bg-[color:var(--card)]/60 hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                    )}
                    strokeWidth={2}
                  />
                  <span>{item.label}</span>
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-3 rounded-2xl border border-border bg-[color:var(--card)] p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-semibold text-primary-foreground">
            T
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Thrishi</p>
            <p className="truncate text-xs text-muted-foreground">Student · IIT</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = NAV.filter((n) => n.to !== "/settings");

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-[color:var(--surface)]/90 backdrop-blur-xl">
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
                <span>{item.label.split(" ")[0]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
