import type { CodeRefId } from "./code-refs";

export type Acteur = "candidat" | "etablissement" | "autorite" | "plateforme";

export const ACTEURS: Record<Acteur, { libelle: string; couleur: string; soft: string; texte: string }> = {
  candidat: { libelle: "Le candidat", couleur: "bg-accent-2", soft: "bg-accent-soft", texte: "text-accent" },
  etablissement: { libelle: "L'établissement", couleur: "bg-violet-2", soft: "bg-violet-soft", texte: "text-violet" },
  autorite: { libelle: "La loi et le recteur", couleur: "bg-amber-2", soft: "bg-amber-soft", texte: "text-amber" },
  plateforme: { libelle: "L'algorithme national", couleur: "bg-primary-2", soft: "bg-primary-soft", texte: "text-primary" },
};

export interface EtapeDecision {
  id: string;
  titre: string;
  acteur: Acteur;
  court: string;
  decide: string[];
  public: string[];
  nonPublic: string[];
  code?: CodeRefId[];
  sources: string[];
}

/**
 * Contenu fondé sur la « Présentation des algorithmes de Parcoursup » (mai 2023, §2 à §6)
 * et le code officiel. Les éléments « non publics » sont ceux dont aucune source
 * consultée n'assure la publication.
 */
export const CHAINE_DECISION: EtapeDecision[] = [
  {
    id: "candidat",
    titre: "Candidat",
    acteur: "candidat",
    court: "Formule et confirme ses vœux",
    decide: [
      "Les formations demandées (vœux et sous-vœux), sans les classer entre elles pendant la phase principale.",
      "S'il demande l'internat : un vœu avec hébergement, et éventuellement un second sans.",
    ],
    public: ["Les règles des vœux et sous-vœux (code de l'éducation, art. D. 612-1-11, cité par la documentation officielle)."],
    nonPublic: ["Sans objet : pendant la phase principale, l'algorithme ne reçoit aucun ordre de préférence entre les vœux (rang de préférence à 0 dans le code), sauf si le candidat les ordonne en vue de la fin de phase."],
    sources: ["presentation-2023", "code-education"],
  },
  {
    id: "formation",
    titre: "Formation",
    acteur: "etablissement",
    court: "Fixe ses critères et sa capacité",
    decide: [
      "Les critères d'examen des vœux, explicités sur la plateforme au moment de l'inscription.",
      "Les « données d'appel » : taux d'appel supplémentaire ou appel par bloc (rang limite), ajustables chaque jour dans la limite de seuils prudentiels.",
    ],
    public: ["La capacité d'accueil, renseignée sur Parcoursup.", "Les critères généraux d'examen affichés sur la fiche de la formation."],
    nonPublic: ["Le détail des données d'appel fixées jour après jour n'est pas publié dans les jeux de données consultés."],
    code: ["placesVacantes"],
    sources: ["presentation-2023", "code-education"],
  },
  {
    id: "commission",
    titre: "Commission d'examen",
    acteur: "etablissement",
    court: "Examine et classe les dossiers",
    decide: [
      "Constituée par le chef d'établissement, elle examine les vœux et établit le classement pédagogique selon ses critères.",
      "Une formation non sélective peut, dans certaines conditions, ne pas ordonner les candidatures (art. D. 612-1-13).",
    ],
    public: ["Le principe et le cadre réglementaire de l'examen des vœux."],
    nonPublic: ["Les pondérations exactes, les barèmes et les éventuels outils locaux d'aide à la décision : ils ne font pas partie du code national publié."],
    sources: ["presentation-2023", "next-algos-locaux"],
  },
  {
    id: "classement",
    titre: "Classement",
    acteur: "etablissement",
    court: "Transmis à la plateforme",
    decide: [
      "Un rang pour chaque candidat retenu ; les candidats non classés d'une formation sélective reçoivent une réponse négative.",
      "Des classements séparés par groupes sont possibles : par exemple bacheliers professionnels, technologiques et autres en BTS.",
    ],
    public: ["D'après les commentaires du code (Voeu.java), c'est le rang dans l'ordre d'appel (champ C_CG_ORD_APP_AFF) qui est affiché au candidat."],
    nonPublic: ["Les classements individuels ne sont pas publics (données personnelles)."],
    sources: ["presentation-2023"],
  },
  {
    id: "regles",
    titre: "Règles nationales",
    acteur: "autorite",
    court: "Taux boursiers et résidents",
    decide: [
      "Le recteur de région académique fixe, après concertation, un taux minimum de boursiers (formations sélectives et non sélectives en tension).",
      "Pour les formations non sélectives en tension, un taux maximum de non-résidents de l'académie ; en cas de conflit, le taux boursier prime (loi du 8 mars 2018).",
    ],
    public: ["Les taux sont publiés par les recteurs et affichés sur Parcoursup.", "Le cadre légal (art. L. 612-3 du code de l'éducation)."],
    nonPublic: ["Les valeurs de taux par formation ne figurent pas dans le code ; ce sont des paramètres d'entrée."],
    sources: ["presentation-2023", "loi-ore", "code-education"],
  },
  {
    id: "ordre",
    titre: "Ordre d'appel",
    acteur: "plateforme",
    court: "Calculé une seule fois",
    decide: [
      "L'algorithme national transforme le classement pédagogique en ordre d'appel en faisant remonter des boursiers et/ou des résidents pour respecter les taux.",
      "Sans taux applicable, l'ordre d'appel est identique au classement pédagogique.",
    ],
    public: ["Le code source (licence AGPL-3.0), sa documentation et ses propriétés mathématiques vérifiées après chaque calcul."],
    nonPublic: ["Rien sur le principe ; seules les données d'entrée réelles (classements, statuts) ne sont pas publiques."],
    code: ["ordreAppelCalcul", "ordreAppelSelection"],
    sources: ["presentation-2023", "code-miroir"],
  },
  {
    id: "propositions",
    titre: "Propositions",
    acteur: "plateforme",
    court: "Envoyées chaque jour",
    decide: [
      "Chaque jour, dans chaque groupe, les propositions sont envoyées en suivant l'ordre d'appel tant qu'il reste des places (selon les données d'appel de la formation) et dans la limite des places d'internat.",
    ],
    public: ["L'algorithme de calcul quotidien, y compris la gestion des internats et du répondeur automatique."],
    nonPublic: ["Les données quotidiennes réelles (qui a répondu, quand) ne sont pas publiées, hors statistiques agrégées."],
    code: ["propositionsCalcule", "groupeAppel"],
    sources: ["presentation-2023", "code-miroir"],
  },
  {
    id: "reponses",
    titre: "Réponses",
    acteur: "candidat",
    court: "Accepter, refuser, attendre",
    decide: [
      "Accepter ou refuser chaque proposition dans le délai réglementaire ; l'acceptation n'est pas définitive tant qu'il garde des vœux en attente.",
      "Ordonner ses vœux en attente et, s'il le souhaite, activer le répondeur automatique pour la phase de gestion des démissions.",
    ],
    public: ["Les délais (art. D. 612-1-14 et arrêté calendrier annuel).", "Le fonctionnement du répondeur automatique (code publié)."],
    nonPublic: ["Les choix des autres candidats, qui déterminent en pratique le rythme d'avancée des listes d'attente."],
    code: ["repondeur"],
    sources: ["presentation-2023", "arrete-calendrier-2023"],
  },
];
