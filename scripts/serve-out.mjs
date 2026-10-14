// Petit serveur statique pour le dossier out/ (tests end-to-end et prévisualisation).
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const racine = path.resolve("out");
const port = Number(process.env.PORT ?? 4322);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png", ".txt": "text/plain", ".xml": "application/xml" };

http
  .createServer(async (req, res) => {
    const p = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
    let f = path.join(racine, p);
    let code = 200;
    try {
      if ((await stat(f)).isDirectory()) f = path.join(f, "index.html");
      await stat(f);
    } catch {
      f = path.join(racine, "404.html");
      code = 404;
    }
    try {
      const contenu = await readFile(f);
      res.writeHead(code, { "content-type": types[path.extname(f)] ?? "application/octet-stream" });
      res.end(contenu);
    } catch {
      res.writeHead(404);
      res.end();
    }
  })
  .listen(port, () => console.log(`http://localhost:${port}`));
