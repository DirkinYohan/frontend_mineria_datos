/**
 * Formulario de predicción.
 *
 * Genera dinámicamente los campos a partir de la especificación del modelo
 * seleccionado, de modo que al cambiar de modelo solo se muestran sus propias
 * variables. Toda la lógica de cálculo y validación vive en `@/lib/models`.
 */

"use client";

import { useMemo, useState } from "react";
import { Boton } from "@/components/ui/Button";
import { CampoNumerico } from "@/components/ui/NumberField";
import { Alerta } from "@/components/ui/Alert";
import { IconoCalcular, IconoReiniciar } from "@/components/ui/Icons";
import { predecir } from "@/lib/models/predict";
import { validarEntradas } from "@/lib/models/validation";
import type { DefinicionModelo, ResultadoPrediccion } from "@/types/models";

interface FormularioPrediccionProps {
  modelo: DefinicionModelo;
  /** Se invoca con el resultado cuando el cálculo termina correctamente. */
  onResultado: (resultado: ResultadoPrediccion) => void;
}

/** Construye el estado inicial del formulario con los valores mínimos. */
function estadoInicial(modelo: DefinicionModelo): Record<string, string> {
  return Object.fromEntries(
    modelo.variables.map((variable) => [variable.nombre, String(variable.minimo)]),
  );
}

/**
 * Formulario con los campos del modelo y el botón de cálculo.
 */
export function FormularioPrediccion({
  modelo,
  onResultado,
}: FormularioPrediccionProps) {
  const [valores, setValores] = useState<Record<string, string>>(() =>
    estadoInicial(modelo),
  );
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [calculando, setCalculando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  // Los valores iniciales dependen del modelo, así que se recalculan cuando
  // cambia. Se usa `key` en el componente padre para garantizar el reinicio.
  const variables = useMemo(() => modelo.variables, [modelo]);

  function actualizar(nombre: string, valor: string) {
    setValores((previos) => ({ ...previos, [nombre]: valor }));
    setErrores((previos) => {
      if (!(nombre in previos)) return previos;
      const { [nombre]: _descartado, ...resto } = previos;
      return resto;
    });
    setErrorGeneral(null);
  }

  function reiniciar() {
    setValores(estadoInicial(modelo));
    setErrores({});
    setErrorGeneral(null);
  }

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const validacion = validarEntradas(modelo, valores);

    if (!validacion.valido) {
      const mapa: Record<string, string> = {};
      for (const error of validacion.errores) {
        mapa[error.variable] = error.mensaje;
      }
      setErrores(mapa);
      setErrorGeneral(
        validacion.errores.length === 1
          ? "Hay un campo que necesita corrección."
          : `Hay ${validacion.errores.length} campos que necesitan corrección.`,
      );
      return;
    }

    setErrores({});
    setErrorGeneral(null);
    setCalculando(true);

    try {
      // La inferencia es síncrona y muy rápida: la espera se resuelve en el
      // siguiente ciclo para que el estado de carga sea perceptible y evitar
      // un parpadeo del resultado.
      await new Promise((resolver) => setTimeout(resolver, 220));
      onResultado(predecir(modelo, validacion.valores));
    } catch (error) {
      setErrorGeneral(
        error instanceof Error
          ? error.message
          : "No se pudo calcular la predicción.",
      );
    } finally {
      setCalculando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {variables.map((variable) => (
          <CampoNumerico
            key={variable.nombre}
            variable={variable}
            valor={valores[variable.nombre] ?? ""}
            onCambio={(valor) => actualizar(variable.nombre, valor)}
            error={errores[variable.nombre]}
          />
        ))}
      </div>

      {errorGeneral ? <Alerta tono="error">{errorGeneral}</Alerta> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Boton
          type="submit"
          cargando={calculando}
          icono={<IconoCalcular className="size-4" />}
        >
          {calculando ? "Calculando…" : "Calcular predicción"}
        </Boton>
        <Boton
          variante="secundario"
          onClick={reiniciar}
          disabled={calculando}
          icono={<IconoReiniciar className="size-4" />}
        >
          Restablecer
        </Boton>
      </div>
    </form>
  );
}
