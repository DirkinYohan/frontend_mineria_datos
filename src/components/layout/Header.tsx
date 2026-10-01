/**
 * Cabecera de la aplicación.
 */

import { PROYECTO } from "@/config/models";

/**
 * Barra superior con la identidad del proyecto.
 */
export function Cabecera() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex size-7 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-bold text-white dark:bg-zinc-50 dark:text-zinc-900"
          >
            ML
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {PROYECTO.nombre}
            </p>
            <p className="hidden truncate text-xs text-zinc-500 sm:block dark:text-zinc-400">
              {PROYECTO.titulo}
            </p>
          </div>
        </div>

        <nav aria-label="Secciones">
          <ul className="flex items-center gap-1 text-sm">
            <li>
              <a
                href="#prediccion"
                className="rounded-md px-2.5 py-1.5 font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                Predicción
              </a>
            </li>
            <li>
              <a
                href="#metricas"
                className="rounded-md px-2.5 py-1.5 font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                Métricas
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
