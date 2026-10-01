/**
 * Botón reutilizable con variantes y estado de carga.
 *
 * Incluye el estado `cargando` para bloquear la acción mientras se calcula una
 * predicción y evitar envíos duplicados.
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variante = "primario" | "secundario" | "fantasma";

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variante?: Variante;
  /** Muestra un indicador y deshabilita el botón. */
  cargando?: boolean;
  /** Ocupa todo el ancho disponible. */
  bloque?: boolean;
  icono?: ReactNode;
}

const VARIANTES_BASE: Record<Variante, string> = {
  primario:
    "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
  secundario:
    "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
  fantasma:
    "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
};

/**
 * Botón con estados de carga y deshabilitado integrados.
 */
export function Boton({
  children,
  variante = "primario",
  cargando = false,
  bloque = false,
  icono,
  className,
  disabled,
  type = "button",
  ...resto
}: BotonProps) {
  const deshabilitado = disabled || cargando;

  return (
    <button
      type={type}
      disabled={deshabilitado}
      aria-busy={cargando || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5",
        "text-sm font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTES_BASE[variante],
        bloque && "w-full",
        className,
      )}
      {...resto}
    >
      {cargando ? (
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        icono
      )}
      <span>{children}</span>
    </button>
  );
}
