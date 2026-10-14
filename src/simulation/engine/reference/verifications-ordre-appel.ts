/**
 * Propriétés vérifiées après le calcul de l'ordre d'appel.
 * Portage de fr.parcoursup.algos.verification.VerificationsResultatsAlgoOrdreAppel
 * (propriétés P1 à P5, y compris l'arithmétique entière Java).
 */
import type { GroupeClassement, VoeuAppele } from "./ordre-appel";

export interface ResultatPropriete {
  id: "P1" | "P2" | "P3" | "P4" | "P5";
  enonce: string;
  ok: boolean;
  applicable: boolean;
  detail?: string;
}

const div = (a: number, b: number) => Math.trunc(a / b);

export function verifierProprietesOrdreAppel(g: GroupeClassement, ordre: VoeuAppele[]): ResultatPropriete[] {
  const qB = g.tauxMinBoursiersPourcents;
  const qR = g.tauxMinDuSecteurPourcents;
  const res: ResultatPropriete[] = [];
  const parAppel = [...ordre].sort((a, b) => a.rangAppel - b.rangAppel);

  /* P1 : pour tout k, au moins qB % des k premiers sont boursiers ; sinon plus aucun boursier ensuite */
  {
    let nb = 0;
    let nbB = 0;
    let seulementNonBoursiers = false;
    let detail: string | undefined;
    for (const v of parAppel) {
      nb++;
      if (v.boursier) {
        nbB++;
        if (seulementNonBoursiers && !detail) detail = `Boursier ${v.candidat} appelé après un déficit de boursiers.`;
      }
      if (div(100 * nbB, nb) < qB) seulementNonBoursiers = true;
    }
    res.push({
      id: "P1",
      enonce: `Pour tout k, au moins ${qB} % des k premiers appelés sont boursiers ; sinon, plus aucun boursier n'est appelé ensuite.`,
      ok: !detail,
      applicable: true,
      detail,
    });
  }

  /* P2 : un boursier du secteur (ou boursier si pas de taux secteur) n'est jamais doublé */
  {
    let detail: string | undefined;
    for (const v1 of ordre) {
      if (v1.boursier && (qR === 0 || v1.duSecteur)) {
        if (v1.rangAppel > v1.rang) detail ??= `Le candidat ${v1.candidat} recule (rang ${v1.rang} → appel ${v1.rangAppel}).`;
        for (const v2 of ordre) {
          if (v2.rang > v1.rang && v2.rangAppel < v1.rangAppel) detail ??= `Le candidat ${v1.candidat} est doublé par ${v2.candidat}.`;
        }
      }
    }
    res.push({
      id: "P2",
      enonce: "Un candidat boursier du secteur n'est jamais doublé : son rang d'appel est inférieur ou égal à son rang de classement.",
      ok: !detail,
      applicable: true,
      detail,
    });
  }

  /* P3 : un non-boursier du secteur ne peut être doublé que par des boursiers */
  {
    let detail: string | undefined;
    const applicable = qB < 100;
    if (applicable) {
      for (const v1 of ordre) {
        if (!v1.boursier && (v1.duSecteur || qR === 0)) {
          const max = Math.floor(1 + v1.rang * (1 + qB / (100.0 - qB)));
          if (v1.rangAppel > max) detail ??= `Le candidat ${v1.candidat} recule au-delà de la borne ${max}.`;
          for (const v2 of ordre) {
            if (!v2.boursier && v2.rang > v1.rang && v2.rangAppel < v1.rangAppel) detail ??= `${v1.candidat} doublé par un non-boursier (${v2.candidat}).`;
          }
        }
      }
    }
    res.push({
      id: "P3",
      enonce: "Un candidat non boursier du secteur n'est doublé que par des boursiers, et son rang d'appel reste ≤ 1 + ⌊(1 + qB/(100 − qB)) × r⌋.",
      ok: !detail,
      applicable,
      detail,
    });
  }

  /* P4 : un boursier hors secteur n'est doublé que par des candidats du secteur */
  {
    let detail: string | undefined;
    const applicable = qR !== 0;
    if (applicable) {
      for (const v1 of ordre) {
        if (v1.boursier && !v1.duSecteur) {
          if (qR < 100) {
            const max = Math.floor(1 + v1.rang * (1 + qR / (100.0 - qR)));
            if (v1.rangAppel > max) detail ??= `Le candidat ${v1.candidat} recule au-delà de la borne ${max}.`;
          }
          for (const v2 of ordre) {
            if (!v2.duSecteur && v2.rang > v1.rang && v2.rangAppel < v1.rangAppel) detail ??= `${v1.candidat} doublé par un hors-secteur (${v2.candidat}).`;
          }
        }
      }
    }
    res.push({
      id: "P4",
      enonce: "Un candidat boursier hors secteur n'est doublé que par des candidats du secteur.",
      ok: !detail,
      applicable,
      detail,
    });
  }

  /* P5 : un non-boursier hors secteur ne double jamais personne */
  {
    let detail: string | undefined;
    for (const v1 of ordre) {
      if (!v1.boursier && !v1.duSecteur) {
        const somme = qR + qB;
        if (somme < 100) {
          const max = Math.ceil((v1.rang + 1) * (1 + somme / (100.0 - somme)));
          if (v1.rangAppel > max) detail ??= `Le candidat ${v1.candidat} recule au-delà de la borne ${max}.`;
        }
        for (const v2 of ordre) {
          if (v2.rang < v1.rang && v2.rangAppel > v1.rangAppel) detail ??= `${v1.candidat} double ${v2.candidat}.`;
        }
      }
    }
    res.push({
      id: "P5",
      enonce: "Un candidat non boursier hors secteur ne double jamais personne.",
      ok: !detail,
      applicable: true,
      detail,
    });
  }
  return res;
}
