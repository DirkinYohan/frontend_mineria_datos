/**
 * Tarjeta resumen de un modelo en el panel principal.
 *
 * Muestra la identidad del modelo, sus variables, su métrica principal y un
 * botón para ir directamente a predecir con él.
 */

"use client";

import { Tarjeta, TarjetaCuerpo } from "@/components/ui/Card";
import { Boton } from "@/components/ui/Button";
import { Insignia } from "@/components/ui/Badge";
import { ICONOS_POR_MODELO } from "@/components/ui/Icons";
import { formatearNumero, formatearPorcentaje } from "@/lib/utils";
import type { DefinicionModelo } from "@/types/models";

interface ModelCardProps {
  modelo: DefinicionModelo;
  /** Se invoca al pulsar «Predecir con este modelo». */
  onUsar: (modelo: DefinicionModelo) => void;
}

/**
 * Resumen visual de un modelo con acceso directo a la predicción.
 */
export function TarjetaModelo({ modelo, onUsar }: ModelCardProps) {
  const Icono = ICONOS_POR_MODELO[modelo.id];

  return (
    <Tarjeta className="flex h-full flex-col">
      <TarjetaCuerpo className="flex flex-1 flex-col">
        <div className="flex items-start gap-3">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${modelo.acento.fondo} ${modelo.acento.borde} ${modelo.acento.texto}`}
          >
            <Icono className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {modelo.nombre}
            </h3>
            <p className="mt-0.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              {modelo.archivoJoblib}
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {modelo.descripcion}
        </p>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-zinc-500 dark:text-zinc-400">Entradas</dt>
            <dd className="text-right font-mono text-xs text-zinc-700 dark:text-zinc-300">
              {modelo.variables.map((v) => v.nombre).join(", ")}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-zinc-500 dark:text-zinc-400">Predice</dt>
            <dd className="text-right font-mono text-xs text-zinc-700 dark:text-zinc-300">
              {modelo.variableObjetivo}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-zinc-500 dark:text-zinc-400">R²</dt>
            <dd className="text-right font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {formatearNumero(modelo.metricas.r2, 4)}
            </dd>
          </div>
        </dl>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {modelo.metricasExigidas.map((metrica) => (
            <Insignia key={metrica}>{metrica}</Insignia>
          ))}
          <Insignia>R² = {formatearPorcentaje(modelo.metricas.r2)}</Insignia>
        </div>

        <div className="mt-auto pt-4">
          <Boton
            variante="secundario"
            bloque
            onClick={() => onUsar(modelo)}
            icono={<Icono className="size-4" />}
          >
            Predecir con este modelo
          </Boton>
        </div>
      </TarjetaCuerpo>
    </Tarjeta>
  );
}
