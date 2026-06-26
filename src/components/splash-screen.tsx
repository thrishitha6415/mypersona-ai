import { useEffect, useState } from "react";
import { BrandLogo } from "./brand-logo";

const SEEN_KEY = "personaai:splash-seen";

export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Decide on the client only — prevents SSR hydration mismatch.
  useEffect(() => {
    setMounted(true);
    try {
      if (!sessionStorage.getItem(SEEN_KEY)) {
        setShow(true);
        sessionStorage.setItem(SEEN_KEY, "1");
        const leaveTimer = setTimeout(() => setLeaving(true), 2200);
        const hideTimer = setTimeout(() => setShow(false), 2900);
        return () => {
          clearTimeout(leaveTimer);
          clearTimeout(hideTimer);
        };
      }
    } catch {
      /* sessionStorage unavailable — skip splash */
    }
  }, []);

  if (!mounted || !show) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[100] grid place-items-center bg-background transition-opacity duration-700",
        leaving ? "opacity-0 pointer-events-none" : "opacity-100",
      ].join(" ")}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/15 blur-[100px]" />
      </div>

      <div className="relative flex flex-col items-center">
        <div className="splash-logo">
          <BrandLogo size={96} animated />
        </div>
        <div className="mt-8 text-center splash-text">
          <h1 className="text-display text-3xl tracking-tight">PersonaAI</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your AI Career Companion</p>
        </div>
      </div>

      <style>{`
        @keyframes splash-pop {
          0%   { opacity: 0; transform: scale(0.6) rotate(-90deg); filter: blur(8px); }
          55%  { opacity: 1; transform: scale(1.05) rotate(0deg); filter: blur(0); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes splash-rise {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .splash-logo {
          animation: splash-pop 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .splash-text {
          animation: splash-rise 0.8s ease-out 1s both;
        }
      `}</style>
    </div>
  );
}
