/**
 * Conformité différentielle : calcul des propositions TypeScript vs code Java officiel,
 * sur des simulations multi-journées (internats, rang limite, répondeur automatique,
 * démissions automatiques en GDD, drapeau adm_stop).
 */
import { describe, expect, it } from "vitest";
import { calculerPropositions, type EntreePropositions, type StatutVoeu } from "@/simulation/engine/reference/propositions";
import { chargerFixtures } from "./fixtures";

interface FixtureP {
  nom: string;
  jour: number;
  entree: EntreePropositions;
  attendu?: {
    voeux: { gCnCod: number; gTaCod: number; avecInternat: boolean; statut: StatutVoeu }[];
    internats: { id: { cGiCod: number; gTiCod: number; gTaCod: number }; positionAdmission: number; positionMaximaleAdmission: number }[];
    groupes: { cGpCod: number; gTiCod: number; gTaCod: number; estimationRangDernierAppele: number }[];
    alerte: boolean;
    avertissement: boolean;
  };
  erreur?: string;
}

const fixtures = chargerFixtures<FixtureP>("propositions");

const normaliser = (e: EntreePropositions): EntreePropositions => ({
  ...e,
  internats: e.internats ?? [],
  voeux: e.voeux.map((v) => ({ ...v, internat: v.internat ?? null })),
  candidatsAvecRepondeurAutomatique: e.candidatsAvecRepondeurAutomatique ?? [],
});

describe("propositions — comparaison avec le code Java officiel", () => {
  it("couvre tous les mécanismes", () => {
    const statuts = new Set(fixtures.flatMap((f) => f.attendu?.voeux.map((v) => v.statut) ?? []));
    for (const s of [
      "PROPOSITION_DU_JOUR",
      "REP_AUTO_ACCEPTE",
      "REP_AUTO_REFUS_PROPOSITION",
      "REP_AUTO_DEMISSION_ATTENTE",
      "DEMISSION_AUTO_VOEU_ORDONNE_EN_ATTENTE",
      "DEMISSION_AUTO_VOEU_ORDONNE_PROPOSITION_EN_ATTENTE_REP",
    ]) {
      expect(statuts.has(s as StatutVoeu), s).toBe(true);
    }
    expect(fixtures.some((f) => f.entree.internats?.length)).toBe(true);
  });

  it.each(fixtures.map((f) => [f.nom, f] as const))("%s", (_nom, f) => {
    const entree = normaliser(f.entree);
    if (f.erreur || !f.attendu) {
      expect(() => calculerPropositions(entree)).toThrow();
      return;
    }
    expect(f.attendu.alerte).toBe(false);
    const sortie = calculerPropositions(entree);
    const obtenu = sortie.voeux
      .map((v) => ({ gCnCod: v.gCnCod, gTaCod: v.gTaCod, avecInternat: v.avecInternat, statut: v.statut }))
      .sort((a, b) => a.gCnCod - b.gCnCod || a.gTaCod - b.gTaCod || Number(a.avecInternat) - Number(b.avecInternat));
    expect(obtenu).toEqual(f.attendu.voeux);
    const internats = sortie.internats
      .map((i) => ({ id: i.id, positionAdmission: i.positionAdmission, positionMaximaleAdmission: i.positionMaximaleAdmission }))
      .sort((a, b) => a.id.cGiCod - b.id.cGiCod || a.id.gTaCod - b.id.gTaCod);
    expect(internats).toEqual(f.attendu.internats);
    const groupes = sortie.groupes
      .map((g) => ({ cGpCod: g.cGpCod, gTiCod: g.gTiCod, gTaCod: g.gTaCod, estimationRangDernierAppele: g.estimationRangDernierAppele }))
      .sort((a, b) => a.cGpCod - b.cGpCod || a.gTaCod - b.gTaCod);
    expect(groupes).toEqual(f.attendu.groupes);
  });
});
