import type { CodeRefId } from "./code-refs";
import type { StatutFidelite } from "@/components/education/Fidelite";

export interface FicheAlgorithme {
  slug: string;
  titre: string;
  role: string;
  entrees: string[];
  sorties: string[];
  complexite: string;
  fidelite: StatutFidelite;
  tests: string;
  code: CodeRefId[];
}

export const ALGORITHMES: FicheAlgorithme[] = [
  {
    slug: "ordre-d-appel",
    titre: "Calcul de l'ordre d'appel",
    role: "Transforme le classement pédagogique de chaque groupe en ordre d'appel respectant les taux de boursiers et de candidats du secteur.",
    entrees: ["classement pédagogique (rang > 0, unique)", "statut boursier et « du secteur » de chaque candidat", "taux minimum de boursiers qB et de candidats du secteur qR"],
    sorties: ["rang d'appel de chaque candidat"],
    complexite: "O(n log n) : un tri puis une passe à coût constant (quatre files)",
    fidelite: "conforme",
    tests: "300 cas différentiels + exemples officiels + propriétés P1 à P5",
    code: ["ordreAppelCalcul", "ordreAppelSelection", "verifOrdreAppel"],
  },
  {
    slug: "propositions",
    titre: "Calcul quotidien des propositions",
    role: "Chaque jour, détermine dans chaque groupe d'affectation les vœux en attente qui reçoivent une proposition.",
    entrees: ["vœux et leurs statuts", "ordre d'appel", "nombre de recrutements souhaité et rang limite de chaque groupe", "paramètres de la campagne (jour, dates)"],
    sorties: ["nouveaux statuts des vœux (proposition du jour, en attente, démissions automatiques)"],
    complexite: "Itératif : une descente par groupe, répétée tant que des barres internat baissent ou que le répondeur libère des places",
    fidelite: "conforme",
    tests: "430 journées simulées comparées au code Java officiel",
    code: ["propositionsCalcule", "groupeAppel", "placesVacantes"],
  },
  {
    slug: "internats",
    titre: "Barres d'admission en internat",
    role: "Calcule la barre de chaque internat pour respecter sa capacité, tout en réservant des places aux candidats les mieux classés à l'internat.",
    entrees: ["classement internat", "capacité de l'internat", "estimation du rang du dernier appelé de chaque formation"],
    sorties: ["position (barre) d'admission de chaque internat", "position maximale d'admission"],
    complexite: "Point fixe : la barre ne fait que baisser ; le résultat ne dépend pas de l'ordre de traitement",
    fidelite: "conforme",
    tests: "inclus dans les 430 journées + exemple de l'annexe A",
    code: ["internatMax", "internatPosition", "estimationDernierAppele", "barreInternatVoeu"],
  },
  {
    slug: "repondeur-automatique",
    titre: "Répondeur automatique et démissions automatiques",
    role: "Pour les candidats ayant ordonné leurs vœux : accepte automatiquement la meilleure proposition (répondeur) ou supprime les vœux moins bien classés (GDD).",
    entrees: ["ordre de préférence du candidat", "propositions du jour", "liste des candidats ayant activé le répondeur"],
    sorties: ["acceptations et démissions automatiques", "nombre de places libérées"],
    complexite: "Linéaire en nombre de vœux, répété jusqu'à ce qu'aucune place ne soit libérée",
    fidelite: "conforme",
    tests: "inclus dans les 430 journées + exemples de la section 6",
    code: ["repondeur", "demissionGdd"],
  },
];
