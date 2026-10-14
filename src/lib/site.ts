export const SITE = {
  nom: "Parcoursup Décrypté",
  slogan: "Parcoursup, enfin compréhensible.",
  description:
    "Observatoire citoyen indépendant : comprendre Parcoursup, de l'examen des dossiers à l'algorithme national de propositions, à partir du code source officiel et des documents publics.",
  /** URL publique (GitHub Pages) ; surchargée par la CI */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://oliviercavadenti.github.io/parcoursup-scanned",
  depot: "https://github.com/OlivierCavadenti/parcoursup-scanned",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
} as const;

export interface EntreeNav {
  href: string;
  label: string;
  description: string;
}

export const NAV: EntreeNav[] = [
  { href: "/comprendre/", label: "Comprendre", description: "Le parcours complet, de la candidature à l'admission" },
  { href: "/algorithmes/", label: "Les algorithmes", description: "Le code officiel expliqué, schéma par schéma" },
  { href: "/idees-recues/", label: "Idées reçues", description: "Ce qui est vrai, faux ou plus nuancé" },
  { href: "/donnees/", label: "Les données", description: "Les jeux de données publics et leurs limites" },
  { href: "/transparence/", label: "Transparence", description: "Ce qui est public, partiel ou inaccessible" },
  { href: "/sources/", label: "Sources", description: "Registre documentaire daté et vérifiable" },
];

/** Préfixe un chemin d'asset statique par le basePath (GitHub Pages). */
export function asset(path: string) {
  return `${SITE.basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
