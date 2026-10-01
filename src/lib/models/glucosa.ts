/**
 * Acceso al modelo de nivel de glucosa.
 *
 * Encapsula la inferencia de este modelo concreto para que la interfaz no
 * dependa de los nombres de las variables ni de la configuración global.
 */

import { MODELOS } from "@/config/models";
import { evaluarRegresion, predecir } from "@/lib/models/predict";
import { validarEntradas } from "@/lib/models/validation";
import type {
  DefinicionModelo,
  EspecificacionVariable,
  ResultadoPrediccion,
  ValoresEntrada,
} from "@/types/models";

/** Definición completa del modelo de glucosa. */
export const MODELO_GLUCOSA: DefinicionModelo = MODELOS.glucosa;

/** Variables de entrada, en el orden exacto del entrenamiento. */
export const VARIABLES_GLUCOSA: readonly EspecificacionVariable[] =
  MODELO_GLUCOSA.variables;

/**
 * Ejecuta una predicción del nivel de glucosa.
 *
 * @param valores Valores de `Edad`, `IMC` y `Actividad_Fisica`.
 * @returns El nivel estimado con su trazabilidad.
 *
 * @throws Error si falta algún valor requerido.
 */
export function predecirGlucosa(valores: ValoresEntrada): ResultadoPrediccion {
  return predecir(MODELO_GLUCOSA, valores);
}

/**
 * Comprueba que unos valores puedan evaluarse con este modelo.
 *
 * @param entradas Valores sin convertir, tal como llegan del formulario.
 */
export function validarGlucosa(entradas: Record<string, unknown>) {
  return validarEntradas(MODELO_GLUCOSA, entradas);
}

/**
 * Calcula el nivel de glucosa a partir de los tres valores.
 *
 * Función de conveniencia para cuando los valores ya están validados.
 */
export function calcularNivelGlucosa(
  edad: number,
  imc: number,
  actividadFisica: number,
): number {
  return evaluarRegresion(
    MODELO_GLUCOSA.coeficientes,
    ["Edad", "IMC", "Actividad_Fisica"],
    { Edad: edad, IMC: imc, Actividad_Fisica: actividadFisica },
  );
}
