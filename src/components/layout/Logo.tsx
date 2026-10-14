export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="11" fill="var(--primary)" />
      <path d="M10 13h10" stroke="var(--on-primary)" strokeWidth="3" strokeLinecap="round" opacity=".55" />
      <path d="M10 20h14" stroke="var(--on-primary)" strokeWidth="3" strokeLinecap="round" opacity=".8" />
      <path d="M10 27h7" stroke="var(--on-primary)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="29" cy="27" r="4.5" fill="var(--accent-2)" />
      <path d="M24.5 20 29 22.5" stroke="var(--accent-2)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
