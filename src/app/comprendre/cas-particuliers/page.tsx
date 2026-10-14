import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge, Callout, Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { references } from "@/components/ui/References";

export const metadata: Metadata = {
  title: "Cas particuliers : BTS, BUT, CPGE, licences, apprentissage, internats",
  description: "Ce que l'on sait, sources à l'appui, des spécificités de Parcoursup selon les formations : sélectives ou non, groupes de classement, internats, apprentissage, phase complémentaire.",
};

type Statut = "documente" | "partiel" | "non-couvert";
const CAS: { titre: string; statut: Statut; texte: React.ReactNode; refs: string[]; lien?: { href: string; label: string } }[] = [
  {
    titre: "Formations sélectives",
    statut: "documente",
    texte: "Un vœu peut être non classé : le candidat reçoit alors une réponse négative. Un taux minimum de boursiers s'applique ; il n'y a pas de taux de non-résidents.",
    refs: ["presentation-2023"],
  },
  {
    titre: "Formations non sélectives (licences notamment)",
    statut: "documente",
    texte: "Lorsque les candidatures dépassent la capacité, un taux minimum de boursiers et un taux maximum de non-résidents s'appliquent. Une formation non sélective peut, sous conditions, ne pas ordonner les candidatures : tous les candidats reçoivent alors une proposition dès le premier jour.",
    refs: ["presentation-2023", "code-education"],
  },
  {
    titre: "BTS",
    statut: "documente",
    texte: "Des groupes de classement distincts sont créés : un pour les bacheliers professionnels, éventuellement un pour les bacheliers technologiques, un pour les autres candidats. C'est ainsi qu'est mis en œuvre le taux minimal de bacheliers professionnels.",
    refs: ["presentation-2023"],
  },
  {
    titre: "BUT (IUT)",
    statut: "documente",
    texte: "Deux groupes de classement : bacheliers technologiques et autres candidats, ce qui met en œuvre le taux minimal de bacheliers technologiques.",
    refs: ["presentation-2023"],
  },
  {
    titre: "CPGE et formations avec internat",
    statut: "documente",
    texte: "Les vœux avec internat sont soumis à un classement internat propre et à une barre d'admission recalculée chaque jour. La documentation technique cite l'internat de CPGE comme cas typique.",
    refs: ["presentation-2023", "implementation-txt"],
    lien: { href: "/algorithmes/internats/", label: "L'algorithme des internats" },
  },
  {
    titre: "Classements mutualisés",
    statut: "documente",
    texte: "Plusieurs formations peuvent partager un même groupe de classement : groupements d'écoles d'ingénieurs avec classes préparatoires intégrées, instituts de formation en soins infirmiers, certains BTS ou formations paramédicales.",
    refs: ["presentation-2023"],
  },
  {
    titre: "Formations en apprentissage",
    statut: "partiel",
    texte: "Le répondeur automatique et l'ordonnancement des vœux ne s'appliquent pas aux vœux pour des formations recrutant sous statut d'apprenti. Les autres spécificités (contrat, employeur) ne sont pas décrites dans les sources étudiées.",
    refs: ["presentation-2023"],
  },
  {
    titre: "Phase complémentaire",
    statut: "documente",
    texte: "Ouverte aux candidats sans proposition ou insatisfaits, pour des formations ayant encore des places. La documentation 2023 indique dix nouveaux vœux. Le répondeur automatique ne s'y applique pas.",
    refs: ["presentation-2023"],
  },
  {
    titre: "Affectations hors procédure principale",
    statut: "partiel",
    texte: "Le code distingue des vœux « affectés hors procédure principale » : selon ses commentaires, par une CAES, en phase complémentaire ou lors d'une inscription à la rentrée. Les modalités de ces procédures ne sont pas décrites dans le code.",
    refs: ["code-miroir"],
  },
  {
    titre: "Réorientation",
    statut: "partiel",
    texte: "La plateforme s'adresse aussi aux étudiants en réorientation. Les sources étudiées ne décrivent pas de règle algorithmique spécifique.",
    refs: ["presentation-2023"],
  },
  {
    titre: "PASS et L.AS",
    statut: "non-couvert",
    texte: "Non couvert par les sources étudiées (code et présentation des algorithmes). Consultez les informations officielles de la plateforme et des universités.",
    refs: ["parcoursup-site"],
  },
  {
    titre: "Candidatures internationales",
    statut: "non-couvert",
    texte: "Non couvert par les sources étudiées. Les conditions d'accès des candidats étrangers relèvent de procédures décrites sur le site officiel.",
    refs: ["parcoursup-site"],
  },
  {
    titre: "Situations de handicap",
    statut: "non-couvert",
    texte: "Non couvert par les sources étudiées. Les dispositifs d'accompagnement sont décrits par la plateforme et les établissements.",
    refs: ["parcoursup-site"],
  },
];

const BADGES: Record<Statut, { t: string; ton: "vert" | "ambre" | "neutre" }> = {
  documente: { t: "Documenté", ton: "vert" },
  partiel: { t: "Partiellement documenté", ton: "ambre" },
  "non-couvert": { t: "Non couvert par nos sources", ton: "neutre" },
};

export default function CasParticuliers() {
  const ids = ["presentation-2023", "code-education", "implementation-txt", "code-miroir", "parcoursup-site"];
  const { R, Liste } = references(ids);
  return (
    <>
      <PageHeader
        miettes={[{ href: "/comprendre/", label: "Comprendre" }, { href: "/comprendre/cas-particuliers/", label: "Cas particuliers" }]}
        eyebrow="Module 7"
        titre="Cas particuliers"
        chapeau="Les règles ne sont pas identiques pour toutes les formations. Chaque fiche indique ce qui est documenté, et ce qui ne l'est pas dans les sources que nous avons pu vérifier."
        niveau="Approfondissement"
        duree={8}
        verification="14 octobre 2026"
      />
      <Container className="py-12">
        <Callout type="info" className="mb-10">
          Nous préférons signaler une absence d'information plutôt que de la combler par des suppositions. Les fiches « non couvertes » renvoient vers la source
          officielle.
        </Callout>
        <div className="grid gap-4 md:grid-cols-2">
          {CAS.map((c) => (
            <Reveal key={c.titre}>
              <article className="h-full rounded-3xl bg-surface p-6 shadow-soft ring-1 ring-line">
                <Badge ton={BADGES[c.statut].ton}>{BADGES[c.statut].t}</Badge>
                <h2 className="mt-3 font-display text-2xl font-semibold text-ink">{c.titre}</h2>
                <p className="mt-2 leading-relaxed text-ink-2">
                  {c.texte}
                  {c.refs.map((r) => (
                    <R key={r} id={r} />
                  ))}
                </p>
                {c.lien && (
                  <Link href={c.lien.href} className="mt-3 inline-block text-sm font-semibold text-primary underline underline-offset-2">
                    {c.lien.label}
                  </Link>
                )}
              </article>
            </Reveal>
          ))}
        </div>
        <section className="mt-16" aria-labelledby="evolutions">
          <h2 id="evolutions" className="font-display text-3xl font-semibold text-ink">
            Évolutions des règles algorithmiques d'une année à l'autre
          </h2>
          <ol className="mt-6 space-y-3 border-l-2 border-line pl-6">
            {[
              ["2019", "Répondeur automatique ; dispositif « meilleurs bacheliers »."],
              ["2020", "Drapeau d'arrêt des admissions par groupe ajouté au code."],
              ["2021", "Suppression du dispositif « meilleurs bacheliers » (abrogé par la loi du 24 décembre 2020) ; internats par sous-vœux."],
              ["2022", "Démission automatique des vœux archivés pendant la GDD ; algorithme internat mis à jour."],
              ["2023", "Ordonnancement des vœux en attente avant la fin de la phase principale."],
              ["2024", "Les groupes dont les admissions sont arrêtées sont exclus du calcul."],
              ["2025–2026", "Inconnu : aucune version plus récente du code n'a pu être consultée."],
            ].map(([a, t]) => (
              <li key={a} className="relative">
                <span className="absolute -left-[1.95rem] top-1.5 h-3 w-3 rounded-full bg-accent-2 ring-4 ring-bg" aria-hidden="true" />
                <span className="font-mono text-sm font-semibold text-ink">{a}</span>
                <p className="text-ink-2">{t}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted">
            D'après les messages de commit et les commentaires du dépôt officiel<R id="code-miroir" />.
          </p>
        </section>
        <Liste className="mt-14" />
      </Container>
    </>
  );
}
