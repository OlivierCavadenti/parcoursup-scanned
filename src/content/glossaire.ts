export interface Terme {
  id: string;
  terme: string;
  definition: string;
  voirAussi?: string[];
  lien?: string;
}

/** Définitions rédigées à partir de la présentation officielle 2023 et du code (version 2024-2). */
export const GLOSSAIRE: Terme[] = [
  { id: "voeu", terme: "Vœu", definition: "Demande d'admission dans une formation, formulée puis confirmée par le candidat. Une proposition ne peut porter que sur un vœu confirmé.", voirAussi: ["sous-voeu", "confirmation"] },
  { id: "sous-voeu", terme: "Sous-vœu", definition: "Lorsque plusieurs formations similaires sont regroupées en un seul vœu, chacune d'elles est un sous-vœu. Dans le fonctionnement de l'algorithme, un sous-vœu se comporte comme un vœu.", voirAussi: ["voeu"] },
  { id: "confirmation", terme: "Confirmation des vœux", definition: "Étape où le candidat valide chacun de ses vœux et complète son dossier. Seuls les vœux confirmés sont examinés.", voirAussi: ["voeu"] },
  { id: "commission", terme: "Commission d'examen des vœux", definition: "Instance constituée dans chaque établissement pour examiner les candidatures d'une formation et établir le classement pédagogique, selon les critères de la formation.", voirAussi: ["classement-pedagogique"], lien: "/comprendre/examen-des-dossiers/" },
  { id: "classement-pedagogique", terme: "Classement pédagogique", definition: "Ordre des candidats établi par la commission d'examen des vœux. C'est l'entrée de l'algorithme de l'ordre d'appel.", voirAussi: ["ordre-appel", "groupe-classement"] },
  { id: "groupe-classement", terme: "Groupe de classement", definition: "Ensemble de candidats classés ensemble. Une formation peut avoir plusieurs groupes (par exemple selon le type de baccalauréat en BTS ou en IUT) ; plusieurs formations peuvent aussi partager un même classement.", voirAussi: ["classement-pedagogique"] },
  { id: "ordre-appel", terme: "Ordre d'appel", definition: "Ordre dans lequel les propositions sont envoyées. Il est calculé une fois, avant la phase d'admission, à partir du classement pédagogique et des taux minimaux de boursiers et de candidats du secteur.", voirAussi: ["taux-boursiers", "taux-secteur", "rang-appel"], lien: "/algorithmes/ordre-d-appel/" },
  { id: "rang-appel", terme: "Rang dans l'ordre d'appel", definition: "Position du candidat dans l'ordre d'appel d'un groupe. Selon les commentaires du code officiel, c'est ce rang qui est affiché au candidat.", voirAussi: ["ordre-appel", "position-attente"] },
  { id: "taux-boursiers", terme: "Taux minimum de boursiers", definition: "Pourcentage minimal de bacheliers bénéficiaires d'une bourse nationale de lycée parmi les candidats appelés, fixé par le recteur de région académique. En cas de conflit avec le taux de résidents, il prime.", voirAussi: ["taux-secteur", "ordre-appel"], lien: "/comprendre/quotas-et-priorites/" },
  { id: "taux-secteur", terme: "Taux de candidats du secteur", definition: "Interprétation, dans l'algorithme, du taux maximum de non-résidents de l'académie fixé pour les formations non sélectives en tension : il devient un taux minimum de « résidents ».", voirAussi: ["taux-boursiers"], lien: "/comprendre/quotas-et-priorites/" },
  { id: "boursier", terme: "Boursier", definition: "Dans la documentation des algorithmes : bachelier bénéficiaire d'une bourse nationale de lycée.", voirAussi: ["taux-boursiers"] },
  { id: "proposition", terme: "Proposition d'admission", definition: "Offre de place envoyée à un candidat sur l'un de ses vœux. Il doit y répondre dans un délai réglementaire ; l'acceptation n'est pas définitive tant qu'il garde des vœux en attente.", voirAussi: ["liste-attente"], lien: "/algorithmes/propositions/" },
  { id: "liste-attente", terme: "Liste d'attente", definition: "Ensemble des candidats dont le vœu n'a pas encore reçu de proposition, faute de place à leur rang d'appel.", voirAussi: ["position-attente", "dernier-appele"], lien: "/comprendre/listes-d-attente/" },
  { id: "position-attente", terme: "Position en liste d'attente", definition: "Nombre de candidats encore en attente devant soi, plus un. Elle diminue quand des candidats placés devant reçoivent une proposition ou renoncent.", voirAussi: ["rang-appel", "dernier-appele"], lien: "/comprendre/listes-d-attente/" },
  { id: "dernier-appele", terme: "Rang du dernier appelé", definition: "Plus haut rang dans l'ordre d'appel parmi les candidats ayant reçu une proposition. La valeur de l'année précédente est un repère, pas une garantie.", voirAussi: ["position-attente"] },
  { id: "capacite", terme: "Capacité d'accueil", definition: "Nombre de places de la formation, renseigné sur Parcoursup.", voirAussi: ["taux-appel"] },
  { id: "taux-appel", terme: "Taux d'appel supplémentaire", definition: "Paramètre fixé par la formation pour envoyer plus de propositions que de places, en anticipant les refus. Dans le code, il se traduit par un « nombre de recrutements souhaité » supérieur à la capacité.", voirAussi: ["rang-limite", "capacite"] },
  { id: "rang-limite", terme: "Rang limite d'appel (appel par bloc)", definition: "Rang jusqu'auquel tous les candidats de l'ordre d'appel encore en attente reçoivent une proposition, quel que soit le nombre de places restantes.", voirAussi: ["taux-appel"] },
  { id: "internat", terme: "Barre d'admission à l'internat", definition: "Rang maximal au classement internat permettant de recevoir une proposition avec hébergement. Elle est calculée chaque jour pour respecter la capacité de l'internat et réserver des places aux mieux classés.", voirAussi: ["classement-internat"], lien: "/algorithmes/internats/" },
  { id: "classement-internat", terme: "Classement internat", definition: "Classement des demandes d'hébergement, établi selon des critères fixés par le code de l'éducation (situation sociale, distance).", voirAussi: ["internat"] },
  { id: "ordonnancement", terme: "Ordonnancement des vœux", definition: "Classement par le candidat de ses vœux en attente, obligatoire pour les conserver en fin de phase principale et pendant la GDD (documentation 2023).", voirAussi: ["repondeur", "gdd"], lien: "/algorithmes/repondeur-automatique/" },
  { id: "repondeur", terme: "Répondeur automatique", definition: "Option facultative : la meilleure proposition reçue selon l'ordre de préférence du candidat est acceptée automatiquement, et les vœux moins bien classés sont supprimés.", voirAussi: ["ordonnancement"], lien: "/algorithmes/repondeur-automatique/" },
  { id: "gdd", terme: "Gestion des démissions (GDD)", definition: "Période qui suit la phase principale : les places libérées par des désistements ou des non-inscriptions sont proposées aux candidats ayant gardé des vœux.", voirAussi: ["ordonnancement", "repondeur"] },
  { id: "phase-complementaire", terme: "Phase complémentaire", definition: "Phase permettant de formuler de nouveaux vœux pour des formations qui ont encore des places vacantes.", voirAussi: ["gdd"] },
  { id: "selective", terme: "Formation sélective / non sélective", definition: "Une formation sélective peut ne pas classer un candidat (réponse négative). Une formation non sélective (comme la licence) répond « oui » ou « en attente », et peut, sous conditions, ne pas ordonner les candidatures.", voirAussi: ["commission"] },
  { id: "taux-acces", terme: "Taux d'accès", definition: "Indicateur statistique publié par formation. Selon la méthodologie 2020 (non lue en intégralité), il rapporte les candidats classés jusqu'au rang du dernier appelé aux candidats ayant confirmé un vœu. Ce n'est pas une probabilité d'admission individuelle.", voirAussi: ["dernier-appele"], lien: "/donnees/" },
  { id: "agpl", terme: "AGPL-3.0", definition: "Licence libre sous laquelle le code des algorithmes est publié. Elle autorise l'étude, la modification et la redistribution, à condition de publier le code des versions modifiées utilisées en ligne.", lien: "/a-propos/" },
];

export const TERME = new Map(GLOSSAIRE.map((t) => [t.id, t]));
