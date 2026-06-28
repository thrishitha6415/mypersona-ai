import { createFileRoute } from "@tanstack/react-router";
import { LogOut, Settings as SettingsIcon, ShieldCheck, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { EditProfileButton } from "@/components/edit-profile-dialog";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings · PersonaAI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const { profile } = useProfile();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in">
      <header>
        <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <SettingsIcon className="h-3.5 w-3.5 text-primary" /> Settings
        </div>
        <h1 className="mt-2 text-display text-3xl tracking-tight lg:text-4xl">Preferences & account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage your identity, privacy, and session.</p>
      </header>

      <section className="surface-card p-6">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <UserIcon className="h-3.5 w-3.5 text-primary" /> Account
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Name</p>
            <p className="mt-1 font-medium">{profile?.full_name ?? "—"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Email</p>
            <p className="mt-1 font-medium break-all">{user?.email ?? "—"}</p>
          </div>
        </div>
        <div className="mt-5">
          <EditProfileButton label="Edit profile" />
        </div>
      </section>

      <section className="surface-card p-6">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-success" /> Privacy
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Your data is private and only visible to you. Persona reads only what you share.
        </p>
      </section>

      <section className="surface-card p-6">
        <h2 className="text-display text-lg">Session</h2>
        <p className="mt-1 text-xs text-muted-foreground">Sign out across this device.</p>
        <button
          onClick={handleLogout}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive transition-all hover:-translate-y-0.5 hover:bg-destructive/15"
        >
          <LogOut className="h-3.5 w-3.5" /> Log out
        </button>
      </section>
    </div>
  );
}
