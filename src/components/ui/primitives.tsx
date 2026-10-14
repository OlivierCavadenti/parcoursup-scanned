import Link from "next/link";
import { ArrowRight, Info, AlertTriangle, CheckCircle2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export function Container({ className, children, size = "lg" }: { className?: string; children: React.ReactNode; size?: "md" | "lg" | "xl" }) {
  const max = size === "md" ? "max-w-3xl" : size === "lg" ? "max-w-6xl" : "max-w-7xl";
  return <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", max, className)}>{children}</div>;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-accent", className)}>
      <span className="h-px w-6 bg-accent/60" aria-hidden="true" />
      {children}
    </p>
  );
}

type Ton = "neutre" | "primaire" | "accent" | "ambre" | "violet" | "rose" | "vert";
const TONS: Record<Ton, string> = {
  neutre: "bg-surface-2 text-ink-2 ring-line",
  primaire: "bg-primary-soft text-primary ring-primary/20",
  accent: "bg-accent-soft text-accent ring-accent/25",
  ambre: "bg-amber-soft text-amber ring-amber/25",
  violet: "bg-violet-soft text-violet ring-violet/25",
  rose: "bg-rose-soft text-rose ring-rose/25",
  vert: "bg-green-soft text-green ring-green/25",
};

export function Badge({ children, ton = "neutre", className }: { children: React.ReactNode; ton?: Ton; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", TONS[ton], className)}>
      {children}
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  variante = "primaire",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variante?: "primaire" | "secondaire" | "fantome";
  className?: string;
}) {
  const externe = href.startsWith("http");
  const cls = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.95rem] font-semibold transition focus-visible:outline-offset-4",
    variante === "primaire" && "bg-primary text-on-primary shadow-soft hover:bg-primary-2",
    variante === "secondaire" && "bg-surface text-ink ring-1 ring-line-strong hover:ring-ink/40",
    variante === "fantome" && "text-primary hover:bg-primary-soft",
    className,
  );
  const contenu = (
    <>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </>
  );
  return externe ? (
    <a href={href} className={cls}>
      {contenu}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {contenu}
    </Link>
  );
}

const CALLOUTS = {
  info: { icon: Info, cls: "bg-primary-soft/60 ring-primary/15", ic: "text-primary" },
  attention: { icon: AlertTriangle, cls: "bg-amber-soft/70 ring-amber/20", ic: "text-amber" },
  fait: { icon: CheckCircle2, cls: "bg-green-soft/60 ring-green/20", ic: "text-green" },
  inconnu: { icon: HelpCircle, cls: "bg-surface-2 ring-line-strong", ic: "text-muted" },
} as const;

export function Callout({ type = "info", titre, children, className }: { type?: keyof typeof CALLOUTS; titre?: string; children: React.ReactNode; className?: string }) {
  const c = CALLOUTS[type];
  const Icone = c.icon;
  return (
    <aside className={cn("flex gap-3.5 rounded-2xl p-5 ring-1 ring-inset", c.cls, className)}>
      <Icone className={cn("mt-0.5 h-5 w-5 shrink-0", c.ic)} aria-hidden="true" />
      <div className="text-[0.97rem] leading-relaxed text-ink-2">
        {titre && <p className="mb-1 font-semibold text-ink">{titre}</p>}
        {children}
      </div>
    </aside>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-3xl bg-surface p-6 shadow-soft ring-1 ring-line", className)}>{children}</div>;
}

export function SectionTitle({ eyebrow, titre, intro, className, id }: { eyebrow?: string; titre: React.ReactNode; intro?: React.ReactNode; className?: string; id?: string }) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className="mt-3 scroll-mt-24 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink text-balance sm:text-[2.6rem]">
        {titre}
      </h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-ink-2">{intro}</p>}
    </div>
  );
}
