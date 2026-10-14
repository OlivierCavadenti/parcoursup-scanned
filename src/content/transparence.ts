export type Zone = "public" | "partiel" | "inaccessible";

export interface ElementTransparence {
  id: string;
  titre: string;
  zone: Zone;
  justification: string;
  sources: string[];
}

export const ZONES: Record<Zone, { titre: string; description: string }> = {
  public: { titre: "Public et vérifiable", description: "Disponible, consultable et, pour le code, exécutable." },
  partiel: { titre: "Partiellement documenté", description: "Disponible mais incomplet, général ou difficile à interpréter." },
  inaccessible: { titre: "Non accessible publiquement", description: "Aucune source consultée n'en assure la publication." },
};

export const ELEMENTS: ElementTransparence[] = [
  {
    id: "code-ordre-appel",
    titre: "Algorithme de l'ordre d'appel",
    zone: "public",
    justification: "Code Java publié sous licence AGPL-3.0, avec des propriétés vérifiées après chaque calcul. Nous l'avons compilé, exécuté et reproduit à l'identique sur 300 cas de test.",
    sources: ["code-gitlab", "code-miroir"],
  },
  {
    id: "code-propositions",
    titre: "Calcul quotidien des propositions",
    zone: "public",
    justification: "Code publié, y compris internats, répondeur automatique et démissions automatiques. Reproduit à l'identique sur 430 journées simulées.",
    sources: ["code-gitlab", "code-miroir"],
  },
  {
    id: "doc-algos",
    titre: "Documentation des algorithmes",
    zone: "public",
    justification: "Des documents de présentation datés de 2018 à 2023 accompagnent le code et donnent des exemples chiffrés.",
    sources: ["presentation-2023", "presentations-anterieures"],
  },
  {
    id: "cadre-legal",
    titre: "Cadre légal et réglementaire",
    zone: "public",
    justification: "Loi du 8 mars 2018 et articles du code de l'éducation, cités par la documentation officielle.",
    sources: ["loi-ore", "code-education"],
  },
  {
    id: "stats",
    titre: "Statistiques par formation",
    zone: "public",
    justification: "Jeux de données ouverts publiés chaque année par le ministère (candidatures, propositions, admis, profils).",
    sources: ["data-parcoursup"],
  },
  {
    id: "version-campagne",
    titre: "Version du code utilisée pour la campagne en cours",
    zone: "partiel",
    justification: "La dernière version consultée date de juin 2024 (campagne 2024). Nous n'avons pas pu vérifier si une version plus récente a été publiée pour 2025 ou 2026.",
    sources: ["code-miroir", "code-gitlab"],
  },
  {
    id: "criteres",
    titre: "Critères d'examen des formations",
    zone: "partiel",
    justification: "Les critères généraux sont affichés sur la plateforme au moment de l'inscription, mais leur pondération précise ne fait pas partie des informations publiées par le code national.",
    sources: ["presentation-2023"],
  },
  {
    id: "donnees-appel",
    titre: "Données d'appel des formations",
    zone: "partiel",
    justification: "Le principe (taux d'appel, appel par bloc, seuils prudentiels) est documenté ; les valeurs fixées chaque jour par les formations ne figurent pas dans les jeux de données consultés.",
    sources: ["presentation-2023"],
  },
  {
    id: "indicateurs",
    titre: "Définition des indicateurs statistiques",
    zone: "partiel",
    justification: "Les définitions (par exemple le taux d'accès) sont données dans des notes méthodologiques par millésime, qui évoluent d'une année à l'autre.",
    sources: ["methodo-2020"],
  },
  {
    id: "outils-locaux",
    titre: "Outils locaux d'aide à la décision",
    zone: "inaccessible",
    justification: "Les traitements utilisés par certaines commissions pour pré-classer les dossiers ne font pas partie du code national publié. Leur communication a fait l'objet de contentieux, que nous n'avons pas analysés en détail.",
    sources: ["next-algos-locaux", "cc-2020-834"],
  },
  {
    id: "classements",
    titre: "Classements individuels",
    zone: "inaccessible",
    justification: "Il s'agit de données personnelles : ils ne sont pas publics, ce qui est normal.",
    sources: ["presentation-2023"],
  },
  {
    id: "reste-plateforme",
    titre: "Reste du code de la plateforme",
    zone: "inaccessible",
    justification: "Seul le « cœur algorithmique » est publié. Selon un article de presse (non consulté en intégralité), une demande de communication de l'ensemble du code a été rejetée par le juge.",
    sources: ["next-vulnerabilites"],
  },
];
