"use client";

import { MotionConfig } from "motion/react";

/** Applique automatiquement la préférence « réduire les animations » du système. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
