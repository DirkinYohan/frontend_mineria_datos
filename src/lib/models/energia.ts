/**
 * Acceso al modelo de consumo de energía.
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

/** Definición completa del modelo de energía. */
export const MODELO_ENERGIA: DefinicionModelo = MODELOS.energia;

/** Variables de entrada, en el orden exacto del entrenamiento. */
export const VARIABLES_ENERGIA: readonly EspecificacionVariable[] =
  MODELO_ENERGIA.variables;

/**
 * Ejecuta una predicción del consumo de energía.
 *
 * @param valores Valores de `Temperatura`, `Hora` y `Dia_Semana`.
 * @returns El consumo estimado con su trazabilidad.
 *
 * @throws Error si falta algún valor requerido.
 */
export function predecirEnergia(valores: ValoresEntrada): ResultadoPrediccion {
  return predecir(MODELO_ENERGIA, valores);
}

/**
 * Comprueba que unos valores puedan evaluarse con este modelo.
 *
 * @param entradas Valores sin convertir, tal como llegan del formulario.
 */
export function validarEnergia(entradas: Record<string, unknown>) {
  return validarEntradas(MODELO_ENERGIA, entradas);
}

/**
 * Calcula el consumo de energía a partir de los tres valores.
 *
 * Función de conveniencia para cuando los valores ya están validados.
 */
export function calcularConsumoEnergia(
  temperatura: number,
  hora: number,
  diaSemana: number,
): number {
  return evaluarRegresion(
    MODELO_ENERGIA.coeficientes,
    ["Temperatura", "Hora", "Dia_Semana"],
    { Temperatura: temperatura, Hora: hora, Dia_Semana: diaSemana },
  );
}
