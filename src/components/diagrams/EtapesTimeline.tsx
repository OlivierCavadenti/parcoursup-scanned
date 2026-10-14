"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "motion/react";
import { Cpu, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { PHASES } from "@/content/etapes";
import { ACTEURS } from "@/content/qui-decide";
import { cn } from "@/lib/cn";

/** Frise verticale dont la ligne se remplit au défilement. */
export function EtapesTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const progression = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative">
      <div className="absolute bottom-6 left-[1.35rem] top-6 w-[3px] rounded-full bg-surface-3" aria-hidden="true">
        <motion.div className="w-full origin-top rounded-full bg-gradient-to-b from-accent-2 via-violet-2 to-primary-2" style={{ scaleY: progression, height: "100%" }} />
      </div>
      {PHASES.map((p, i) => (
        <li
          key={p.id}
          className="reveal relative grid grid-cols-[2.75rem_1fr] gap-4 pb-10 last:pb-0 sm:gap-6"
        >
          <span
            className="relative z-10 grid h-11 w-11 place-items-center rounded-full bg-surface font-display text-lg font-semibold text-ink shadow-soft ring-2 ring-line-strong"
          >
            {i + 1}
          </span>
          <div className="rounded-3xl bg-surface p-5 shadow-soft ring-1 ring-line sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              {p.acteurs.map((a) => (
                <span key={a} className={cn("rounded-full px-2.5 py-0.5 text-[0.72rem] font-bold", ACTEURS[a].soft, ACTEURS[a].texte)}>
                  {ACTEURS[a].libelle}
                </span>
              ))}
              {p.algorithme && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#0d1426] px-2.5 py-0.5 text-[0.72rem] font-semibold text-teal-200">
                  <Cpu className="h-3 w-3" aria-hidden="true" /> {p.algorithme}
                </span>
              )}
            </div>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink sm:text-2xl">{p.titre}</h3>
            <p className="mt-2 leading-relaxed text-ink-2">{p.resume}</p>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted">
              {p.details.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
            {p.lien && (
              <Link href={p.lien.href} className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                {p.lien.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
