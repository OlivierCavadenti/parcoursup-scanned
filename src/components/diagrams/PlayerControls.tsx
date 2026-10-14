"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { Player } from "./usePlayer";
import { cn } from "@/lib/cn";

export function PlayerControls({ player, nbEtapes, className, libelle = "Animation" }: { player: Player; nbEtapes: number; className?: string; libelle?: string }) {
  const { etape, lecture, basculer, suivant, precedent, debut, vitesse, setVitesse } = player;
  const bouton = "inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-2 transition hover:bg-surface-2 hover:text-ink disabled:opacity-35 disabled:hover:bg-transparent";
  return (
    <div
      role="group"
      aria-label={`Commandes : ${libelle}`}
      className={cn("flex flex-wrap items-center gap-1", className)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") suivant();
        if (e.key === "ArrowLeft") precedent();
      }}
    >
      <button type="button" className={bouton} onClick={debut} aria-label="Revenir au début">
        <RotateCcw className="h-[18px] w-[18px]" />
      </button>
      <button type="button" className={bouton} onClick={precedent} disabled={etape === 0} aria-label="Étape précédente">
        <SkipBack className="h-[18px] w-[18px]" />
      </button>
      <button
        type="button"
        onClick={basculer}
        aria-label={lecture ? "Mettre en pause" : "Lancer l'animation"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary shadow-soft transition hover:bg-primary-2"
      >
        {lecture ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
      </button>
      <button type="button" className={bouton} onClick={suivant} disabled={etape >= nbEtapes - 1} aria-label="Étape suivante">
        <SkipForward className="h-[18px] w-[18px]" />
      </button>
      <span className="ml-2 min-w-[4.5rem] font-mono text-sm tabular-nums text-muted" aria-live="off">
        {etape + 1} / {nbEtapes}
      </span>
      <label className="ml-auto flex items-center gap-2 text-sm text-muted">
        <span className="sr-only sm:not-sr-only">Vitesse</span>
        <select
          value={vitesse}
          onChange={(e) => setVitesse(Number(e.target.value))}
          className="rounded-full border border-line bg-surface px-2.5 py-1.5 text-sm text-ink"
        >
          <option value={0.5}>×0,5</option>
          <option value={1}>×1</option>
          <option value={2}>×2</option>
        </select>
      </label>
    </div>
  );
}

export function Progression({ nb, courant, onAller, libelles }: { nb: number; courant: number; onAller: (i: number) => void; libelles?: string[] }) {
  return (
    <div className="flex gap-1.5" role="tablist" aria-label="Étapes">
      {Array.from({ length: nb }, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === courant}
          aria-label={libelles?.[i] ?? `Étape ${i + 1}`}
          onClick={() => onAller(i)}
          className="group relative h-6 flex-1 min-w-3"
        >
          <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-surface-3">
            <span
              className={cn("block h-full rounded-full bg-accent-2 transition-[width] duration-500", i < courant ? "w-full" : i === courant ? "w-full" : "w-0")}
              style={{ opacity: i === courant ? 1 : 0.55 }}
            />
          </span>
        </button>
      ))}
    </div>
  );
}
