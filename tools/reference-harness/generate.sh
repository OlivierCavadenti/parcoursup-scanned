#!/usr/bin/env bash
# Régénère les jeux de référence à partir du code Java officiel.
# Prérequis : java >= 17, maven, et un clone du dépôt officiel :
#   git clone https://gitlab.mim-libre.fr/parcoursup/algorithmes-de-parcoursup  (ou le miroir GitHub flyingtof)
#   cd algorithmes-de-parcoursup && mvn -q package -DskipTests
# puis : OFFICIAL_JAR=/chemin/vers/parcoursup-algos-*-jar-with-dependencies.jar ./generate.sh
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$HERE/../.."
: "${OFFICIAL_JAR:?Définir OFFICIAL_JAR vers le jar-with-dependencies officiel}"
mkdir -p "$HERE/build"
javac -nowarn -cp "$OFFICIAL_JAR" -d "$HERE/build" "$HERE/src/Harness.java"
OUT="$ROOT/tests/conformance/fixtures"
rm -rf "$OUT/ordre-appel" "$OUT/propositions"
java -cp "$OFFICIAL_JAR:$HERE/build" Harness gen-oa 20240612 300 "$OUT/ordre-appel"
java -cp "$OFFICIAL_JAR:$HERE/build" Harness gen-sim 20240612 80 "$OUT/propositions"
echo "Fixtures générées dans $OUT"
# Regroupe et compresse les fixtures (taille du dépôt)
node -e '
const fs=require("fs"),zlib=require("zlib"),path=require("path");
for (const d of ["ordre-appel","propositions"]) {
  const dir=path.join(process.argv[1],d);
  const files=fs.readdirSync(dir).filter(f=>f.endsWith(".json")).sort();
  const all=files.map(f=>JSON.parse(fs.readFileSync(path.join(dir,f),"utf8")));
  fs.writeFileSync(path.join(process.argv[1],d+".json.gz"),zlib.gzipSync(JSON.stringify(all),{level:9}));
  fs.rmSync(dir,{recursive:true});
  console.log(d, all.length, "cas");
}' "$OUT"
