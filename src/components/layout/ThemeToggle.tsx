"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function themeCourant(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => setTheme(themeCourant()), []);
  const basculer = () => {
    const suivant: Theme = themeCourant() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", suivant);
    try {
      localStorage.setItem("theme", suivant);
    } catch {
      /* stockage indisponible : le choix vaut pour la session */
    }
    setTheme(suivant);
  };
  const label = theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre";
  return (
    <button
      type="button"
      onClick={basculer}
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-2 transition hover:bg-surface-2 hover:text-ink"
    >
      {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}

/** Script inline exécuté avant le rendu pour éviter un flash de thème. */
export const SCRIPT_THEME = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;
