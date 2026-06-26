import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings · PersonaAI" }] }),
  component: () => (
    <PlaceholderPage
      icon={Settings}
      eyebrow="Settings"
      title="Preferences, privacy, and presence."
      description="Tune how Persona understands and represents you."
    />
  ),
});
