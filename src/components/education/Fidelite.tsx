import { ShieldCheck, FlaskConical, BookOpen, CircleDashed } from "lucide-react";
import { cn } from "@/lib/cn";

export type StatutFidelite = "conforme" | "partiel" | "simplification" | "experimental";

const CONF: Record<StatutFidelite, { label: string; icone: typeof ShieldCheck; cls: string }> = {
  conforme: { label: "Conforme à la version officielle 2024-2", icone: ShieldCheck, cls: "bg-green-soft text-green ring-green/25" },
  partiel: { label: "Partiellement conforme", icone: CircleDashed, cls: "bg-amber-soft text-amber ring-amber/25" },
  simplification: { label: "Simplification pédagogique", icone: BookOpen, cls: "bg-violet-soft text-violet ring-violet/25" },
  experimental: { label: "Expérimental", icone: FlaskConical, cls: "bg-surface-2 text-ink-2 ring-line-strong" },
};

export function Fidelite({ statut, className }: { statut: StatutFidelite; className?: string }) {
  const c = CONF[statut];
  const Icone = c.icone;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset", c.cls, className)}>
      <Icone className="h-3.5 w-3.5" aria-hidden="true" />
      {c.label}
    </span>
  );
}
