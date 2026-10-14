import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

const PAGES = [
  "",
  "comprendre/",
  "comprendre/en-5-minutes/",
  "comprendre/etapes/",
  "comprendre/qui-decide/",
  "comprendre/examen-des-dossiers/",
  "comprendre/quotas-et-priorites/",
  "comprendre/listes-d-attente/",
  "comprendre/cas-particuliers/",
  "algorithmes/",
  "algorithmes/ordre-d-appel/",
  "algorithmes/propositions/",
  "algorithmes/internats/",
  "algorithmes/repondeur-automatique/",
  "algorithmes/conformite/",
  "idees-recues/",
  "donnees/",
  "transparence/",
  "sources/",
  "glossaire/",
  "a-propos/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.endsWith("/") ? SITE.url : `${SITE.url}/`;
  return PAGES.map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
