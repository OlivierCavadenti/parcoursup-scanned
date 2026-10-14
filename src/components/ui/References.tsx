import { ExternalLink } from "lucide-react";
import { source, LIBELLES_STATUT, type Source } from "@/content/sources";
import { cn } from "@/lib/cn";

/**
 * Système de références numérotées par page.
 *   const { R, Liste } = references(["presentation-2023", "code-miroir"]);
 *   <p>… <R id="presentation-2023" /></p> … <Liste />
 */
export function references(ids: string[]) {
  const liste: Source[] = ids.map(source);
  const numero = (id: string) => {
    const n = ids.indexOf(id);
    if (n < 0) throw new Error(`Référence ${id} non déclarée sur la page`);
    return n + 1;
  };
  function R({ id, page }: { id: string; page?: string }) {
    const n = numero(id);
    const s = liste[n - 1]!;
    return (
      <sup className="ml-0.5">
        <a href={`#ref-${id}`} className="rounded px-0.5 font-sans text-[0.72em] font-semibold text-primary no-underline hover:underline" title={`${s.titre}${page ? `, ${page}` : ""}`} aria-label={`Référence ${n} : ${s.titre}`}>
          [{n}]
        </a>
      </sup>
    );
  }
  function Liste({ className }: { className?: string }) {
    return (
      <section aria-labelledby="titre-references" className={cn("rounded-3xl bg-surface-2/70 p-6 ring-1 ring-line sm:p-8", className)}>
        <h2 id="titre-references" className="font-display text-2xl font-semibold text-ink">
          Sources de cette page
        </h2>
        <ol className="mt-5 space-y-4">
          {liste.map((s, i) => (
            <li key={s.id} id={`ref-${s.id}`} className="flex scroll-mt-24 gap-3 text-sm leading-relaxed">
              <span className="mt-0.5 font-semibold text-primary">[{i + 1}]</span>
              <div>
                <a href={s.url} className="font-medium text-ink underline decoration-line-strong underline-offset-2 hover:decoration-ink">
                  {s.titre}
                  <ExternalLink className="ml-1 inline h-3.5 w-3.5 align-[-2px] text-muted" aria-hidden="true" />
                </a>
                <p className="text-muted">
                  {s.organisation}
                  {s.datePublication ? ` · publié ${s.datePublication}` : ""}
                  {s.version ? ` · version ${s.version}` : ""}
                  {s.dateConsultation ? ` · consulté le ${new Date(s.dateConsultation).toLocaleDateString("fr-FR")}` : ""}
                  {" · "}
                  <span className={s.statut === "verifie" ? "text-green" : s.statut === "cite" ? "text-ink-2" : "text-amber"}>{LIBELLES_STATUT[s.statut]}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }
  return { R, Liste };
}
