/**
 * Conformité différentielle : ordre d'appel TypeScript vs code Java officiel.
 * Les fixtures sont générées par tools/reference-harness à partir du jar compilé
 * depuis le dépôt officiel (version 2024-2, commit 8c406bf).
 */
import { describe, expect, it } from "vitest";
import { calculerOrdreAppel, type GroupeClassement } from "@/algorithmes/reference/ordre-appel";
import { verifierProprietesOrdreAppel } from "@/algorithmes/reference/verifications-ordre-appel";
import { chargerFixtures } from "./fixtures";

interface FixtureOa {
  nom: string;
  entree: { id: number; tauxMinBoursiersPourcents: number; tauxMinDuSecteurPourcents: number; voeux: GroupeClassement["voeux"] };
  attendu: { candidat: number; rangAppel: number }[];
  erreur?: string;
}

const fixtures = chargerFixtures<FixtureOa>("ordre-appel");

describe("ordre d'appel — comparaison avec le code Java officiel", () => {
  it("dispose d'un jeu de référence significatif", () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(300);
  });

  it.each(fixtures.map((f) => [f.nom, f] as const))("%s", (_nom, f) => {
    const g: GroupeClassement = { ...f.entree, voeux: f.entree.voeux };
    if (f.erreur) {
      expect(() => calculerOrdreAppel(g)).toThrow();
      return;
    }
    const { ordre } = calculerOrdreAppel(g, false);
    const obtenu = ordre.map((v) => ({ candidat: v.candidat, rangAppel: v.rangAppel }));
    expect(obtenu).toEqual(f.attendu);
    for (const p of verifierProprietesOrdreAppel(g, ordre)) expect(p.ok, `${p.id} ${p.detail ?? ""}`).toBe(true);
  });
});
