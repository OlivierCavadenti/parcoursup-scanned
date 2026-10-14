import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout, Container } from "@/components/ui/primitives";
import { ListeAttenteDiagram } from "@/components/diagrams/ListeAttenteDiagram";
import { PropositionsDiagram } from "@/components/diagrams/PropositionsDiagram";
import { SectionNiveau, Sommaire } from "@/components/education/Niveau";
import { CodeLink } from "@/components/ui/CodeLink";
import { references } from "@/components/ui/References";
import { Terme } from "@/components/ui/Terme";

export const metadata: Metadata = {
  title: "Comment fonctionne une liste d'attente Parcoursup ?",
  description: "Rang de classement, rang d'appel, position en liste d'attente, rang du dernier appelé : pourquoi votre rang bouge (ou ne bouge pas), expliqué en animation.",
};

export default function ListesAttente() {
  const { R, Liste } = references(["presentation-2023", "code-miroir", "methodo-2020"]);
  return (
    <>
      <PageHeader
        miettes={[{ href: "/comprendre/", label: "Comprendre" }, { href: "/comprendre/listes-d-attente/", label: "Listes d'attente" }]}
        eyebrow="Module 6"
        titre="Comment fonctionnent les listes d'attente ?"
        chapeau="Être « en attente » ne veut pas dire être refusé. Votre position dépend de votre rang d'appel, du nombre de places, et surtout des réponses des autres candidats."
        niveau="Découverte"
        duree={9}
        verification="14 octobre 2026"
      />
      <Container size="md" className="py-12">
        <Sommaire items={[{ id: "indicateurs", label: "Quatre indicateurs à distinguer" }, { id: "jour-apres-jour", label: "Jour après jour" }, { id: "pourquoi", label: "Pourquoi mon rang ne bouge pas ?" }, { id: "annee-precedente", label: "Le dernier appelé de l'année précédente" }, { id: "technique", label: "Ce que fait le code" }]} />
      </Container>
      <Container size="xl" className="pb-6">
        <ListeAttenteDiagram />
      </Container>
      <Container size="md" className="space-y-16 py-10">
        <SectionNiveau niveau="Découverte" titre="Quatre indicateurs à distinguer" id="indicateurs">
          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              ["Rang de classement", "Votre place dans le classement pédagogique de la formation. Décidé par la commission, il ne change pas.", "text-violet"],
              ["Rang dans l'ordre d'appel", "Votre place après application des taux (boursiers, résidents). Calculé une fois, il ne change pas.", "text-primary"],
              ["Position en liste d'attente", "Le nombre de candidats encore en attente devant vous, plus un. Elle baisse quand ceux qui vous précèdent reçoivent une proposition ou renoncent.", "text-accent"],
              ["Rang du dernier appelé", "Le plus haut rang d'appel ayant reçu une proposition. Il augmente au fil des refus et des désistements.", "text-green"],
            ].map(([t, d, c]) => (
              <div key={t} className="rounded-2xl bg-surface p-5 ring-1 ring-line">
                <dt className={`font-display text-xl font-semibold ${c}`}>{t}</dt>
                <dd className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{d}</dd>
              </div>
            ))}
          </dl>
          <p className="prose-ps mt-5">
            Vous êtes appelé quand le <Terme id="dernier-appele">rang du dernier appelé</Terme> atteint votre rang d'appel — autrement dit quand votre{" "}
            <Terme id="position-attente">position en liste d'attente</Terme> arrive à 1 et qu'une place se libère.
          </p>
        </SectionNiveau>
        <SectionNiveau niveau="Approfondissement" titre="Jour après jour" id="jour-apres-jour">
          <div className="prose-ps">
            <p>
              Chaque jour, l'algorithme compte les places disponibles : le nombre de recrutements souhaité par la formation, moins les candidats qui ont déjà une
              proposition en cours ou acceptée. Il descend ensuite dans l'ordre d'appel et propose ces places aux premiers candidats en attente
              <R id="presentation-2023" />. Une proposition sans réponse occupe une place jusqu'à la réponse ou jusqu'à l'expiration du délai.
            </p>
          </div>
        </SectionNiveau>
      </Container>
      <Container size="xl" className="pb-6">
        <PropositionsDiagram />
      </Container>
      <Container size="md" className="space-y-16 py-10">
        <SectionNiveau niveau="Approfondissement" titre="Pourquoi mon rang ne bouge pas ?" id="pourquoi">
          <div className="prose-ps">
            <ul>
              <li>
                <strong>Les candidats devant vous gardent leur proposition.</strong> Tant que personne ne refuse, aucune place ne se libère.
              </li>
              <li>
                <strong>Les places libérées vont d'abord aux mieux placés.</strong> Si dix candidats sont devant vous, il faut que dix d'entre eux soient servis ou
                partis avant votre tour.
              </li>
              <li>
                <strong>Les réponses arrivent avec un délai.</strong> Une proposition en attente de réponse bloque une place pendant le délai réglementaire.
              </li>
              <li>
                <strong>Des places d'internat peuvent bloquer un vœu avec hébergement</strong> même si la formation a encore des places : voir la page internats.
              </li>
            </ul>
          </div>
        </SectionNiveau>
        <SectionNiveau niveau="Approfondissement" titre="Le dernier appelé de l'année précédente" id="annee-precedente">
          <div className="prose-ps">
            <p>
              C'est un repère utile, mais <strong>pas une garantie</strong> : le nombre de candidats, leurs choix, la capacité d'accueil, les taux et les données
              d'appel peuvent changer d'une année à l'autre. Un rang inférieur à celui du dernier appelé l'an passé ne garantit donc pas une proposition ; un rang
              supérieur ne l'exclut pas.
            </p>
          </div>
          <Callout type="attention" titre="Taux d'accès ≠ probabilité individuelle" className="mt-6">
            Les statistiques publiques donnent un « taux d'accès » par formation. D'après la note méthodologique 2020 (repérée, non lue intégralement)
            <R id="methodo-2020" />, il s'agit d'une proportion de candidats classés jusqu'au rang du dernier appelé : cela décrit une formation, pas les chances
            d'un candidat donné.
          </Callout>
        </SectionNiveau>
        <SectionNiveau niveau="Technique" titre="Ce que fait le code" id="technique">
          <div className="prose-ps">
            <p>
              Le rang affiché sur liste d'attente est calculé par la fonction <code>mettreAJourRangsListeAttente</code> : on compte, dans l'ordre d'appel, les
              candidats distincts encore en attente ; à partir du deuxième jour, le rang affiché ne peut pas être plus mauvais que celui de la veille, avec un
              traitement spécifique des candidats réintégrés<R id="code-miroir" />. Nos schémas utilisent une version simplifiée, sans réintégrations.
            </p>
          </div>
          <div className="mt-6 grid gap-3">
            <CodeLink id="rangsListeAttente" />
            <CodeLink id="placesVacantes" />
          </div>
        </SectionNiveau>
        <Liste />
      </Container>
    </>
  );
}
