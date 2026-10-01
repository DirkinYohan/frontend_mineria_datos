/**
 * Página principal de la aplicación.
 *
 * Es el único componente con estado de nivel de página: mantiene qué modelo está
 * activo para que el panel principal y la sección de predicción permanezcan
 * sincronizados.
 */

"use client";

import { useState } from "react";
import { Cabecera } from "@/components/layout/Header";
import { Dashboard } from "@/components/layout/Dashboard";
import { SeccionPrediccion } from "@/components/prediction/PredictionSection";
import type { DefinicionModelo, ModeloId } from "@/types/models";

/**
 * Compone la interfaz completa: panel y sección de predicción.
 */
export default function PaginaPrincipal() {
  const [modeloActivo, setModeloActivo] = useState<ModeloId>("dolar");

  /** Lleva al usuario a la sección de predicción con el modelo elegido. */
  function usarModelo(modelo: DefinicionModelo) {
    setModeloActivo(modelo.id);
    // El desplazamiento se realiza tras el repintado para asegurar que la
    // sección ya refleja el modelo seleccionado.
    requestAnimationFrame(() => {
      document
        .getElementById("prediccion")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <>
      <Cabecera />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Dashboard onUsarModelo={usarModelo} />

        <div className="mt-14">
          <SeccionPrediccion
            modeloActivo={modeloActivo}
            onCambiarModelo={setModeloActivo}
          />
        </div>
      </main>
    </>
  );
}
