import type { Acteur } from "./qui-decide";

export interface Phase {
  id: string;
  titre: string;
  acteurs: Acteur[];
  resume: string;
  details: string[];
  algorithme?: string;
  lien?: { href: string; label: string };
}

/**
 * Grandes phases de la procédure, d'après la présentation officielle des algorithmes
 * (mai 2023, §2 et §6). Les dates exactes sont fixées chaque année par arrêté : elles
 * ne sont pas reproduites ici pour éviter toute information périmée.
 */
export const PHASES: Phase[] = [
  {
    id: "inscription",
    titre: "Inscription et formulation des vœux",
    acteurs: ["candidat"],
    resume: "Le candidat s'inscrit et formule ses vœux, éventuellement des sous-vœux pour des formations regroupées, et peut demander l'internat.",
    details: [
      "Un vœu peut regrouper plusieurs formations similaires : chacune est alors un sous-vœu.",
      "Pour une formation avec internat, le candidat peut formuler un vœu avec hébergement et un vœu sans, ou seulement un vœu avec hébergement : l'internat devient alors une condition.",
      "Les vœux ne sont pas hiérarchisés pendant la phase principale.",
    ],
  },
  {
    id: "confirmation",
    titre: "Confirmation des vœux et dossier",
    acteurs: ["candidat"],
    resume: "Le candidat complète son dossier et confirme chaque vœu. Seuls les vœux confirmés peuvent donner lieu à une proposition.",
    details: ["« Un candidat ne reçoit de proposition d'admission que pour des vœux qu'il a formulés et confirmés » (présentation officielle, §2.5)."],
  },
  {
    id: "examen",
    titre: "Examen des vœux par les formations",
    acteurs: ["etablissement"],
    resume: "Chaque formation réunit une commission d'examen des vœux qui étudie les dossiers selon ses critères et établit un classement pédagogique.",
    details: [
      "Des classements distincts par groupes de candidats sont possibles dans les formations sélectives.",
      "Les vœux pour l'internat font l'objet d'un classement internat propre.",
    ],
    lien: { href: "/comprendre/examen-des-dossiers/", label: "L'examen des dossiers" },
  },
  {
    id: "ordre",
    titre: "Calcul des ordres d'appel",
    acteurs: ["autorite", "plateforme"],
    resume: "Avant la phase d'admission, l'algorithme national calcule une fois pour toutes l'ordre d'appel de chaque groupe, à partir du classement et des taux fixés par le recteur.",
    details: ["Sans taux applicable, l'ordre d'appel est le classement pédagogique."],
    algorithme: "Algorithme de l'ordre d'appel",
    lien: { href: "/algorithmes/ordre-d-appel/", label: "Voir l'algorithme animé" },
  },
  {
    id: "admission",
    titre: "Phase principale d'admission",
    acteurs: ["plateforme", "candidat"],
    resume: "Chaque jour, les propositions partent dans l'ordre d'appel tant qu'il reste des places. Les candidats répondent dans les délais ; chaque refus libère une place pour le suivant.",
    details: [
      "Accepter une proposition n'empêche pas de garder d'autres vœux en attente.",
      "Une proposition non acceptée dans le délai est supprimée pour pouvoir être faite à d'autres candidats.",
    ],
    algorithme: "Algorithme des propositions",
    lien: { href: "/algorithmes/propositions/", label: "Les propositions jour après jour" },
  },
  {
    id: "ordonnancement",
    titre: "Ordonnancement des vœux en attente",
    acteurs: ["candidat"],
    resume: "Pour conserver des vœux en attente en fin de phase principale, le candidat doit les classer par ordre de préférence (obligation décrite dans la documentation 2023).",
    details: ["Avant d'ordonner, le candidat répond à ses propositions pour en conserver au plus une."],
    lien: { href: "/algorithmes/repondeur-automatique/", label: "Vœux ordonnés et répondeur" },
  },
  {
    id: "gdd",
    titre: "Phase de gestion des démissions (GDD)",
    acteurs: ["plateforme", "candidat"],
    resume: "Les places libérées après la phase principale (désistements, démissions, non-inscriptions) sont proposées aux candidats ayant gardé des vœux. Le répondeur automatique est facultatif.",
    details: [
      "Une nouvelle proposition supprime automatiquement les vœux moins bien classés dans l'ordre de préférence.",
      "Avec le répondeur, la meilleure proposition est acceptée automatiquement.",
    ],
    algorithme: "Répondeur automatique et démissions automatiques",
  },
  {
    id: "complementaire",
    titre: "Phase complémentaire",
    acteurs: ["candidat", "etablissement"],
    resume: "Les candidats sans proposition, ou qui ne sont pas satisfaits, peuvent formuler de nouveaux vœux pour des formations qui ont encore des places vacantes.",
    details: ["La documentation 2023 indique dix nouveaux vœux.", "Le répondeur automatique ne s'applique pas aux vœux de phase complémentaire."],
  },
];
