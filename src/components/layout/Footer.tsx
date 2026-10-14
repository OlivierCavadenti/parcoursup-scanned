import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import { OFFICIAL_REPO_GITLAB, REFERENCE_COMMIT, REFERENCE_VERSION, DATE_ETUDE } from "@/content/sources";
import { LogoMark } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-lg font-semibold">{SITE.nom}</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            <strong className="font-semibold text-ink-2">Projet citoyen indépendant</strong>, non affilié au ministère ni à la
            plateforme Parcoursup. Il ne remplace pas les informations officielles et ne permet pas de prédire une admission.
            Pour toute démarche, référez-vous à <a className="underline underline-offset-2" href="https://www.parcoursup.gouv.fr/">parcoursup.gouv.fr</a>.
          </p>
        </div>
        <nav aria-label="Pied de page">
          <h2 className="text-sm font-semibold text-ink">Explorer</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link className="text-muted hover:text-ink" href={n.href}>
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="text-muted hover:text-ink" href="/glossaire/">Glossaire</Link>
            </li>
            <li>
              <Link className="text-muted hover:text-ink" href="/a-propos/">À propos et méthode</Link>
            </li>
          </ul>
        </nav>
        <div className="text-sm">
          <h2 className="font-semibold text-ink">Version de référence</h2>
          <p className="mt-3 text-muted">
            Algorithmes officiels, version <span className="font-mono text-ink-2">{REFERENCE_VERSION}</span> (commit{" "}
            <span className="font-mono text-ink-2">{REFERENCE_COMMIT.slice(0, 7)}</span>). Étude menée le {new Date(DATE_ETUDE).toLocaleDateString("fr-FR")}.
          </p>
          <p className="mt-3 text-muted">
            <a className="underline underline-offset-2" href={OFFICIAL_REPO_GITLAB}>Code officiel (GitLab)</a> ·{" "}
            <a className="underline underline-offset-2" href={SITE.depot}>Code de ce site</a> · licence AGPL-3.0
          </p>
        </div>
      </div>
    </footer>
  );
}
