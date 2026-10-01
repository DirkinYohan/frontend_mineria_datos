/**
 * Tarjeta contenedora reutilizable.
 *
 * Centraliza el estilo de superficie (fondo, borde, sombra y radios) para que
 * todas las secciones de la interfaz sean visualmente coherentes.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TarjetaProps {
  children: ReactNode;
  /** Clases adicionales para ajustar el espaciado o el ancho. */
  className?: string;
  /** Variante visual de la tarjeta. */
  variante?: "base" | "destacada" | "plana";
}

const VARIANTES = {
  base: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm",
  destacada:
    "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-md",
  plana: "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800",
} as const;

/**
 * Superficie con borde y sombra donde se agrupa contenido relacionado.
 */
export function Tarjeta({
  children,
  className,
  variante = "base",
}: TarjetaProps) {
  return (
    <section
      className={cn(
        "rounded-xl border transition-colors",
        VARIANTES[variante],
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Cabecera de una tarjeta, con título y descripción opcional. */
export function TarjetaCabecera({
  titulo,
  descripcion,
  icono,
  className,
}: {
  titulo: ReactNode;
  descripcion?: ReactNode;
  icono?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex items-start gap-3 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800",
        className,
      )}
    >
      {icono ? (
        <span className="mt-0.5 shrink-0 text-zinc-500 dark:text-zinc-400">
          {icono}
        </span>
      ) : null}
      <div className="min-w-0">
        <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {titulo}
        </h2>
        {descripcion ? (
          <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {descripcion}
          </p>
        ) : null}
      </div>
    </header>
  );
}

/** Cuerpo de una tarjeta, con el espaciado interno habitual. */
export function TarjetaCuerpo({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}
