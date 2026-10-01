/**
 * Campo numérico para introducir una variable de un modelo.
 *
 * Muestra la etiqueta, la unidad, el rango admitido y el mensaje de error
 * asociado, de modo que el usuario sepa siempre qué se espera del campo.
 */

"use client";

import { useId } from "react";
import type { EspecificacionVariable } from "@/types/models";
import { cn } from "@/lib/utils";

interface CampoNumericoProps {
  variable: EspecificacionVariable;
  /** Valor actual del campo, como cadena para permitir la edición libre. */
  valor: string;
  /** Se invoca con el nuevo valor textual en cada pulsación. */
  onCambio: (valor: string) => void;
  /** Mensaje de error de este campo, si lo hay. */
  error?: string;
}

/**
 * Control de entrada numérico con validación visual.
 */
export function CampoNumerico({
  variable,
  valor,
  onCambio,
  error,
}: CampoNumericoProps) {
  const id = useId();
  const idError = `${id}-error`;
  const idAyuda = `${id}-ayuda`;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
        >
          {variable.etiqueta}
        </label>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {variable.unidad}
        </span>
      </div>

      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={valor}
        step={variable.paso}
        min={variable.minimo}
        max={variable.maximo}
        onChange={(evento) => onCambio(evento.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(idAyuda, error && idError)}
        className={cn(
          "mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm",
          "text-zinc-900 shadow-sm transition-colors",
          "focus:outline-2 focus:outline-offset-0",
          "dark:bg-zinc-950 dark:text-zinc-50",
          error
            ? "border-red-400 focus:outline-red-500 dark:border-red-700"
            : "border-zinc-300 focus:outline-zinc-900 dark:border-zinc-700 dark:focus:outline-zinc-300",
        )}
      />

      <p id={idAyuda} className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        {variable.ayuda}{" "}
        <span className="whitespace-nowrap">
          ({variable.minimo} – {variable.maximo})
        </span>
      </p>

      {error ? (
        <p
          id={idError}
          role="alert"
          className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
