/**
 * Acceso al modelo de precio del dólar.
 *
 * Encapsula la inferencia de este modelo concreto para que la interfaz no
 * dependa de los nombres de las variables ni de la configuración global.
 */

import { MODELOS } from "@/config/models";
import { evaluarRegresion, predecir } from "@/lib/models/predict";
import { validarEntradas, type ResultadoValidacion } from "@/lib/models/validation";
import type {
  DefinicionModelo,
  EspecificacionVariable,
  ResultadoPrediccion,
  ValoresEntrada,
} from "@/types/models";

/** Definición completa del modelo de dólar. */
export const MODELO_DOLAR: DefinicionModelo = MODELOS.dolar;

/** Variables de entrada, en el orden exacto del entrenamiento. */
export const VARIABLES_DOLAR: readonly EspecificacionVariable[] =
  MODELO_DOLAR.variables;

/**
 * Ejecuta una predicción del precio del dólar.
 *
 * @param valores Valores de `Dia`, `Inflacion` y `Tasa_interes`.
 * @returns El precio estimado con su trazabilidad.
 *
 * @throws Error si falta algún valor requerido.
 */
export function predecirDolar(valores: ValoresEntrada): ResultadoPrediccion {
  return predecir(MODELO_DOLAR, valores);
}

/**
 * Comprueba que unos valores puedan evaluarse con este modelo.
 *
 * @param entradas Valores sin convertir, tal como llegan del formulario.
 */
export function validarDolar(
  entradas: Record<string, unknown>,
): ResultadoValidacion {
  return validarEntradas(MODELO_DOLAR, entradas);
}

/**
 * Calcula el precio del dólar a partir de los tres valores.
 *
 * Función de conveniencia para cuando los valores ya están validados.
 */
export function calcularPrecioDolar(
  dia: number,
  inflacion: number,
  tasaInteres: number,
): number {
  return evaluarRegresion(
    MODELO_DOLAR.coeficientes,
    ["Dia", "Inflacion", "Tasa_interes"],
    { Dia: dia, Inflacion: inflacion, Tasa_interes: tasaInteres },
  );
}
