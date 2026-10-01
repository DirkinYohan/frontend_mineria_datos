/**
 * Mensaje de alerta reutilizable para estados de error y notas informativas.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconoAlerta, IconoInformacion, IconoVerificado } from "@/components/ui/Icons";

type Tono = "error" | "info" | "exito";

interface AlertaProps {
  children: ReactNode;
  tono?: Tono;
  titulo?: string;
  className?: string;
}

const TONOS: Record<Tono, { caja: string; icono: ReactNode }> = {
  error: {
    caja: "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
    icono: <IconoAlerta className="size-4" />,
  },
  info: {
    caja: "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300",
    icono: <IconoInformacion className="size-4" />,
  },
  exito: {
    caja: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
    icono: <IconoVerificado className="size-4" />,
  },
};

/**
 * Aviso con icono, título opcional y contenido.
 *
 * Usa `role="alert"` para los errores, de modo que los lectores de pantalla lo
 * anuncien en cuanto aparezca.
 */
export function Alerta({
  children,
  tono = "info",
  titulo,
  className,
}: AlertaProps) {
  const estilo = TONOS[tono];

  return (
    <div
      role={tono === "error" ? "alert" : undefined}
      className={cn(
        "flex gap-3 rounded-lg border px-4 py-3 text-sm",
        estilo.caja,
        className,
      )}
    >
      <span className="mt-0.5 shrink-0">{estilo.icono}</span>
      <div className="min-w-0 space-y-1">
        {titulo ? <p className="font-semibold">{titulo}</p> : null}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
