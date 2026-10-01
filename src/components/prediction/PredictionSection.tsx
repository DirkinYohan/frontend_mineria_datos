/**
 * Sección de predicción.
 *
 * Coordina el selector de modelo, el formulario y la tarjeta de resultado.
 * Es el único componente con estado compartido entre esas tres piezas; toda la
 * lógica de cálculo reside en `@/lib/models`.
 */

"use client";

import { useState } from "react";
import { SelectorModelo } from "@/components/prediction/ModelSelector";
import { FormularioPrediccion } from "@/components/prediction/PredictionForm";
import { TarjetaResultado } from "@/components/prediction/ResultCard";
import { Tarjeta, TarjetaCabecera, TarjetaCuerpo } from "@/components/ui/Card";
import { ICONOS_POR_MODELO } from "@/components/ui/Icons";
import { LISTA_MODELOS } from "@/config/models";
import type { DefinicionModelo, ModeloId, ResultadoPrediccion } from "@/types/models";

interface PredictionSectionProps {
  modeloActivo: ModeloId;
  onCambiarModelo: (id: ModeloId) => void;
}

/**
 * Sección completa de predicción con selección de modelo condicional.
 */
export function SeccionPrediccion({
  modeloActivo,
  onCambiarModelo,
}: PredictionSectionProps) {
  const [resultado, setResultado] = useState<ResultadoPrediccion | null>(null);

  const modelo: DefinicionModelo =
    LISTA_MODELOS.find((m) => m.id === modeloActivo) ?? LISTA_MODELOS[0];
  const Icono = ICONOS_POR_MODELO[modelo.id];

  function cambiarModelo(id: ModeloId) {
    if (id === modeloActivo) return;
    setResultado(null);
    onCambiarModelo(id);
  }

  return (
    <section id="prediccion" aria-labelledby="titulo-prediccion" className="space-y-6">
      <div>
        <h2
          id="titulo-prediccion"
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Realizar una predicción
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Elige el modelo y completa sus variables. La interfaz valida cada valor
          contra el rango observado durante el entrenamiento.
        </p>
      </div>

      <SelectorModelo
        modelos={LISTA_MODELOS}
        seleccionado={modeloActivo}
        onSeleccionar={cambiarModelo}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Tarjeta>
            <TarjetaCabecera
              icono={<Icono className="size-5" />}
              titulo={modelo.etiquetaObjetivo}
              descripcion={`Variables de entrada del modelo «${modelo.nombre}», en el orden en que fue entrenado.`}
            />
            <TarjetaCuerpo>
              {/* La `key` reinicia el formulario al cambiar de modelo, de modo
                  que los campos correspondan siempre al modelo activo. */}
              <FormularioPrediccion
                key={modelo.id}
                modelo={modelo}
                onResultado={setResultado}
              />
            </TarjetaCuerpo>
          </Tarjeta>
        </div>

        <div className="lg:col-span-2">
          {resultado ? (
            <TarjetaResultado
              modelo={modelo}
              resultado={resultado}
              onReiniciar={() => setResultado(null)}
            />
          ) : (
            <Tarjeta variante="plana" className="h-full">
              <TarjetaCuerpo className="flex h-full flex-col items-center justify-center py-12 text-center">
                <span
                  className={`flex size-12 items-center justify-center rounded-full border ${modelo.acento.fondo} ${modelo.acento.borde} ${modelo.acento.texto}`}
                >
                  <Icono className="size-6" />
                </span>
                <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Sin predicción todavía
                </p>
                <p className="mt-1 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Completa las variables y pulsa «Calcular predicción». El
                  resultado aparecerá aquí.
                </p>
              </TarjetaCuerpo>
            </Tarjeta>
          )}
        </div>
      </div>
    </section>
  );
}
