"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { TERME } from "@/content/glossaire";

/** Terme technique avec définition en infobulle (survol, focus clavier ou toucher). */
export function Terme({ id, children }: { id: string; children?: React.ReactNode }) {
  const t = TERME.get(id);
  const [ouvert, setOuvert] = useState(false);
  const bulle = useId();
  if (!t) throw new Error(`Terme inconnu : ${id}`);
  return (
    <span className="relative inline" onMouseEnter={() => setOuvert(true)} onMouseLeave={() => setOuvert(false)}>
      <button
        type="button"
        aria-describedby={ouvert ? bulle : undefined}
        aria-expanded={ouvert}
        onFocus={() => setOuvert(true)}
        onBlur={() => setOuvert(false)}
        onClick={() => setOuvert((o) => !o)}
        onKeyDown={(e) => e.key === "Escape" && setOuvert(false)}
        className="cursor-help font-[inherit] text-inherit underline decoration-accent-2 decoration-dotted decoration-2 underline-offset-[5px]"
      >
        {children ?? t.terme}
      </button>
      <AnimatePresence>
        {ouvert && (
          <motion.span
            id={bulle}
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16 }}
            className="absolute left-1/2 top-full z-30 mt-2 block w-72 -translate-x-1/2 rounded-2xl bg-ink p-4 text-left text-sm font-normal leading-relaxed text-bg shadow-float"
          >
            <span className="block font-semibold">{t.terme}</span>
            <span className="mt-1 block opacity-90">{t.definition}</span>
            <Link href={`/glossaire/#${t.id}`} className="mt-2 inline-block text-xs font-semibold text-accent-2 underline underline-offset-2">
              Voir dans le glossaire
            </Link>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
