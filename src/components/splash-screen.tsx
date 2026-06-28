import { useEffect, useState } from "react";
import { BrandLogo } from "./brand-logo";

const SEEN_KEY = "personaai:splash-seen-v2";

export function SplashScreen() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      return;
    }
    setShow(true);
    const leaveTimer = setTimeout(() => setLeaving(true), 1800);
    const hideTimer = setTimeout(() => setShow(false), 2400);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[100] grid place-items-center bg-background transition-opacity duration-500",
        leaving ? "opacity-0 pointer-events-none" : "opacity-100",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[140px]" />
      </div>
      <div className="relative flex flex-col items-center animate-fade-in">
        <BrandLogo size={96} animated />
        <div className="mt-8 text-center">
          <h1 className="text-display text-3xl tracking-tight">PersonaAI</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your AI Career Companion</p>
        </div>
      </div>
    </div>
  );
}
