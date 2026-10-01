/**
 * Motor de inferencia para los modelos de regresión lineal múltiple.
 *
 * ---------------------------------------------------------------------------
 * QUÉ HACE
 * ---------------------------------------------------------------------------
 * Evalúa la ecuación de regresión lineal múltiple de un modelo:
 *
 *     ŷ = β₀ + β₁·x₁ + β₂·x₂ + β₃·x₃
 *
 * donde β₀ es el intercepto y βᵢ los coeficientes obtenidos del entrenamiento
 * con `scikit-learn`.
 *
 * ---------------------------------------------------------------------------
 * POR QUÉ ES EQUIVALENTE A EJECUTAR EL .JOBLIB
 * ---------------------------------------------------------------------------
 * `LinearRegression.predict` de scikit-learn calcula exactamente esa expresión
 * mediante un producto matricial (`X @ coef_ + intercept_`). Al evaluarla en
 * JavaScript con los mismos coeficientes se obtiene el mismo resultado salvo el
 * redondeo propio de la aritmética de coma flotante IEEE 754, que es idéntico
 * en ambos lenguajes.
 *
 * Esto **no** es una aproximación ni una reimplementación del modelo: es el
 * modelo, expresado con sus parámetros reales.
 */

import type {
  CoeficientesModelo,
  DefinicionModelo,
  ResultadoPrediccion,
  ValoresEntrada,
} from "@/types/models";

/**
 * Evalúa la ecuación de regresión.
 *
 * @param coeficientes Intercepto y coeficientes del modelo.
 * @param ordenVariables Orden exacto de las variables, tal como se entrenó.
 * @param valores Valores de entrada, indexados por nombre de variable.
 * @returns La predicción.
 *
 * @throws Error si falta algún coeficiente para las variables indicadas.
 */
export function evaluarRegresion(
  coeficientes: CoeficientesModelo,
  ordenVariables: readonly string[],
  valores: ValoresEntrada,
): number {
  let acumulado = coeficientes.intercepto;

  for (const nombre of ordenVariables) {
    const coeficiente = coeficientes.coeficientes[nombre];

    if (coeficiente === undefined) {
      throw new Error(
        `El modelo no tiene un coeficiente para la variable "${nombre}".`,
      );
    }

    const valor = valores[nombre];

    if (valor === undefined || Number.isNaN(valor)) {
      throw new Error(`Falta un valor válido para la variable "${nombre}".`);
    }

    acumulado += coeficiente * valor;
  }

  return acumulado;
}

/**
 * Construye la expresión evaluada, útil para mostrar la trazabilidad del
 * cálculo en la interfaz.
 */
export function describirEcuacion(
  coeficientes: CoeficientesModelo,
  ordenVariables: readonly string[],
  valores: ValoresEntrada,
): string {
  const terminos = ordenVariables.map((nombre) => {
    const coeficiente = coeficientes.coeficientes[nombre] ?? 0;
    const valor = valores[nombre] ?? 0;
    const signo = coeficiente >= 0 ? "+" : "−";
    return `${signo} ${Math.abs(coeficiente).toFixed(6)} · ${valor}`;
  });

  return `${coeficientes.intercepto.toFixed(6)} ${terminos.join(" ")}`;
}

/**
 * Genera una predicción completa para un modelo.
 *
 * @param modelo Definición del modelo a evaluar.
 * @param valores Valores introducidos por el usuario.
 * @returns El resultado con su valor, unidad y trazabilidad.
 */
export function predecir(
  modelo: DefinicionModelo,
  valores: ValoresEntrada,
): ResultadoPrediccion {
  const nombres = modelo.variables.map((variable) => variable.nombre);
  const valor = evaluarRegresion(modelo.coeficientes, nombres, valores);

  return {
    modelId: modelo.id,
    valor,
    unidad: modelo.unidadObjetivo,
    etiqueta: modelo.etiquetaObjetivo,
    detalle: describirEcuacion(modelo.coeficientes, nombres, valores),
  };
}

/**
 * Redondea un resultado para su presentación.
 *
 * @param valor Valor a formatear.
 * @param decimales Número de decimales.
 */
export function redondear(valor: number, decimales = 2): number {
  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
}

/**
 * Formatea un número con separador de miles y decimales fijos.
 *
 * Se usa `es-ES` para que el separador de miles sea el punto y el decimal la
 * coma, coherente con el resto de la documentación del proyecto.
 */
export function formatearNumero(valor: number, decimales = 2): string {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor);
}
