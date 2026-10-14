/**
 * Exemples chiffrés tirés du « Document de présentation des algorithmes de
 * Parcoursup » (MESRI, mise à jour mai 2023, doc/presentation_algorithmes_parcoursup_2023.pdf
 * du dépôt officiel) et des classes ExempleA1…A6 du bac à sable officiel.
 */
import { describe, expect, it } from "vitest";
import { calculerOrdreAppel, type VoeuClasse } from "@/algorithmes/reference/ordre-appel";
import { verifierProprietesOrdreAppel } from "@/algorithmes/reference/verifications-ordre-appel";
import { calculerPropositions, type EntreePropositions, type VoeuEntree } from "@/algorithmes/reference/propositions";

/** Construit un classement à partir d'une notation compacte : B=boursier hors secteur, D=boursier du secteur, R=résident, C/N=autre */
function classement(lettres: string[]): VoeuClasse[] {
  return lettres.map((l, i) => ({
    candidat: i + 1,
    rang: i + 1,
    boursier: l.startsWith("B") || l.startsWith("D"),
    duSecteur: l.startsWith("R") || l.startsWith("D"),
  }));
}

describe("Présentation officielle 2023, §4.1 — taux boursiers seul (25 %)", () => {
  it("reproduit l'ordre d'appel publié", () => {
    const peda = "C1 C2 B1 C3 C4 C5 B2 C6 C7 C8 C9 C10 C11 C12 C13 C14 B3 C15 C16 C17".split(" ");
    const { ordre } = calculerOrdreAppel({ id: 1, tauxMinBoursiersPourcents: 25, tauxMinDuSecteurPourcents: 0, voeux: classement(peda) });
    const obtenu = ordre.map((v) => peda[v.candidat - 1]).join(" ");
    expect(obtenu).toBe("B1 C1 C2 C3 B2 C4 C5 C6 B3 C7 C8 C9 C10 C11 C12 C13 C14 C15 C16 C17");
  });
});

describe("Présentation officielle 2023, §4.2 — deux taux (20 % boursiers, 90 % résidents)", () => {
  it("reproduit l'ordre d'appel publié", () => {
    const peda = "R1 R2 N1 R3 R4 R5 R6 R7 R8 R9 R10 R11 B1 R12 B2 R13 R14 D1 R15 R16".split(" ");
    const voeux = peda.map((l, i) => ({
      candidat: i + 1,
      rang: i + 1,
      boursier: l.startsWith("B") || l.startsWith("D"),
      duSecteur: l.startsWith("R") || l.startsWith("D"),
    }));
    const { ordre, etapes } = calculerOrdreAppel({ id: 1, tauxMinBoursiersPourcents: 20, tauxMinDuSecteurPourcents: 90, voeux });
    expect(ordre.map((v) => peda[v.candidat - 1]).join(" ")).toBe(
      "D1 R1 R2 R3 R4 B1 R5 R6 R7 R8 B2 R9 R10 R11 R12 R13 R14 R15 R16 N1",
    );
    // « pour la sixième place il y a un conflit entre les deux taux, et priorité est donc donnée au taux boursiers »
    expect(etapes[5]?.regle).toBe("CONFLIT_PRIORITE_BOURSIERS");
    expect(etapes[10]?.regle).toBe("CONFLIT_PRIORITE_BOURSIERS");
  });
});

describe("Bac à sable officiel — ExempleA1 à A6", () => {
  const verifier = (qB: number, qR: number, voeux: VoeuClasse[]) => {
    const g = { id: 0, tauxMinBoursiersPourcents: qB, tauxMinDuSecteurPourcents: qR, voeux };
    const { ordre } = calculerOrdreAppel(g, false);
    for (const p of verifierProprietesOrdreAppel(g, ordre)) expect(p.ok, `${p.id} ${p.detail ?? ""}`).toBe(true);
    return ordre;
  };
  it("A1 : 20 % de boursiers, C1…C5 B6 B7 C8", () => {
    const v = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({ candidat: i, rang: i, boursier: i === 6 || i === 7, duSecteur: false }));
    expect(verifier(20, 0, v).map((x) => x.candidat)).toEqual([6, 1, 2, 3, 4, 7, 5, 8]);
  });
  it("A2 : 2 % de boursiers", () => {
    const v = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({ candidat: i, rang: i, boursier: i === 6, duSecteur: false }));
    expect(verifier(2, 0, v).map((x) => x.candidat)).toEqual([6, 1, 2, 3, 4, 5, 7, 8]);
  });
  it("A3 : 1000 candidats dont 100 boursiers en fin de classement", () => {
    const v = Array.from({ length: 1000 }, (_, k) => ({ candidat: k + 1, rang: k + 1, boursier: k + 1 > 900, duSecteur: false }));
    const o = verifier(10, 0, v);
    expect(o[0]?.candidat).toBe(901);
    expect(o.slice(0, 100).filter((x) => x.boursier).length).toBe(10);
  });
  it("A5 : exemple 1 de la §4.3 (qB = 10, qR = 95) — les 100 premiers inchangés", () => {
    const v: VoeuClasse[] = [];
    for (let i = 0; i <= 1; i++) {
      v.push({ candidat: 20 * i + 1, rang: 20 * i + 1, boursier: true, duSecteur: true });
      v.push({ candidat: 20 * i + 2, rang: 20 * i + 2, boursier: true, duSecteur: true });
      for (let j = 3; j <= 19; j++) v.push({ candidat: 20 * i + j, rang: 20 * i + j, boursier: false, duSecteur: true });
      v.push({ candidat: 20 * i + 20, rang: 20 * i + 20, boursier: false, duSecteur: false });
    }
    v.push({ candidat: 41, rang: 41, boursier: true, duSecteur: true });
    for (let k = 42; k <= 50; k++) v.push({ candidat: k, rang: k, boursier: false, duSecteur: true });
    for (let l = 51; l <= 91; l += 10) {
      v.push({ candidat: l, rang: l, boursier: true, duSecteur: false });
      for (let m = l + 1; m <= l + 9; m++) v.push({ candidat: m, rang: m, boursier: false, duSecteur: true });
    }
    const o = verifier(10, 95, v);
    expect(o.map((x) => x.candidat)).toEqual(v.map((x) => x.candidat));
    expect(o.filter((x) => x.boursier).length).toBe(10);
    expect(o.filter((x) => x.duSecteur).length).toBe(93);
  });
});

describe("Présentation officielle 2023, annexe A — exemple internat", () => {
  /* Vœux sans internat : C1 C2 C5 C7 C9 C10 ; avec internat : tous. Ordre d'appel Ci = i.
     Classement internat : C7 C4 C10 C1 C5 C9 C6 C3 C8 C2. Six places dans la formation. */
  const sansInternat = new Set([1, 2, 5, 7, 9, 10]);
  const classementInternat = [7, 4, 10, 1, 5, 9, 6, 3, 8, 2];
  const internat = { cGiCod: 1, gTiCod: 0, gTaCod: 1 };
  const voeux: VoeuEntree[] = [];
  for (let c = 1; c <= 10; c++) {
    const base = { gCnCod: c, cGpCod: 1, gTiCod: 1, gTaCod: 1, ordreAppel: c, rangPreferences: 0, statut: "EN_ATTENTE_DE_PROPOSITION" as const, affecteHorsPP: false };
    voeux.push({ ...base, avecInternat: true, internat, rangInternat: classementInternat.indexOf(c) + 1 });
    if (sansInternat.has(c)) voeux.push({ ...base, avecInternat: false, internat: null, rangInternat: 0 });
  }
  const entree: EntreePropositions = {
    parametres: { nbJoursCampagne: 20, nbJoursCampagneDateFinReservationInternats: 10, nbJoursCampagneDateDebutGDD: 90, nbJoursCampagneDateFinOrdonnancementGDD: 90 },
    groupes: [{ cGpCod: 1, gTiCod: 1, gTaCod: 1, nbRecrutementsSouhaite: 6, rangLimite: 0, rangDernierAppeleActuellement: 0, rangDernierAppeleReference: 0, finReservationInternats: false, admStop: false }],
    internats: [{ id: internat, capacite: 4 }],
    voeux,
    candidatsAvecRepondeurAutomatique: [],
  };
  it("la barre internat converge vers 5 et les propositions sont celles publiées", () => {
    const s = calculerPropositions(entree);
    expect(s.internats[0]?.positionAdmission).toBe(5);
    const prop = (avec: boolean) =>
      s.voeux.filter((v) => v.avecInternat === avec && v.statut === "PROPOSITION_DU_JOUR").map((v) => v.gCnCod).sort((a, b) => a - b);
    expect(prop(false)).toEqual([1, 2, 5, 7, 9]);
    expect(prop(true)).toEqual([1, 4, 5, 7]);
    expect(s.evenements.filter((e) => e.type === "BARRE_INTERNAT_ABAISSEE").length).toBeGreaterThan(0);
  });
});

describe("Présentation officielle 2023, §6 — répondeur automatique, exemple 1", () => {
  it("une proposition sur F4 supprime F1 et F5, accepte F4 et conserve F3", () => {
    const base = { gCnCod: 1, cGpCod: 0, gTiCod: 1, avecInternat: false, internat: null, rangInternat: 0, affecteHorsPP: false } as const;
    const groupes = [1, 3, 4, 5].map((f) => ({
      cGpCod: f, gTiCod: 1, gTaCod: f, nbRecrutementsSouhaite: f === 4 ? 1 : 0, rangLimite: 0,
      rangDernierAppeleActuellement: 0, rangDernierAppeleReference: 0, finReservationInternats: false, admStop: false,
    }));
    const voeux: VoeuEntree[] = [
      { ...base, cGpCod: 1, gTaCod: 1, ordreAppel: 1, rangPreferences: 4, statut: "PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE" },
      { ...base, cGpCod: 3, gTaCod: 3, ordreAppel: 1, rangPreferences: 1, statut: "EN_ATTENTE_DE_PROPOSITION" },
      { ...base, cGpCod: 4, gTaCod: 4, ordreAppel: 1, rangPreferences: 2, statut: "EN_ATTENTE_DE_PROPOSITION" },
      { ...base, cGpCod: 5, gTaCod: 5, ordreAppel: 1, rangPreferences: 3, statut: "EN_ATTENTE_DE_PROPOSITION" },
    ];
    const s = calculerPropositions({
      parametres: { nbJoursCampagne: 60, nbJoursCampagneDateFinReservationInternats: 10, nbJoursCampagneDateDebutGDD: 50, nbJoursCampagneDateFinOrdonnancementGDD: 50 },
      groupes, internats: [], voeux, candidatsAvecRepondeurAutomatique: [1],
    });
    const statut = (f: number) => s.voeux.find((v) => v.gTaCod === f)?.statut;
    expect(statut(4)).toBe("REP_AUTO_ACCEPTE");
    expect(statut(1)).toBe("REP_AUTO_REFUS_PROPOSITION");
    expect(statut(5)).toBe("REP_AUTO_DEMISSION_ATTENTE");
    expect(statut(3)).toBe("EN_ATTENTE_DE_PROPOSITION");
  });
});

describe("Déterminisme", () => {
  it("deux exécutions identiques produisent le même résultat", () => {
    const v = Array.from({ length: 200 }, (_, k) => ({ candidat: k + 1, rang: ((k * 37) % 200) + 1, boursier: k % 7 === 0, duSecteur: k % 3 !== 0 }));
    const g = { id: 1, tauxMinBoursiersPourcents: 15, tauxMinDuSecteurPourcents: 70, voeux: v };
    expect(calculerOrdreAppel(g)).toEqual(calculerOrdreAppel({ ...g, voeux: [...v].reverse() }));
  });
});
