/**
 * Outline icon set for the landing page (Design Bible §19.4 v3.3 — icons are
 * outline only). Feather-style strokes, 24px grid, currentColor.
 */

function Svg({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export const IconCite = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 15l2 2 4-4" />
  </Svg>
);

export const IconMemory = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </Svg>
);

export const IconBrief = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M9 13l2 2 4-4" />
  </Svg>
);

export const IconLink = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </Svg>
);

export const IconKey = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="M10.7 12.3L21 2" />
    <path d="M15 7l3 3" />
    <path d="M18 4l2 2" />
  </Svg>
);

export const IconShield = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
);

export const IconZap = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </Svg>
);

export const IconUsers = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

export const IconCheck = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M20 6L9 17l-5-5" />
  </Svg>
);

export const IconChevron = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);
