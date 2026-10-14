import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout, Container } from "@/components/ui/primitives";
import { SOURCES, LIBELLES_STATUT, type Source } from "@/content/sources";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Sources et registre documentaire",
  description: "Toutes les sources utilisées par Parcoursup Décrypté : code officiel, documentation, textes juridiques, jeux de données, avec leur statut de vérification et leur date de consultation.",
};

const NATURES: Record<Source["nature"], string> = {
  "code-source": "Code source",
  "documentation-institutionnelle": "Documentation institutionnelle",
  "texte-juridique": "Textes juridiques",
  "jeu-de-donnees": "Jeux de données",
  "decision-de-justice": "Décisions de justice",
  "rapport-public": "Rapports publics",
  "publication-scientifique": "Travaux scientifiques",
  presse: "Presse",
};

export default function Sources() {
  const toutes = [...SOURCES.values()];
  return (
    <>
      <PageHeader
        miettes={[{ href: "/sources/", label: "Sources" }]}
        eyebrow="Registre documentaire"
        titre="Nos sources, et ce que nous en avons vérifié"
        chapeau="Chaque source porte un statut honnête : lue et vérifiée, citée par une source vérifiée, ou simplement repérée. Une source « à vérifier » ne fonde jamais seule une affirmation du site."
      />
      <Container className="py-12">
        <div className="mb-10 grid gap-3 sm:grid-cols-3">
          {(["verifie", "cite", "a-verifier"] as const).map((s) => (
            <div key={s} className="rounded-2xl bg-surface p-5 ring-1 ring-line">
              <p className={cn("font-display text-4xl font-semibold", s === "verifie" ? "text-green" : s === "cite" ? "text-primary" : "text-amber")}>
                {toutes.filter((x) => x.statut === s).length}
              </p>
              <p className="mt-1 text-sm text-ink-2">{LIBELLES_STATUT[s]}</p>
            </div>
          ))}
        </div>
        {(Object.keys(NATURES) as Source["nature"][]).map((n) => {
          const liste = toutes.filter((s) => s.nature === n);
          if (!liste.length) return null;
          return (
            <section key={n} className="mb-12" aria-labelledby={`nature-${n}`}>
              <h2 id={`nature-${n}`} className="font-display text-2xl font-semibold text-ink">
                {NATURES[n]}
              </h2>
              <ul className="mt-4 space-y-3">
                {liste.map((s) => (
                  <li key={s.id} id={s.id} className="scroll-mt-24 rounded-2xl bg-surface p-5 ring-1 ring-line">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <a href={s.url} className="font-semibold text-ink underline decoration-line-strong underline-offset-2 hover:decoration-ink">
                        {s.titre}
                        <ExternalLink className="ml-1 inline h-3.5 w-3.5 align-[-2px] text-muted" aria-hidden="true" />
                      </a>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", s.statut === "verifie" ? "bg-green-soft text-green" : s.statut === "cite" ? "bg-primary-soft text-primary" : "bg-amber-soft text-amber")}>
                        {LIBELLES_STATUT[s.statut]}
                      </span>
                    </div>
                    <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                      <div><dt className="inline">Organisation : </dt><dd className="inline text-ink-2">{s.organisation}</dd></div>
                      {s.datePublication && <div><dt className="inline">Publication : </dt><dd className="inline text-ink-2">{s.datePublication}</dd></div>}
                      {s.dateConsultation && <div><dt className="inline">Consultation : </dt><dd className="inline text-ink-2">{new Date(s.dateConsultation).toLocaleDateString("fr-FR")}</dd></div>}
                      {s.campagne && <div><dt className="inline">Campagne : </dt><dd className="inline text-ink-2">{s.campagne}</dd></div>}
                      {s.version && <div><dt className="inline">Version : </dt><dd className="inline text-ink-2">{s.version}</dd></div>}
                      {s.licence && <div><dt className="inline">Licence : </dt><dd className="inline text-ink-2">{s.licence}</dd></div>}
                    </dl>
                    {s.note && <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.note}</p>}
                    <p className="mt-2 break-all font-mono text-xs text-muted">{s.url}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        <Callout type="info" titre="Vérification des liens">
          Un script vérifie à chaque déploiement que les liens de ce registre répondent encore (<code>pnpm links:check</code>). Les liens cassés sont signalés
          dans le journal de déploiement.
        </Callout>
      </Container>
    </>
  );
}
