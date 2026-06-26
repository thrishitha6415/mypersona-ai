type Props = {
  size?: number;
  className?: string;
  /** When true, animate the compass→P morph (used by splash). */
  animated?: boolean;
};

/**
 * PersonaAI mark — a minimalist "P" whose counter is a compass needle.
 * Blue → indigo gradient, designed to read at any size.
 */
export function BrandLogo({ size = 32, className, animated = false }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pa-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="pa-needle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0E7FF" />
          <stop offset="100%" stopColor="#A5B4FC" />
        </linearGradient>
      </defs>

      {/* Soft outer ring */}
      <circle cx="24" cy="24" r="22" stroke="url(#pa-grad)" strokeOpacity="0.25" strokeWidth="1.25" />

      {/* P stem */}
      <rect x="13" y="9" width="4.5" height="30" rx="2.25" fill="url(#pa-grad)" />

      {/* P bowl */}
      <path
        d="M17.5 11 H29 a8.5 8.5 0 0 1 0 17 H17.5 z"
        fill="url(#pa-grad)"
      />

      {/* Compass needle inside the bowl */}
      <g
        transform="translate(25.5 19.5)"
        className={animated ? "origin-center animate-[spin_2s_ease-in-out_1]" : undefined}
      >
        <circle r="5.5" fill="#0B1220" />
        <path d="M0 -4 L1.6 0 L0 4 L-1.6 0 Z" fill="url(#pa-needle)" />
        <circle r="0.9" fill="#0B1220" stroke="#A5B4FC" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
