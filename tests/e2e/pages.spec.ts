import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  "/",
  "/comprendre/",
  "/comprendre/en-5-minutes/",
  "/comprendre/etapes/",
  "/comprendre/qui-decide/",
  "/comprendre/examen-des-dossiers/",
  "/comprendre/quotas-et-priorites/",
  "/comprendre/listes-d-attente/",
  "/comprendre/cas-particuliers/",
  "/algorithmes/",
  "/algorithmes/ordre-d-appel/",
  "/algorithmes/propositions/",
  "/algorithmes/internats/",
  "/algorithmes/repondeur-automatique/",
  "/algorithmes/conformite/",
  "/idees-recues/",
  "/donnees/",
  "/transparence/",
  "/sources/",
  "/glossaire/",
  "/a-propos/",
];

for (const chemin of PAGES) {
  test(`${chemin} se charge sans erreur, avec un titre et un fil d'indépendance`, async ({ page }) => {
    const erreurs: string[] = [];
    page.on("pageerror", (e) => erreurs.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) erreurs.push(m.text());
    });
    page.on("response", (r) => {
      if (r.status() >= 400 && !r.url().includes("/data/parcoursup/")) erreurs.push(`${r.status()} ${r.url()}`);
    });
    const r = await page.goto(chemin);
    expect(r?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("footer")).toContainText("Projet citoyen indépendant");
    await page.waitForTimeout(400);
    expect(erreurs).toEqual([]);
  });

  test(`${chemin} respecte les règles d'accessibilité WCAG 2.x AA (axe)`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(chemin);
    await page.waitForTimeout(300);
    const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    const graves = res.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(graves.map((v) => `${v.id} : ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
  });
}

test("le lien d'évitement mène au contenu", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Aller au contenu" })).toBeFocused();
});

test("le schéma de l'ordre d'appel avance pas à pas et reproduit l'exemple officiel", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/algorithmes/ordre-d-appel/");
  const figure = page.locator("figure").filter({ hasText: "Taux minimum de boursiers de 25" }).first();
  await figure.scrollIntoViewIfNeeded();
  const suivant = figure.getByRole("button", { name: "Étape suivante" });
  await suivant.click();
  await expect(figure.getByText("Place n° 1")).toBeVisible();
  await expect(figure.getByText(/B1.*est appelé/)).toBeVisible();
  for (let i = 0; i < 19; i++) await suivant.click();
  await expect(figure.getByText("21 / 21")).toBeVisible();
  await expect(figure.getByText(/P1/)).toBeVisible();
});

test("le parcours 5 minutes se navigue au clavier", async ({ page }) => {
  await page.goto("/comprendre/en-5-minutes/");
  await page.getByRole("button", { name: /Suivant/ }).click();
  await expect(page.getByRole("heading", { name: "Chaque formation classe les dossiers" })).toBeVisible();
});

test("qui décide : cliquer une étape affiche son détail", async ({ page }) => {
  await page.goto("/comprendre/qui-decide/");
  await page.getByRole("button", { name: /Ordre d'appel/ }).first().click();
  await expect(page.getByRole("heading", { name: /6\. Ordre d'appel/ })).toBeVisible();
});

test("explorateur de données : état explicite quand les données ne sont pas importées", async ({ page }) => {
  await page.goto("/donnees/");
  const statut = page.getByRole("status").filter({ hasText: /non importées|Chargement/ });
  await expect(statut.first()).toBeVisible();
});

test("le mode sombre se conserve", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /mode sombre|mode clair/ }).click();
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe(theme);
});
