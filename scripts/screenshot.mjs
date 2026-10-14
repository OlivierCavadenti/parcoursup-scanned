// Capture d'écran d'une page du build statique (vérification visuelle).
// Usage : node scripts/screenshot.mjs <chemin> <sortie.png> [largeur] [theme] [attente ms] [scrollY]
import { chromium } from "@playwright/test";
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const [, , chemin = "/", sortie = "shot.png", largeur = "1280", theme = "light", attente = "1500", scrollY = "0"] = process.argv;
const racine = path.resolve("out");
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png", ".txt": "text/plain" };
const serveur = http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let f = path.join(racine, p);
  try {
    if ((await stat(f)).isDirectory()) f = path.join(f, "index.html");
  } catch {
    f = path.join(racine, "404.html");
  }
  try {
    res.writeHead(200, { "content-type": types[path.extname(f)] ?? "application/octet-stream" });
    res.end(await readFile(f));
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => serveur.listen(4321, r));
const nav = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await nav.newPage({ viewport: { width: Number(largeur), height: 900 }, colorScheme: theme === "dark" ? "dark" : "light" });
const erreurs = [];
page.on("pageerror", (e) => erreurs.push(e.message));
page.on("console", (m) => m.type() === "error" && erreurs.push(m.text()));
await page.goto(`http://localhost:4321${chemin}`, { waitUntil: "networkidle" });
if (Number(scrollY)) await page.evaluate((y) => window.scrollTo(0, y), Number(scrollY));
await page.waitForTimeout(Number(attente));
await page.screenshot({ path: sortie, fullPage: Number(scrollY) === 0 });
if (erreurs.length) console.log("ERREURS:", erreurs.join("\n"));
await nav.close();
serveur.close();
