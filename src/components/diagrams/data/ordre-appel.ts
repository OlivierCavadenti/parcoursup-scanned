/**
 * Données des schémas d'ordre d'appel : exemples chiffrés de la présentation
 * officielle (mai 2023, §4.1 et §4.2), calculés par le moteur de référence
 * (conforme à la version 2024-2, voir tests/unit/exemples-officiels.test.ts).
 */
import { calculerOrdreAppel, type EtapeOrdreAppel, type TypeCandidat, type VoeuAppele } from "@/algorithmes/reference/ordre-appel";
import { verifierProprietesOrdreAppel, type ResultatPropriete } from "@/algorithmes/reference/verifications-ordre-appel";

export interface JetonOA {
  id: number;
  label: string;
  rang: number;
  type: TypeCandidat;
}

export interface ExempleOA {
  cle: "boursiers-25" | "deux-taux";
  titre: string;
  source: string;
  qB: number;
  qR: number;
  jetons: JetonOA[];
  ordre: VoeuAppele[];
  etapes: EtapeOrdreAppel[];
  proprietes: ResultatPropriete[];
}

function construire(cle: ExempleOA["cle"], titre: string, source: string, qB: number, qR: number, labels: string[]): ExempleOA {
  const voeux = labels.map((l, i) => ({
    candidat: i + 1,
    rang: i + 1,
    boursier: l.startsWith("B") || l.startsWith("D"),
    duSecteur: l.startsWith("R") || l.startsWith("D"),
  }));
  const g = { id: 1, tauxMinBoursiersPourcents: qB, tauxMinDuSecteurPourcents: qR, voeux };
  const { ordre, etapes } = calculerOrdreAppel(g);
  const jetons = voeux.map((v, i) => ({
    id: v.candidat,
    label: labels[i]!,
    rang: v.rang,
    type: (v.boursier ? (v.duSecteur ? "BOURSIER_DU_SECTEUR" : "BOURSIER_HORS_SECTEUR") : v.duSecteur ? "NON_BOURSIER_DU_SECTEUR" : "NON_BOURSIER_HORS_SECTEUR") as TypeCandidat,
  }));
  return { cle, titre, source, qB, qR, jetons, ordre, etapes, proprietes: verifierProprietesOrdreAppel(g, ordre) };
}

export const EXEMPLE_BOURSIERS = construire(
  "boursiers-25",
  "Taux minimum de boursiers de 25 %",
  "Présentation officielle des algorithmes (mai 2023), §4.1",
  25,
  0,
  "C1 C2 B1 C3 C4 C5 B2 C6 C7 C8 C9 C10 C11 C12 C13 C14 B3 C15 C16 C17".split(" "),
);

export const EXEMPLE_DEUX_TAUX = construire(
  "deux-taux",
  "20 % de boursiers et 90 % de candidats du secteur",
  "Présentation officielle des algorithmes (mai 2023), §4.2",
  20,
  90,
  "R1 R2 N1 R3 R4 R5 R6 R7 R8 R9 R10 R11 B1 R12 B2 R13 R14 D1 R15 R16".split(" "),
);

export const EXEMPLES_OA = { "boursiers-25": EXEMPLE_BOURSIERS, "deux-taux": EXEMPLE_DEUX_TAUX } as const;
