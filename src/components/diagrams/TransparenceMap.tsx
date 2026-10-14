"use client";

import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff, ScanEye } from "lucide-react";
import { useState } from "react";
import { ELEMENTS, ZONES, type Zone } from "@/content/transparence";
import { source, LIBELLES_STATUT } from "@/content/sources";
import { cn } from "@/lib/cn";

const STYLE: Record<Zone, { icone: typeof Eye; fond: string; puce: string; actif: string; texte: string }> = {
  public: { icone: Eye, fond: "bg-green-soft/50 ring-green/20", puce: "bg-surface ring-green/30 hover:ring-green", actif: "bg-green-2 text-[#03251a] ring-green-2", texte: "text-green" },
  partiel: { icone: ScanEye, fond: "bg-amber-soft/50 ring-amber/20", puce: "bg-surface ring-amber/30 hover:ring-amber", actif: "bg-amber-2 text-[#2b1a00] ring-amber-2", texte: "text-amber" },
  inaccessible: { icone: EyeOff, fond: "bg-surface-2 ring-line-strong", puce: "bg-surface ring-line-strong hover:ring-ink/40", actif: "bg-ink text-bg ring-ink", texte: "text-muted" },
};

export function TransparenceMap() {
  const [actif, setActif] = useState(ELEMENTS[0]!.id);
  const el = ELEMENTS.find((e) => e.id === actif)!;
  return (
    <div className="rounded-[28px] bg-surface p-4 shadow-float ring-1 ring-line sm:p-6">
      <div className="grid gap-4 lg:grid-cols-3">
        {(Object.keys(ZONES) as Zone[]).map((z) => {
          const S = STYLE[z];
          const Icone = S.icone;
          return (
            <section
              key={z}
              className={cn("reveal rounded-3xl p-5 ring-1", S.fond)}
              aria-labelledby={`zone-${z}`}
            >
              <h3 id={`zone-${z}`} className={cn("flex items-center gap-2 font-display text-xl font-semibold", S.texte)}>
                <Icone className="h-5 w-5" aria-hidden="true" />
                <span className="text-ink">{ZONES[z].titre}</span>
              </h3>
              <p className="mt-1 text-sm text-muted">{ZONES[z].description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {ELEMENTS.filter((e) => e.zone === z).map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => setActif(e.id)}
                      aria-pressed={actif === e.id}
                      className={cn("rounded-full px-3.5 py-2 text-left text-sm font-medium text-ink ring-1 transition", actif === e.id ? S.actif : S.puce)}
                    >
                      {e.titre}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <div className="mt-4 rounded-3xl bg-surface-2/60 p-5 ring-1 ring-line sm:p-6" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={el.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className={cn("text-xs font-bold uppercase tracking-wider", STYLE[el.zone].texte)}>{ZONES[el.zone].titre}</p>
            <h4 className="mt-1 font-display text-2xl font-semibold text-ink">{el.titre}</h4>
            <p className="mt-2 max-w-3xl leading-relaxed text-ink-2">{el.justification}</p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {el.sources.map((id) => {
                const s = source(id);
                return (
                  <li key={id}>
                    <a href={s.url} className="text-primary underline underline-offset-2">
                      {s.titre}
                    </a>{" "}
                    <span className="text-xs text-muted">({LIBELLES_STATUT[s.statut].toLowerCase()})</span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
