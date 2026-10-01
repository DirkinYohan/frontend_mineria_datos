/**
 * Tarjeta con el resultado de una predicción.
 *
 * Destaca la cifra obtenida y ofrece la trazabilidad del cálculo junto con la
 * ecuación del modelo, de modo que el resultado sea verificable.
 */

"use client";

import { Tarjeta } from "@/components/ui/Card";
import { Boton } from "@/components/ui/Button";
import { Insignia } from "@/components/ui/Badge";
import { IconoReiniciar, IconoVerificado } from "@/components/ui/Icons";
import { formatearNumero } from "@/lib/utils";
import type { DefinicionModelo, ResultadoPrediccion } from "@/types/models";

interface ResultCardProps {
  modelo: DefinicionModelo;
  resultado: ResultadoPrediccion;
  /** Se invoca al pulsar «Nueva predicción». */
  onReiniciar: () => void;
}

/**
 * Presenta la predicción con la cifra destacada y el detalle del cálculo.
 */
export function TarjetaResultado({
  modelo,
  resultado,
  onReiniciar,
}: ResultCardProps) {
  const decimales = modelo.unidadObjetivo === "unidades monetarias" ? 2 : 2;

  return (
    <Tarjeta variante="destacada" className="overflow-hidden">
      <div className={`border-b px-5 py-3 ${modelo.acento.fondo} ${modelo.acento.borde}`}>
        <p className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <IconoVerificado className="size-4 text-emerald-600 dark:text-emerald-400" />
          Predicción calculada
        </p>
      </div>

      <div className="px-5 py-6">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {resultado.etiqueta}
        </p>

        <p
          className={`mt-2 text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl ${modelo.acento.texto}`}
        >
          {formatearNumero(resultado.valor, decimales)}
          <span className="ml-2 text-base font-normal text-zinc-500 dark:text-zinc-400">
            {resultado.unidad}
          </span>
        </p>

        <dl className="mt-6 space-y-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Modelo
            </dt>
            <dd className="flex flex-wrap items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
              {modelo.nombre}
              <Insignia variante="neutra">{modelo.archivoJoblib}</Insignia>
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Coeficientes aplicados
            </dt>
            <dd className="mt-1.5 space-y-1">
              {modelo.variables.map((variable) => (
                <div
                  key={variable.nombre}
                  className="flex items-baseline justify-between gap-4 text-sm"
                >
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {variable.etiqueta}
                  </span>
                  <span className="font-mono tabular-nums text-zinc-800 dark:text-zinc-200">
                    {formatearNumero(
                      modelo.coeficientes.coeficientes[variable.nombre] ?? 0,
                      6,
                    )}
                  </span>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 border-t border-dashed border-zinc-200 pt-1 text-sm dark:border-zinc-800">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Intercepto
                </span>
                <span className="font-mono tabular-nums text-zinc-800 dark:text-zinc-200">
                  {formatearNumero(modelo.coeficientes.intercepto, 6)}
                </span>
              </div>
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Cálculo
            </dt>
            <dd className="mt-1.5">
              <code className="block overflow-x-auto rounded-md bg-zinc-100 px-3 py-2 font-mono text-xs leading-relaxed text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                {resultado.detalle}
              </code>
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <Boton
            variante="secundario"
            onClick={onReiniciar}
            icono={<IconoReiniciar className="size-4" />}
          >
            Nueva predicción
          </Boton>
        </div>
      </div>
    </Tarjeta>
  );
}
