"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Lecteur d'animation pas à pas : démarre quand le schéma entre dans l'écran,
 * se met en pause quand il en sort, et ne s'anime pas automatiquement si
 * l'utilisateur préfère réduire les animations.
 */
export function usePlayer(nbEtapes: number, { intervalle = 1600, boucle = false, pauseFin = 2600 } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.35 });
  const reduit = useReducedMotion();
  const [etape, setEtape] = useState(0);
  const [lecture, setLecture] = useState(false);
  const [vitesse, setVitesse] = useState(1);
  const demarre = useRef(false);

  useEffect(() => {
    if (visible && !demarre.current && !reduit) {
      demarre.current = true;
      setLecture(true);
    }
  }, [visible, reduit]);

  useEffect(() => {
    if (!lecture || !visible) return;
    const fin = etape >= nbEtapes - 1;
    if (fin && !boucle) {
      setLecture(false);
      return;
    }
    const t = setTimeout(
      () => setEtape((e) => (e >= nbEtapes - 1 ? 0 : e + 1)),
      (fin ? pauseFin : intervalle) / vitesse,
    );
    return () => clearTimeout(t);
  }, [lecture, visible, etape, nbEtapes, boucle, intervalle, pauseFin, vitesse]);

  const suivant = useCallback(() => {
    setLecture(false);
    setEtape((e) => Math.min(nbEtapes - 1, e + 1));
  }, [nbEtapes]);
  const precedent = useCallback(() => {
    setLecture(false);
    setEtape((e) => Math.max(0, e - 1));
  }, []);
  const debut = useCallback(() => {
    setLecture(false);
    setEtape(0);
  }, []);
  const basculer = useCallback(() => {
    setLecture((l) => {
      if (!l && etape >= nbEtapes - 1) setEtape(0);
      return !l;
    });
  }, [etape, nbEtapes]);
  const aller = useCallback((i: number) => {
    setLecture(false);
    setEtape(Math.max(0, Math.min(nbEtapes - 1, i)));
  }, [nbEtapes]);

  return { ref, etape, lecture, vitesse, setVitesse, suivant, precedent, debut, basculer, aller, reduit: !!reduit };
}

export type Player = ReturnType<typeof usePlayer>;
