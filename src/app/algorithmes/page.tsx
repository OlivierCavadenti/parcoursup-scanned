import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowDownToLine, ArrowUpFromLine, Gauge, TestTubes } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout, Container } from "@/components/ui/primitives";
import { Fidelite } from "@/components/education/Fidelite";
import { Reveal } from "@/components/ui/Reveal";
import { ALGORITHMES } from "@/content/algorithmes";
import { CODE_REFS, lienGitlab } from "@/content/code-refs";
import { OFFICIAL_REPO_GITLAB, REFERENCE_COMMIT, REFERENCE_DATE, REFERENCE_VERSION } from "@/content/sources";

export const metadata: Metadata = {
  title: "Comment fonctionne l'algorithme Parcoursup ? Le code source expliqué",
  description: "Explorateur du code source officiel de Parcoursup : ordre d'appel, propositions, internats, répondeur automatique. Entrées, sorties, complexité, tests et liens vers le GitLab.",
};

export default function Algorithmes() {
  return (
    <>
      <PageHeader
        eyebrow="Explorateur du code source"
        titre="Les algorithmes de Parcoursup, ligne par ligne"
        chapeau={
          <>
            Le code public couvre deux grands calculs : l'ordre d'appel (une fois par campagne) et les propositions (chaque jour). Chaque fiche renvoie vers le
            fichier exact du <a className="underline underline-offset-4" href={OFFICIAL_REPO_GITLAB}>dépôt officiel sur GitLab</a>.
          </>
        }
        miettes={[{ href: "/algorithmes/", label: "Les algorithmes" }]}
        niveau="Technique"
      >
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-surface px-3 py-1 ring-1 ring-line">
            Version de référence <strong className="font-mono">{REFERENCE_VERSION}</strong>
          </span>
          <span className="rounded-full bg-surface px-3 py-1 ring-1 ring-line">
            Commit <strong className="font-mono">{REFERENCE_COMMIT.slice(0, 7)}</strong> du {new Date(REFERENCE_DATE).toLocaleDateString("fr-FR")}
          </span>
          <span className="rounded-full bg-surface px-3 py-1 ring-1 ring-line">Licence AGPL-3.0</span>
        </div>
      </PageHeader>
      <Container className="space-y-6 py-12">
        {ALGORITHMES.map((a, i) => (
          <Reveal key={a.slug}>
            <article className="grid gap-6 rounded-[28px] bg-surface p-6 shadow-soft ring-1 ring-line sm:p-8 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm text-muted">0{i + 1}</span>
                  <Fidelite statut={a.fidelite} />
                </div>
                <h2 className="mt-3 font-display text-3xl font-semibold text-ink">{a.titre}</h2>
                <p className="mt-3 text-lg leading-relaxed text-ink-2">{a.role}</p>
                <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="flex items-center gap-1.5 font-semibold text-ink">
                      <ArrowDownToLine className="h-4 w-4 text-accent" aria-hidden="true" /> Entrées
                    </dt>
                    <dd className="mt-1 text-ink-2">
                      <ul className="list-disc space-y-1 pl-4">{a.entrees.map((e) => <li key={e}>{e}</li>)}</ul>
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 font-semibold text-ink">
                      <ArrowUpFromLine className="h-4 w-4 text-primary" aria-hidden="true" /> Sorties
                    </dt>
                    <dd className="mt-1 text-ink-2">
                      <ul className="list-disc space-y-1 pl-4">{a.sorties.map((e) => <li key={e}>{e}</li>)}</ul>
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 font-semibold text-ink">
                      <Gauge className="h-4 w-4 text-violet" aria-hidden="true" /> Complexité
                    </dt>
                    <dd className="mt-1 text-ink-2">{a.complexite}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 font-semibold text-ink">
                      <TestTubes className="h-4 w-4 text-green" aria-hidden="true" /> Tests
                    </dt>
                    <dd className="mt-1 text-ink-2">{a.tests}</dd>
                  </div>
                </dl>
                <Link href={`/algorithmes/${a.slug}/`} className="group mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-on-primary hover:bg-primary-2">
                  Voir le schéma animé <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
              <div className="space-y-2 rounded-3xl bg-[#0d1426] p-5 ring-1 ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Dans le code officiel</p>
                {a.code.map((c) => {
                  const r = CODE_REFS[c];
                  return (
                    <a key={c} href={lienGitlab(r)} className="block rounded-xl bg-white/5 p-3 ring-1 ring-white/10 transition hover:bg-white/10">
                      <span className="block font-mono text-sm font-semibold text-teal-200">{r.titre}</span>
                      <span className="mt-0.5 block text-xs text-slate-400">{r.resume}</span>
                      <span className="mt-1 block font-mono text-[0.7rem] text-slate-500">
                        {r.fichier.split("/").pop()} · L{r.debut}–{r.fin} ↗
                      </span>
                    </a>
                  );
                })}
              </div>
            </article>
          </Reveal>
        ))}
        <Callout type="info" titre="Comment savons-nous que nos schémas sont exacts ?">
          Nous avons réécrit ces algorithmes en TypeScript et comparé les résultats avec ceux du code Java officiel, exécuté sur les mêmes données.{" "}
          <Link href="/algorithmes/conformite/" className="font-semibold text-primary underline underline-offset-2">
            Voir la méthode de vérification
          </Link>
          .
        </Callout>
      </Container>
    </>
  );
}
