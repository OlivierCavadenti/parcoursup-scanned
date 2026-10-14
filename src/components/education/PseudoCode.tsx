import { cn } from "@/lib/cn";

const MOTS = /\b(pour|tant que|si|sinon|alors|répéter|jusqu'à|retourner|et|ou|non|chaque|dans|fin)\b/g;

/** Bloc de pseudo-code pédagogique (les commentaires commencent par //). */
export function PseudoCode({ titre, lignes, className }: { titre: string; lignes: string[]; className?: string }) {
  return (
    <figure className={cn("overflow-hidden rounded-2xl bg-[#0d1426] ring-1 ring-white/10", className)}>
      <figcaption className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-400">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-teal-300/70" />
        </span>
        <span className="ml-2">{titre}</span>
        <span className="ml-auto rounded bg-white/5 px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wider">pseudo-code pédagogique</span>
      </figcaption>
      <pre className="overflow-x-auto p-4 text-[0.82rem] leading-relaxed sm:text-sm">
        <code>
          {lignes.map((l, i) => {
            const commentaire = l.trimStart().startsWith("//");
            const html = commentaire ? l : l.replace(MOTS, "\u0000$1\u0001");
            return (
              <span key={i} className="block">
                <span className="mr-4 inline-block w-5 select-none text-right text-slate-600">{i + 1}</span>
                {commentaire ? (
                  <span className="text-slate-500 italic">{l}</span>
                ) : (
                  html.split(/(\u0000[^\u0001]*\u0001)/).map((frag, j) =>
                    frag.startsWith("\u0000") ? (
                      <span key={j} className="font-semibold text-teal-300">
                        {frag.slice(1, -1)}
                      </span>
                    ) : (
                      <span key={j} className="text-slate-200">
                        {frag}
                      </span>
                    ),
                  )
                )}
              </span>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}
