import { Code2, GitBranch } from "lucide-react";
import { CODE_REFS, lienGitlab, lienMiroir, type CodeRefId } from "@/content/code-refs";
import { REFERENCE_COMMIT } from "@/content/sources";
import { cn } from "@/lib/cn";

/** Lien vers un passage du code officiel : GitLab (dépôt officiel) + miroir figé au commit étudié. */
export function CodeLink({ id, className, compact = false }: { id: CodeRefId; className?: string; compact?: boolean }) {
  const ref = CODE_REFS[id];
  const fichier = ref.fichier.split("/").pop();
  if (compact) {
    return (
      <a href={lienGitlab(ref)} className={cn("inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[0.8em] text-primary ring-1 ring-line hover:ring-primary/40", className)}>
        <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
        {fichier}#L{ref.debut}
      </a>
    );
  }
  return (
    <div className={cn("group relative overflow-hidden rounded-2xl bg-[#0d1426] p-5 text-slate-200 ring-1 ring-white/10", className)}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
          <Code2 className="h-4.5 w-4.5 text-teal-300" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-words font-mono text-[0.9rem] font-semibold text-white [overflow-wrap:anywhere]">{ref.titre}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">{ref.resume}</p>
          <p className="mt-2 truncate font-mono text-xs text-slate-400">
            {ref.fichier.replace("src/main/java/fr/parcoursup/algos/", "…/")} · lignes {ref.debut}–{ref.fin}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a href={lienGitlab(ref)} className="inline-flex items-center gap-1.5 rounded-full bg-teal-400/15 px-3 py-1.5 font-medium text-teal-200 ring-1 ring-teal-300/30 transition hover:bg-teal-400/25">
              <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
              Voir sur le GitLab officiel
            </a>
            <a href={lienMiroir(ref)} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-slate-300 ring-1 ring-white/15 transition hover:bg-white/5">
              Version étudiée ({REFERENCE_COMMIT.slice(0, 7)})
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
