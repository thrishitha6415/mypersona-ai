import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppSidebar, MobileNav } from "@/components/app-sidebar";
import { PersonaPanel } from "@/components/persona-panel";
import { SplashScreen } from "@/components/splash-screen";
import { Search, Command } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", data.user.id)
      .maybeSingle();
    if (!profile || !profile.onboarded) throw redirect({ to: "/onboarding" });
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SplashScreen />
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[480px] w-[480px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 h-[420px] w-[420px] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <AppSidebar />
      <PersonaPanel />

      <div className="lg:pl-64 xl:pr-[360px]">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-5 backdrop-blur-xl lg:px-10">
          <div className="flex h-9 min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-border bg-[color:var(--card)]/60 px-3 text-sm text-muted-foreground transition-colors hover:border-border-strong">
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Search your persona, journey, signals…</span>
            <span className="ml-auto hidden items-center gap-1 rounded-md border border-border bg-[color:var(--surface)] px-1.5 py-0.5 text-[10px] sm:inline-flex">
              <Command className="h-2.5 w-2.5" /> K
            </span>
          </div>
        </header>

        <main className="px-5 pb-24 pt-8 lg:px-10 lg:pb-12 animate-fade-in">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
