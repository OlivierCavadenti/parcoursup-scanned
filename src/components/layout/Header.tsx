"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/cn";
import { LogoMark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const [ouvert, setOuvert] = useState(false);
  useEffect(() => setOuvert(false), [pathname]);
  const actif = (href: string) => pathname === href || pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:shadow-soft">
        Aller au contenu
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 rounded-lg" aria-label={`${SITE.nom} — accueil`}>
          <LogoMark />
          <span className="font-display text-[1.15rem] font-semibold tracking-tight text-ink">
            Parcoursup <span className="text-accent">Décrypté</span>
          </span>
        </Link>
        <nav aria-label="Navigation principale" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={actif(n.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[0.94rem] font-medium text-ink-2 transition hover:text-ink",
                    actif(n.href) && "text-ink",
                  )}
                >
                  {actif(n.href) && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-surface-2" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                  )}
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 lg:hidden"
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOuvert((o) => !o)}
          >
            {ouvert ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {ouvert && (
          <motion.nav
            id="menu-mobile"
            aria-label="Navigation mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-bg lg:hidden"
          >
            <ul className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} aria-current={actif(n.href) ? "page" : undefined} className="flex flex-col rounded-xl px-3 py-3 hover:bg-surface-2">
                    <span className="font-medium text-ink">{n.label}</span>
                    <span className="text-sm text-muted">{n.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
