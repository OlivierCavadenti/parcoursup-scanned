/** Cohérence des données affichées dans les schémas animés avec le moteur de référence. */
import { describe, expect, it } from "vitest";
import { ANNEXE_A, PLACES_INTERNAT, rangInternat } from "@/components/diagrams/data/internat";
import { EXEMPLES_REPONDEUR } from "@/components/diagrams/data/repondeur";
import { ETAPES_PROPOSITIONS, CAPACITE } from "@/components/diagrams/data/propositions";
import { EXEMPLE_BOURSIERS, EXEMPLE_DEUX_TAUX } from "@/components/diagrams/data/ordre-appel";

describe("schéma internat (annexe A)", () => {
  it("la dernière passe reproduit exactement la sortie du moteur", () => {
    const der = ANNEXE_A.passes.at(-1)!;
    const prop = (avec: boolean) =>
      ANNEXE_A.sortie.voeux.filter((v) => v.avecInternat === avec && v.statut === "PROPOSITION_DU_JOUR").map((v) => v.gCnCod).sort((a, b) => a - b);
    expect(der.lignes.filter((l) => l.avec === "propose").map((l) => l.candidat)).toEqual(prop(true));
    expect(der.lignes.filter((l) => l.sans === "propose").map((l) => l.candidat)).toEqual(prop(false));
    expect(der.barre).toBe(ANNEXE_A.sortie.internats[0]!.positionAdmission);
    expect(der.barre).toBe(5);
  });
  it("chaque abaissement place la barre juste sous le candidat en surcapacité", () => {
    for (const p of ANNEXE_A.passes.slice(0, -1)) {
      expect(p.internatsProposes.length).toBeGreaterThan(PLACES_INTERNAT);
      expect(p.barreSuivante).toBe(rangInternat(p.enCause!) - 1);
    }
  });
});

describe("schéma répondeur (section 6)", () => {
  it("exemple 1 : F4 acceptée, F1 et F5 supprimés, F3 conservé", () => {
    const s = EXEMPLES_REPONDEUR.avec[2]!.statuts;
    expect(s).toEqual({ F1: "SUPPRIME", F3: "EN_ATTENTE_DE_PROPOSITION", F4: "REP_AUTO_ACCEPTE", F5: "SUPPRIME" });
    expect(EXEMPLES_REPONDEUR.avec[3]!.statuts).toMatchObject({ F3: "REP_AUTO_ACCEPTE", F4: "SUPPRIME" });
  });
  it("exemple 2 : F5 supprimé, F1 et F3 conservés, F4 proposée", () => {
    expect(EXEMPLES_REPONDEUR.sans[2]!.statuts).toEqual({
      F1: "PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE",
      F3: "EN_ATTENTE_DE_PROPOSITION",
      F4: "PROPOSITION_DU_JOUR",
      F5: "SUPPRIME",
    });
  });
});

describe("schéma propositions jour après jour", () => {
  it("ne dépasse jamais la capacité et appelle dans l'ordre", () => {
    for (const e of ETAPES_PROPOSITIONS) {
      const occ = e.lignes.filter((l) => l.etat === "proposition" || l.etat === "acceptee").length;
      expect(occ).toBeLessThanOrEqual(CAPACITE);
    }
    const der = ETAPES_PROPOSITIONS.at(-1)!;
    expect(der.lignes.filter((l) => l.nouveau).map((l) => l.nom)).toEqual(["Sarah"]);
  });
});

describe("schémas ordre d'appel", () => {
  it("toutes les propriétés applicables sont respectées", () => {
    for (const ex of [EXEMPLE_BOURSIERS, EXEMPLE_DEUX_TAUX]) for (const p of ex.proprietes) expect(p.ok).toBe(true);
  });
});
