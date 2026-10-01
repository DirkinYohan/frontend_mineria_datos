/**
 * Selector del modelo sobre el que se va a predecir.
 *
 * Presenta los tres modelos como opciones excluyentes, indicando las variables
 * de entrada de cada uno para que la elección sea informada.
 */

"use client";

import { ICONOS_POR_MODELO } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import type { DefinicionModelo, ModeloId } from "@/types/models";

interface SelectorModeloProps {
  modelos: readonly DefinicionModelo[];
  seleccionado: ModeloId;
  onSeleccionar: (id: ModeloId) => void;
}

/**
 * Grupo de botones para elegir el modelo activo.
 */
export function SelectorModelo({
  modelos,
  seleccionado,
  onSeleccionar,
}: SelectorModeloProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Selecciona el modelo"
      className="grid gap-3 sm:grid-cols-3"
    >
      {modelos.map((modelo) => {
        const Icono = ICONOS_POR_MODELO[modelo.id];
        const activo = modelo.id === seleccionado;

        return (
          <button
            key={modelo.id}
            type="button"
            role="radio"
            aria-checked={activo}
            onClick={() => onSeleccionar(modelo.id)}
            className={cn(
              "group flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-300",
              activo
                ? "border-zinc-900 bg-white shadow-sm dark:border-zinc-100 dark:bg-zinc-900"
                : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700",
            )}
          >
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-lg border",
                activo
                  ? `${modelo.acento.fondo} ${modelo.acento.borde} ${modelo.acento.texto}`
                  : "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400",
              )}
            >
              <Icono className="size-5" />
            </span>

            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {modelo.nombre}
            </span>

            <span className="font-mono text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              {modelo.variables.map((v) => v.nombre).join(" · ")}
            </span>

            <span
              className={cn(
                "mt-1 inline-flex items-center gap-1.5 text-xs font-medium",
                activo
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-400 dark:text-zinc-500",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  activo ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700",
                )}
              />
              {activo ? "Seleccionado" : "Seleccionar"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
