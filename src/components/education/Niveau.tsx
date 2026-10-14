import { Compass, Layers, Microscope } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Niveau as N } from "@/components/ui/PageHeader";

const CONF: Record<N, { icone: typeof Compass; cls: string; sous: string }> = {
  Découverte: { icone: Compass, cls: "bg-accent-soft text-accent", sous: "L'essentiel, sans prérequis" },
  Approfondissement: { icone: Layers, cls: "bg-violet-soft text-violet", sous: "Les règles précises et les cas particuliers" },
  Technique: { icone: Microscope, cls: "bg-primary-soft text-primary", sous: "Le code, le pseudo-code et les propriétés" },
};

/** Section d'une page explicative, marquée par son niveau de lecture. */
export function SectionNiveau({ niveau, titre, id, children, className }: { niveau: N; titre: string; id: string; children: React.ReactNode; className?: string }) {
  const c = CONF[niveau];
  const Icone = c.icone;
  return (
    <section aria-labelledby={id} className={cn("scroll-mt-24", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold", c.cls)}>
          <Icone className="h-3.5 w-3.5" aria-hidden="true" />
          {niveau}
        </span>
        <span className="text-xs text-muted">{c.sous}</span>
      </div>
      <h2 id={id} className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-[2.1rem]">
        {titre}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Sommaire({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="Sur cette page" className="rounded-2xl bg-surface p-5 ring-1 ring-line">
      <p className="text-xs font-bold uppercase tracking-wider text-muted">Sur cette page</p>
      <ol className="mt-3 space-y-2 text-sm">
        {items.map((it, i) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className="flex gap-2 text-ink-2 hover:text-ink">
              <span className="font-mono text-muted">{i + 1}.</span>
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
