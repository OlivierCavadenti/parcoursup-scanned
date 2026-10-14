"use client";

import { motion, useReducedMotion } from "motion/react";
import { FileText, HelpCircle, ListOrdered } from "lucide-react";
import { useEffect, useState } from "react";

const DOSSIERS = ["Dossier A", "Dossier B", "Dossier C", "Dossier D", "Dossier E"];
const ORDRE = [2, 0, 4, 1, 3];

/** Schéma : des dossiers entrent dans la commission (méthode locale) et ressortent classés. */
export function CommissionDiagram() {
  const reduit = useReducedMotion();
  const [t, setT] = useState(reduit ? DOSSIERS.length : 0);
  useEffect(() => {
    if (reduit) return;
    const id = setInterval(() => setT((x) => (x >= DOSSIERS.length + 2 ? 0 : x + 1)), 900);
    return () => clearInterval(id);
  }, [reduit]);
  const sortis = ORDRE.slice(0, Math.min(t, DOSSIERS.length));

  return (
    <figure className="overflow-hidden rounded-[28px] bg-surface shadow-float ring-1 ring-line">
      <div className="grid items-center gap-6 p-6 sm:p-8 md:grid-cols-[1fr_1.1fr_1fr]">
        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Dossiers reçus</p>
          <ul className="space-y-2">
            {DOSSIERS.map((d, i) => (
              <motion.li key={d} animate={{ opacity: sortis.includes(i) ? 0.25 : 1, x: sortis.includes(i) ? 12 : 0 }} className="flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2 text-sm text-ink ring-1 ring-line">
                <FileText className="h-4 w-4 text-muted" aria-hidden="true" /> {d}
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="relative rounded-3xl bg-violet-soft/60 p-5 ring-1 ring-violet/30">
          <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-40 [background-image:repeating-linear-gradient(135deg,var(--violet-2)_0_1px,transparent_1px_10px)]" aria-hidden="true" />
          <div className="relative">
            <p className="font-display text-lg font-semibold text-ink">Commission d'examen des vœux</p>
            <p className="mt-1 text-sm text-ink-2">Critères définis par la formation, publiés dans leurs grandes lignes.</p>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface/80 px-3 py-2 text-sm text-ink-2 ring-1 ring-line">
              <HelpCircle className="h-4 w-4 text-violet" aria-hidden="true" />
              Pondérations et outils éventuels : propres à chaque formation, non publiés en détail.
            </div>
            <motion.div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface" aria-hidden="true">
              <motion.div className="h-full bg-violet-2" animate={{ width: ["0%", "100%"] }} transition={{ duration: 0.9, repeat: reduit ? 0 : Infinity, ease: "easeInOut" }} />
            </motion.div>
          </div>
        </div>
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            <ListOrdered className="h-4 w-4 text-violet" aria-hidden="true" /> Classement pédagogique
          </p>
          <ol className="space-y-2">
            {sortis.map((i, rang) => (
              <motion.li key={i} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 240, damping: 22 }} className="flex items-center gap-2 rounded-xl bg-violet-2/15 px-3 py-2 text-sm font-medium text-ink ring-1 ring-violet/30">
                <span className="font-mono text-violet">{rang + 1}</span> {DOSSIERS[i]}
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
      <figcaption className="border-t border-line px-6 py-3 text-xs text-muted sm:px-8">Illustration de principe. Aucune méthode réelle de commission n'est reproduite.</figcaption>
    </figure>
  );
}
