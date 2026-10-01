/**
 * Insignia para mostrar una etiqueta corta (métricas, unidades, estados).
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InsigniaProps {
  children: ReactNode;
  variante?: "neutra" | "acento" | "exito" | "aviso";
  className?: string;
}

const VARIANTES = {
  neutra:
    "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  acento:
    "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 dark:border-zinc-50",
  exito:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900",
  aviso:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900",
} as const;

/**
 * Etiqueta compacta para clasificar o destacar información.
 */
export function Insignia({
  children,
  variante = "neutra",
  className,
}: InsigniaProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5",
        "text-xs font-medium tabular-nums",
        VARIANTES[variante],
        className,
      )}
    >
      {children}
    </span>
  );
}
