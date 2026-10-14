export type Verdict = "Faux" | "Plutôt faux" | "Ça dépend" | "Vrai, mais";

export interface IdeeRecue {
  id: string;
  affirmation: string;
  verdict: Verdict;
  reponse: string;
  explication: string;
  contreExemple: string;
  schema?: { href: string; label: string };
  sources: string[];
}

export const IDEES: IdeeRecue[] = [
  {
    id: "parcoursup-choisit",
    affirmation: "« Parcoursup choisit les élèves à la place des établissements. »",
    verdict: "Faux",
    reponse: "Le classement est établi par chaque formation ; l'algorithme national ne lit aucun dossier.",
    explication:
      "La commission d'examen des vœux de chaque formation classe les candidats. L'algorithme national reçoit ce classement, applique les taux légaux pour calculer l'ordre d'appel, puis envoie les propositions dans cet ordre selon les places disponibles.",
    contreExemple: "Sans taux applicable, l'ordre d'appel est strictement identique au classement de la formation : l'algorithme ne change rien à son choix.",
    schema: { href: "/comprendre/qui-decide/", label: "Qui décide quoi" },
    sources: ["presentation-2023"],
  },
  {
    id: "memes-criteres",
    affirmation: "« Toutes les formations utilisent les mêmes critères. »",
    verdict: "Faux",
    reponse: "Chaque formation définit ses propres critères d'examen.",
    explication: "La documentation officielle précise que la commission classe « sur la base des critères d'examen des vœux qu'elle définit ». Les pondérations précises ne sont pas publiées par le code national.",
    contreExemple: "Deux licences de même intitulé dans deux universités peuvent afficher des critères différents.",
    schema: { href: "/comprendre/examen-des-dossiers/", label: "L'examen des dossiers" },
    sources: ["presentation-2023"],
  },
  {
    id: "position-fixe",
    affirmation: "« Ma position sur liste d'attente ne change jamais. »",
    verdict: "Faux",
    reponse: "Votre rang d'appel ne change pas ; votre position en liste d'attente, si.",
    explication: "Chaque refus ou renoncement d'un candidat placé devant vous vous fait gagner une position. Elle peut stagner plusieurs jours si personne devant vous ne libère de place.",
    contreExemple: "Dans notre exemple animé, un candidat passe de la 11e à la 4e position en une journée, puis reçoit une proposition le quatrième jour.",
    schema: { href: "/comprendre/listes-d-attente/", label: "La liste d'attente animée" },
    sources: ["presentation-2023", "code-miroir"],
  },
  {
    id: "dernier-appele-garantie",
    affirmation: "« Le rang du dernier appelé de l'année dernière garantit une admission. »",
    verdict: "Faux",
    reponse: "C'est un repère, pas une garantie.",
    explication: "Le rang du dernier appelé dépend du nombre de candidats, de leurs choix, de la capacité, des taux et des données d'appel, qui changent d'une année à l'autre.",
    contreExemple: "Si davantage de candidats bien classés acceptent leur proposition une année, le dernier appelé sera plus haut dans l'ordre d'appel que l'année précédente.",
    schema: { href: "/comprendre/listes-d-attente/", label: "Les indicateurs d'attente" },
    sources: ["presentation-2023"],
  },
  {
    id: "secret",
    affirmation: "« Le fonctionnement de Parcoursup est entièrement secret. »",
    verdict: "Plutôt faux",
    reponse: "Le cœur algorithmique national est public ; les pratiques locales des commissions le sont beaucoup moins.",
    explication: "Le code de l'ordre d'appel et des propositions est publié sous licence libre, avec une documentation détaillée. Les outils locaux d'aide à la décision et les pondérations des commissions ne font pas partie de cette publication.",
    contreExemple: "Nous avons compilé le code officiel et reproduit ses résultats à l'identique sur 730 situations.",
    schema: { href: "/transparence/", label: "La carte de la transparence" },
    sources: ["code-gitlab", "code-miroir", "next-algos-locaux"],
  },
  {
    id: "quotas-partout",
    affirmation: "« Les quotas fonctionnent de la même manière partout. »",
    verdict: "Faux",
    reponse: "Les taux sont fixés formation par formation, et tous ne s'appliquent pas à toutes les formations.",
    explication: "Le taux minimum de boursiers concerne les formations sélectives et les non sélectives en tension ; le taux de non-résidents, seulement ces dernières ; les taux de bacheliers professionnels et technologiques (BTS, IUT) passent par des groupes de classement distincts.",
    contreExemple: "Une formation sélective n'a pas de taux de non-résidents ; une licence en tension peut avoir les deux taux.",
    schema: { href: "/comprendre/quotas-et-priorites/", label: "Quotas et priorités" },
    sources: ["presentation-2023"],
  },
  {
    id: "non-selective",
    affirmation: "« Une formation non sélective accueille nécessairement tout le monde. »",
    verdict: "Ça dépend",
    reponse: "Elle ne peut pas « refuser » un candidat comme une formation sélective, mais si les candidatures dépassent la capacité, tout le monde n'est pas appelé tout de suite.",
    explication: "Quand la demande excède la capacité, les candidats sont classés, des taux s'appliquent, et les propositions suivent l'ordre d'appel dans la limite des places. Lorsque la formation n'ordonne pas les candidatures, tous reçoivent une proposition dès le premier jour.",
    contreExemple: "Une licence très demandée peut laisser des candidats en liste d'attente pendant plusieurs semaines.",
    schema: { href: "/algorithmes/propositions/", label: "Le calcul des propositions" },
    sources: ["presentation-2023", "code-education"],
  },
  {
    id: "accepter-renoncer",
    affirmation: "« Accepter une proposition oblige à renoncer à tous ses autres vœux. »",
    verdict: "Faux",
    reponse: "On peut accepter une proposition tout en gardant des vœux en attente.",
    explication: "L'acceptation n'est pas définitive : le candidat peut y renoncer plus tard au profit d'une proposition qu'il préfère. En fin de procédure, il doit en revanche ordonner les vœux en attente qu'il souhaite conserver.",
    contreExemple: "Dans l'exemple officiel de la section 6, le candidat garde F1 acceptée et attend F3, F4 et F5.",
    schema: { href: "/algorithmes/repondeur-automatique/", label: "Vœux ordonnés et répondeur" },
    sources: ["presentation-2023"],
  },
  {
    id: "boursier-devant",
    affirmation: "« Un candidat boursier passe toujours devant tout le monde. »",
    verdict: "Faux",
    reponse: "Un boursier remonte seulement quand c'est nécessaire pour respecter le taux.",
    explication: "À chaque place, l'algorithme vérifie si le taux minimum de boursiers serait respecté. S'il l'est, il prend simplement le candidat suivant du classement, boursier ou non. Un boursier n'est jamais appelé après un candidat qu'il devance au classement.",
    contreExemple: "Dans l'exemple officiel à 25 %, le troisième boursier (17e au classement) n'est appelé qu'en 9e position.",
    schema: { href: "/algorithmes/ordre-d-appel/", label: "L'ordre d'appel animé" },
    sources: ["presentation-2023", "code-miroir"],
  },
];
