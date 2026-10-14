import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout, Container } from "@/components/ui/primitives";
import { InternatDiagram } from "@/components/diagrams/InternatDiagram";
import { SectionNiveau } from "@/components/education/Niveau";
import { PseudoCode } from "@/components/education/PseudoCode";
import { Fidelite } from "@/components/education/Fidelite";
import { CodeLink } from "@/components/ui/CodeLink";
import { references } from "@/components/ui/References";
import { Terme } from "@/components/ui/Terme";

export const metadata: Metadata = {
  title: "Internats et Parcoursup : comment sont attribuées les places d'hébergement",
  description: "La barre d'admission à l'internat expliquée en animation, à partir de l'exemple officiel : deux classements, une capacité, une barre qui descend jusqu'à l'équilibre.",
};

export default function Internats() {
  const { R, Liste } = references(["presentation-2023", "code-miroir", "implementation-txt"]);
  return (
    <>
      <PageHeader
        miettes={[{ href: "/algorithmes/", label: "Les algorithmes" }, { href: "/algorithmes/internats/", label: "Internats" }]}
        eyebrow="Algorithme 3"
        titre="Les internats : concilier deux classements"
        chapeau="Pour une formation avec internat, il faut respecter à la fois l'ordre d'appel de la formation et le classement de l'internat, sans jamais dépasser le nombre de lits."
        niveau="Technique"
        duree={9}
        verification="14 octobre 2026"
      >
        <div className="mt-6">
          <Fidelite statut="conforme" />
        </div>
      </PageHeader>
      <Container size="md" className="space-y-16 py-12">
        <SectionNiveau niveau="Découverte" titre="Le problème" id="probleme">
          <div className="prose-ps">
            <p>
              Un candidat peut formuler un vœu avec internat, un vœu sans, ou les deux. Une proposition avec internat est aussi une proposition pour la formation.
              Exemple de la documentation : formation de 2 places, internat de 1 place ; A est 1er dans l'ordre d'appel mais 10e à l'internat, B est 2e dans
              l'ordre d'appel mais 1er à l'internat. Donner l'internat à B paraît évident… sauf si A exige l'internat<R id="presentation-2023" />.
            </p>
            <p>
              La solution de Parcoursup : une <Terme id="internat">barre d'admission à l'internat</Terme>, recalculée chaque jour. Un vœu avec internat ne reçoit de
              proposition que si le rang du candidat au classement internat est sous cette barre.
            </p>
          </div>
        </SectionNiveau>
      </Container>
      <Container size="xl" className="py-4">
        <InternatDiagram />
      </Container>
      <Container size="md" className="space-y-16 py-12">
        <SectionNiveau niveau="Approfondissement" titre="Comment la barre est calculée" id="calcul">
          <div className="prose-ps">
            <ol>
              <li>La barre part de sa valeur maximale (voir ci-dessous).</li>
              <li>Chaque formation descend dans son ordre d'appel en sautant les vœux avec internat situés au-delà de la barre.</li>
              <li>
                Si un internat reçoit plus de candidats que de lits, sa barre est abaissée juste en dessous du candidat qui crée la surcapacité, et les formations
                refont leur descente.
              </li>
              <li>On s'arrête quand aucun internat n'est en surcapacité<R id="presentation-2023" />.</li>
            </ol>
          </div>
        </SectionNiveau>
        <SectionNiveau niveau="Approfondissement" titre="Réserver des places aux mieux classés" id="reservation">
          <div className="prose-ps">
            <p>
              Si l'on remplissait l'internat au fil de l'eau, les premiers appelés le rempliraient même s'ils sont mal classés à l'internat. Pour plus d'équité,
              l'algorithme fixe une <strong>valeur maximale de la barre</strong> fondée sur une estimation du rang du dernier appelé à une « date de fin de
              réservation » : des places sont gardées pour les candidats bien classés à l'internat qui recevront probablement une proposition plus tard
              <R id="presentation-2023" />.
            </p>
            <p>
              Le premier jour, l'estimation est maximale (tous les candidats sont supposés appelables). Ensuite, elle est extrapolée à partir de la vitesse de
              descente dans l'ordre d'appel ; après la date de fin de réservation, la barre maximale est levée<R id="code-miroir" />.
            </p>
          </div>
          <Callout type="attention" titre="Une équité visée, pas garantie" className="mt-6">
            La documentation officielle le dit explicitement : garantir qu'à la rentrée les internes soient mieux classés à l'internat que ceux qui l'ont demandé
            sans l'obtenir supposerait une prédiction exacte des appels, impossible. L'estimation vise à s'en approcher<R id="presentation-2023" />.
          </Callout>
        </SectionNiveau>
        <SectionNiveau niveau="Technique" titre="Pseudo-code et code source" id="code">
          <PseudoCode
            titre="GroupeInternat.mettreAJourPositionAdmission()"
            lignes={[
              "compte ← 0",
              "pour chaque vœu en attente, trié par rang internat :",
              "  si le candidat a déjà l'internat : passer",
              "  si son rang internat > barre : retourner « inchangé »",
              "  si ce vœu a reçu une proposition :",
              "    compte ← compte + 1   // un candidat compte une seule fois",
              "    si compte > places libres de l'internat alors",
              "      barre ← rang internat de ce vœu − 1",
              "      retourner « modifié »   // les formations refont leur descente",
              "retourner « inchangé »",
            ]}
          />
          <div className="mt-6 grid gap-3">
            <CodeLink id="internatPosition" />
            <CodeLink id="internatMax" />
            <CodeLink id="estimationDernierAppele" />
            <CodeLink id="barreInternatVoeu" />
          </div>
        </SectionNiveau>
        <Liste />
      </Container>
    </>
  );
}
