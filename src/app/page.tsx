import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, Cpu, FileCheck2, GitBranch, Mail, ShieldCheck, Users } from "lucide-react";
import { HeroDiagram } from "@/components/diagrams/HeroDiagram";
import { QuiDecideDiagram } from "@/components/diagrams/QuiDecideDiagram";
import { OrdreAppelDiagram } from "@/components/diagrams/OrdreAppelDiagram";
import { ListeAttenteDiagram } from "@/components/diagrams/ListeAttenteDiagram";
import { ButtonLink, Callout, Container, Eyebrow, SectionTitle } from "@/components/ui/primitives";
import { CodeLink } from "@/components/ui/CodeLink";
import { Reveal } from "@/components/ui/Reveal";
import { Terme } from "@/components/ui/Terme";
import { OFFICIAL_REPO_GITLAB, REFERENCE_VERSION } from "@/content/sources";

export const metadata: Metadata = {
  title: { absolute: "Parcoursup Décrypté — Comment fonctionne Parcoursup, expliqué et animé" },
  description:
    "Comprendre Parcoursup : qui décide, classement pédagogique, ordre d'appel, quotas, listes d'attente, internats et répondeur automatique, à partir du code source officiel.",
};

const ETAPES = [
  { icone: Users, titre: "Vœux", texte: "Vous formulez et confirmez vos vœux, sans les classer entre eux." },
  { icone: FileCheck2, titre: "Examen", texte: "Chaque formation examine les dossiers et établit son classement." },
  { icone: Cpu, titre: "Ordre d'appel", texte: "L'algorithme national applique les taux légaux au classement." },
  { icone: Mail, titre: "Propositions", texte: "Chaque jour, les propositions partent dans l'ordre d'appel." },
  { icone: ArrowRight, titre: "Réponses", texte: "Chaque refus libère une place pour le candidat suivant." },
];

export default function Accueil() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent-2/15 blur-3xl" aria-hidden="true" />
        <Container size="xl" className="relative pb-16 pt-14 sm:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow className="justify-center">Observatoire citoyen indépendant</Eyebrow>
            <h1 className="mt-5 font-display text-[2.9rem] font-semibold leading-[1.02] tracking-tight text-ink text-balance sm:text-7xl">
              Parcoursup, <span className="bg-gradient-to-r from-primary via-primary-2 to-accent bg-clip-text text-transparent">enfin compréhensible.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-ink-2 sm:text-xl">
              Découvrez ce qui se passe vraiment entre votre candidature et votre admission. Explorez les algorithmes, suivez des schémas animés et
              comprenez les règles grâce aux données et aux sources officielles.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/comprendre/en-5-minutes/">Comprendre en 5 minutes</ButtonLink>
              <ButtonLink href="/algorithmes/" variante="secondaire">
                Voir les algorithmes animés
              </ButtonLink>
            </div>
          </div>
          <div className="mx-auto mt-14 max-w-6xl">
            <HeroDiagram />
          </div>
        </Container>
      </section>

      {/* ÉTAPES */}
      <section className="border-y border-line bg-surface py-20">
        <Container size="xl">
          <SectionTitle eyebrow="Parcoursup en quelques étapes" titre="Du vœu à l'admission, cinq mouvements" intro="Chaque étape a son acteur et ses règles. Les détails sont dans le parcours complet." />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ETAPES.map((e, i) => (
              <Reveal key={e.titre} delay={i * 0.08} as="li">
                <div className="group relative h-full rounded-3xl bg-bg p-6 ring-1 ring-line transition hover:-translate-y-1 hover:shadow-soft">
                  <span className="font-mono text-sm text-muted">0{i + 1}</span>
                  <e.icone className="mt-4 h-7 w-7 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink">{e.titre}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{e.texte}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <div className="mt-8">
            <ButtonLink href="/comprendre/etapes/" variante="fantome">
              Voir la frise complète de la procédure
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* QUI DÉCIDE */}
      <section className="py-24">
        <Container size="xl">
          <SectionTitle
            eyebrow="Qui décide réellement ?"
            titre="Ce n'est pas « l'algorithme » qui vous classe"
            intro={
              <>
                Le <Terme id="classement-pedagogique">classement</Terme> est décidé par chaque formation. L'algorithme national applique ensuite les taux fixés
                par la loi et le recteur, puis envoie les propositions. Cliquez sur chaque étape pour voir qui décide, ce qui est public et ce qui ne l'est pas.
              </>
            }
          />
          <div className="mt-10">
            <QuiDecideDiagram />
          </div>
        </Container>
      </section>

      {/* QUOTAS */}
      <section className="border-y border-line bg-surface py-24">
        <Container size="xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <SectionTitle eyebrow="Quotas et deux classements" titre="Pourquoi votre rang d'appel diffère de votre classement" />
              <div className="prose-ps mt-5">
                <p>
                  Pour respecter un <Terme id="taux-boursiers">taux minimum de boursiers</Terme>, l'algorithme fait remonter des candidats boursiers dans
                  l'ordre d'appel. Les autres candidats peuvent alors reculer de quelques places, dans une limite mathématiquement bornée.
                </p>
                <p>
                  L'animation reproduit l'exemple chiffré de la documentation officielle, calculé par notre portage du code : chaque place est attribuée
                  exactement comme dans Parcoursup.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/algorithmes/ordre-d-appel/">L'algorithme pas à pas</ButtonLink>
                <ButtonLink href="/comprendre/quotas-et-priorites/" variante="fantome">
                  Quotas et priorités
                </ButtonLink>
              </div>
            </div>
            <OrdreAppelDiagram exemple="boursiers-25" />
          </div>
        </Container>
      </section>

      {/* LISTES D'ATTENTE */}
      <section className="py-24">
        <Container size="xl">
          <SectionTitle
            eyebrow="Listes d'attente"
            titre="Quatre nombres qui ne disent pas la même chose"
            intro="Rang de classement, rang d'appel, position en liste d'attente, rang du dernier appelé : regardez-les évoluer sur quatre jours fictifs."
          />
          <div className="mt-10">
            <ListeAttenteDiagram />
          </div>
          <div className="mt-6">
            <ButtonLink href="/comprendre/listes-d-attente/" variante="fantome">
              Tout comprendre des listes d'attente
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* CODE */}
      <section className="relative overflow-hidden bg-[#0a1020] py-24 text-slate-200">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_10%,rgba(45,212,191,0.25),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(111,151,255,0.25),transparent_45%)]" aria-hidden="true" />
        <Container size="xl" className="relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-teal-300">Code source officiel</p>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">Le cœur de Parcoursup est public. Nous l'avons vérifié.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">
                Le ministère publie le code de l'ordre d'appel et du calcul des propositions sous licence libre. Nous l'avons compilé, exécuté, puis comparé à
                notre propre implémentation sur 730 situations : résultats identiques à 100 %, version {REFERENCE_VERSION}.
              </p>
              <dl className="mt-8 grid grid-cols-3 gap-4">
                {[
                  ["730", "cas comparés au code Java officiel"],
                  ["100 %", "de résultats identiques"],
                  ["AGPL", "licence libre du code"],
                ].map(([v, k]) => (
                  <div key={k} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <dd className="font-display text-3xl font-semibold text-white">{v}</dd>
                    <dt className="mt-1 text-xs leading-snug text-slate-400">{k}</dt>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={OFFICIAL_REPO_GITLAB} className="inline-flex items-center gap-2 rounded-full bg-teal-400 px-5 py-3 font-semibold text-[#04201d] hover:bg-teal-300">
                  <GitBranch className="h-4 w-4" aria-hidden="true" /> Dépôt officiel sur GitLab
                </a>
                <Link href="/algorithmes/conformite/" className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-white ring-1 ring-white/25 hover:bg-white/5">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Notre méthode de vérification
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              <CodeLink id="ordreAppelCalcul" />
              <CodeLink id="groupeAppel" />
              <CodeLink id="internatPosition" />
              <CodeLink id="repondeur" />
            </div>
          </div>
        </Container>
      </section>

      {/* DONNÉES + LIMITES */}
      <section className="py-24">
        <Container size="xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <Link href="/donnees/" className="group rounded-[28px] bg-surface p-8 shadow-soft ring-1 ring-line transition hover:-translate-y-1 hover:shadow-float">
              <BarChart3 className="h-8 w-8 text-accent" aria-hidden="true" />
              <h2 className="mt-5 font-display text-3xl font-semibold text-ink">Les chiffres des formations</h2>
              <p className="mt-3 leading-relaxed text-ink-2">
                Candidatures, propositions, admis, rang du dernier appelé : ce que disent les jeux de données publics, et ce qu'ils ne disent pas.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Explorer les données <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
            <Link href="/transparence/" className="group rounded-[28px] bg-surface p-8 shadow-soft ring-1 ring-line transition hover:-translate-y-1 hover:shadow-float">
              <ShieldCheck className="h-8 w-8 text-primary" aria-hidden="true" />
              <h2 className="mt-5 font-display text-3xl font-semibold text-ink">Ce qui est public, et ce qui ne l'est pas</h2>
              <p className="mt-3 leading-relaxed text-ink-2">
                Le code national est ouvert ; les outils locaux des commissions ne le sont pas. La carte de la transparence, élément par élément.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Voir la carte <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </div>
          <Callout type="attention" titre="Un projet indépendant, pas un outil de prédiction" className="mt-10">
            Parcoursup Décrypté n'est affilié ni au ministère ni à la plateforme. Les exemples sont fictifs : ils expliquent des mécanismes et ne permettent pas
            de prédire une admission réelle. Pour vos démarches, seul le site officiel parcoursup.gouv.fr fait foi.
          </Callout>
        </Container>
      </section>
    </>
  );
}
