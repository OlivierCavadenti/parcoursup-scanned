/**
 * Chaîne de données : analyse CSV et normalisation.
 * Les lignes ci-dessous sont SYNTHÉTIQUES (tests uniquement), jamais affichées sur le site.
 */
import { describe, expect, it } from "vitest";
// @ts-expect-error module JS sans types
import { parserCSV, normaliser, convertir } from "../../scripts/data/normaliser.mjs";
import config from "../../src/data/adapters/colonnes.json";

describe("parserCSV", () => {
  it("gère guillemets, séparateurs et sauts de ligne internes", () => {
    const l = parserCSV('﻿a;b;c\n1;"x;y";"il dit ""oui"""\r\n2;"multi\nligne";3\n');
    expect(l).toEqual([
      ["a", "b", "c"],
      ["1", "x;y", 'il dit "oui"'],
      ["2", "multi\nligne", "3"],
    ]);
  });
});

describe("convertir", () => {
  it("convertit nombres et pourcentages, rejette les valeurs aberrantes", () => {
    expect(convertir("12,5", "nombre")).toBe(12.5);
    expect(convertir("", "nombre")).toBeNull();
    expect(convertir("140", "pourcentage")).toBeNull();
    expect(convertir("abc", "nombre")).toBeNull();
  });
});

describe("normaliser", () => {
  it("associe les colonnes, signale les indicateurs absents sans inventer de valeur", () => {
    const csv = "session;g_ea_lib_vx;lib_for_voe_ins;capa_fin;voe_tot;colonne_inconnue\n2099;Établissement test;Formation test;30;120;x\n";
    const r = normaliser(parserCSV(csv), config);
    const val = (cle: string) => r.enregistrements[0][r.champs.findIndex((c: { cle: string }) => c.cle === cle)];
    expect(val("capacite")).toBe(30);
    expect(val("voeux")).toBe(120);
    expect(val("tauxAcces")).toBeNull();
    expect(r.manquants).toContain("tauxAcces");
    expect(r.colonnesNonUtilisees).toEqual(["colonne_inconnue"]);
  });
  it("refuse un millésime sans colonnes obligatoires", () => {
    const r = normaliser(parserCSV("session;capa_fin\n2099;3\n"), config);
    expect(r.obligatoiresManquants).toEqual(["formation", "etab"]);
    expect(r.enregistrements).toEqual([]);
  });
});
