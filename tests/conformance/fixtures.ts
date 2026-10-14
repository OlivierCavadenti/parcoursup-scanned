import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import path from "node:path";

/** Charge un jeu de fixtures produit par tools/reference-harness (code Java officiel). */
export function chargerFixtures<T>(nom: "ordre-appel" | "propositions"): T[] {
  const fichier = path.join(import.meta.dirname, "fixtures", `${nom}.json.gz`);
  return JSON.parse(gunzipSync(readFileSync(fichier)).toString("utf8")) as T[];
}
