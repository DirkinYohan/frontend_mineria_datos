/**
 * Fuente única de verdad del frontend.
 *
 * ---------------------------------------------------------------------------
 * PROCEDENCIA DE LOS VALORES
 * ---------------------------------------------------------------------------
 * Todos los números de este archivo se extrajeron de los resultados reales del
 * proyecto de Machine Learning. No hay ningún valor inventado ni estimado.
 *
 * Coeficientes e intercepto:
 *   `laboratorio_mineria_datos/results/<modelo>/modelo.json`
 *   (generado por `src/<modelo>/modelo.py` a partir del `.joblib` entrenado)
 *
 * Métricas de evaluación:
 *   `laboratorio_mineria_datos/results/<modelo>/metricas.json` → `metricas_prueba`
 *   (medidas sobre el 20 % de datos reservados, semilla 42)
 *
 * Rangos y unidades de las variables:
 *   `laboratorio_mineria_datos/src/<modelo>/especificacion.py`
 *
 * ---------------------------------------------------------------------------
 * POR QUÉ SE USAN COEFICIENTES Y NO LOS .JOBLIB
 * ---------------------------------------------------------------------------
 * Un archivo `.joblib` es un flujo de bytes de `pickle` de Python que describe
 * objetos de `scikit-learn` y `numpy`. El navegador solo ejecuta JavaScript, por
 * lo que no puede deserializarlo: es una limitación de plataforma, no una
 * decisión de diseño. Ver `README.md`, sección «Limitación técnica».
 *
 * Para una regresión lineal, `intercepto + Σ (coeficiente × variable)` reproduce
 * el modelo de forma **exacta**, no aproximada, porque es literalmente la misma
 * operación que ejecuta `LinearRegression.predict`. Los `.joblib` originales se
 * conservan intactos como artefacto oficial y se distribuyen en `public/models/`.
 */

import type { DefinicionModelo, MetricasModelo, ModeloId } from "@/types/models";

/** Identificadores de los modelos, en el orden en que se muestran. */
export const MODELOS_IDS: readonly ModeloId[] = [
  "dolar",
  "glucosa",
  "energia",
] as const;

/** Carpeta pública donde se distribuyen los `.joblib` originales. */
export const CARPETA_MODELOS = "/models";

/** Metadatos generales del proyecto, usados en la cabecera y el pie. */
export const PROYECTO = {
  nombre: "Laboratorio de Minería de Datos",
  titulo: "Predicción con Regresión Lineal Múltiple",
  descripcion:
    "Interfaz para realizar predicciones con tres modelos de regresión lineal múltiple entrenados con scikit-learn siguiendo la metodología CRISP-DM.",
  tecnologia: "Next.js · TypeScript · Tailwind CSS",
  origen:
    "Los modelos fueron entrenados y evaluados en el proyecto de Machine Learning mediante Python, pandas y scikit-learn.",
} as const;

/**
 * Métricas reales de evaluación, medidas sobre el conjunto de prueba.
 * Valores tomados de `results/<modelo>/metricas.json`.
 */
const METRICAS: Record<ModeloId, MetricasModelo> = {
  dolar: {
    r2: 0.996312811756911,
    r2Ajustado: 0.9961975871243145,
    mae: 37.00645389507638,
    mse: 2376.9708765724663,
    rmse: 48.754188297750034,
  },
  glucosa: {
    r2: 0.681371586540484,
    r2Ajustado: 0.6789577349233664,
    mae: 12.219782574464597,
    mse: 233.69300045085828,
    rmse: 15.28702065318348,
  },
  energia: {
    r2: 0.8968196536749335,
    r2Ajustado: 0.8966645729940843,
    mae: 16.510114230844557,
    mse: 429.51869176035575,
    rmse: 20.724832731782318,
  },
};

/**
 * Definición completa de los tres modelos.
 *
 * El orden de `variables` es significativo: es el orden de columnas con el que
 * se entrenó cada modelo. La lógica de inferencia lo respeta estrictamente.
 */
export const MODELOS: Record<ModeloId, DefinicionModelo> = {
  dolar: {
    id: "dolar",
    nombre: "Precio del Dólar",
    descripcion:
      "Estima el precio del dólar a partir del día de la serie, la inflación y la tasa de interés de referencia.",
    variableObjetivo: "Precio_Dolar",
    etiquetaObjetivo: "Precio estimado del dólar",
    unidadObjetivo: "unidades monetarias",
    archivoJoblib: "modelo_dolar.joblib",
    rutaJoblib: `${CARPETA_MODELOS}/modelo_dolar.joblib`,
    metricasExigidas: ["MSE", "R²"],
    variables: [
      {
        nombre: "Dia",
        etiqueta: "Día",
        unidad: "días",
        minimo: 1,
        maximo: 3650,
        entera: true,
        paso: 1,
        ayuda: "Día consecutivo de la serie (1 = primer día registrado).",
      },
      {
        nombre: "Inflacion",
        etiqueta: "Inflación",
        unidad: "fracción decimal",
        minimo: 0,
        maximo: 1,
        paso: 0.001,
        ayuda:
          "Tasa de inflación como fracción decimal. Por ejemplo, 0.02 equivale a 2 %.",
      },
      {
        nombre: "Tasa_interes",
        etiqueta: "Tasa de interés",
        unidad: "porcentaje",
        minimo: 0,
        maximo: 100,
        paso: 0.01,
        ayuda: "Tasa de interés de referencia, en porcentaje.",
      },
    ],
    coeficientes: {
      intercepto: 3985.7832908942446,
      coeficientes: {
        Dia: 4.984338715884641,
        Inflacion: -870.7317083114698,
        Tasa_interes: -1.3774312878081811,
      },
    },
    metricas: METRICAS.dolar,
    acento: {
      texto: "text-emerald-700 dark:text-emerald-400",
      fondo: "bg-emerald-50 dark:bg-emerald-950/40",
      borde: "border-emerald-200 dark:border-emerald-900",
      solido: "bg-emerald-600 hover:bg-emerald-700 focus-visible:outline-emerald-600",
    },
  },
  glucosa: {
    id: "glucosa",
    nombre: "Nivel de Glucosa",
    descripcion:
      "Estima el nivel de glucosa en sangre a partir de la edad, el índice de masa corporal y el nivel de actividad física.",
    variableObjetivo: "Nivel_Glucosa",
    etiquetaObjetivo: "Nivel estimado de glucosa",
    unidadObjetivo: "mg/dL",
    archivoJoblib: "modelo_glucosa.joblib",
    rutaJoblib: `${CARPETA_MODELOS}/modelo_glucosa.joblib`,
    metricasExigidas: ["MSE", "R²"],
    variables: [
      {
        nombre: "Edad",
        etiqueta: "Edad",
        unidad: "años",
        minimo: 0,
        maximo: 120,
        entera: true,
        paso: 1,
        ayuda: "Edad de la persona en años.",
      },
      {
        nombre: "IMC",
        etiqueta: "IMC",
        unidad: "kg/m²",
        minimo: 5,
        maximo: 80,
        paso: 0.01,
        ayuda: "Índice de masa corporal (peso dividido por la talla al cuadrado).",
      },
      {
        nombre: "Actividad_Fisica",
        etiqueta: "Actividad física",
        unidad: "nivel 0-9",
        minimo: 0,
        maximo: 9,
        entera: true,
        paso: 1,
        ayuda: "Nivel de actividad física: 0 = sedentario, 9 = muy activo.",
      },
    ],
    coeficientes: {
      intercepto: 65.86086530452525,
      coeficientes: {
        Edad: 1.226590034499573,
        IMC: 0.9333730560350988,
        Actividad_Fisica: -2.085276343043282,
      },
    },
    metricas: METRICAS.glucosa,
    acento: {
      texto: "text-rose-700 dark:text-rose-400",
      fondo: "bg-rose-50 dark:bg-rose-950/40",
      borde: "border-rose-200 dark:border-rose-900",
      solido: "bg-rose-600 hover:bg-rose-700 focus-visible:outline-rose-600",
    },
  },
  energia: {
    id: "energia",
    nombre: "Consumo de Energía",
    descripcion:
      "Estima el consumo de energía a partir de la temperatura ambiente, la hora del día y el día de la semana.",
    variableObjetivo: "Consumo_Energia",
    etiquetaObjetivo: "Consumo estimado de energía",
    unidadObjetivo: "kWh",
    archivoJoblib: "modelo_energia.joblib",
    rutaJoblib: `${CARPETA_MODELOS}/modelo_energia.joblib`,
    metricasExigidas: ["RMSE", "R²"],
    variables: [
      {
        nombre: "Temperatura",
        etiqueta: "Temperatura",
        unidad: "°C",
        minimo: -30,
        maximo: 60,
        paso: 0.1,
        ayuda: "Temperatura ambiente en grados Celsius.",
      },
      {
        nombre: "Hora",
        etiqueta: "Hora",
        unidad: "hora 1-24",
        minimo: 1,
        maximo: 24,
        entera: true,
        paso: 1,
        ayuda: "Hora del día en que se mide el consumo.",
      },
      {
        nombre: "Dia_Semana",
        etiqueta: "Día de la semana",
        unidad: "día 1-7",
        minimo: 1,
        maximo: 7,
        entera: true,
        paso: 1,
        ayuda: "Día de la semana: 1 = lunes, 7 = domingo.",
      },
    ],
    coeficientes: {
      intercepto: 101.28823172887473,
      coeficientes: {
        Temperatura: 9.952865907791665,
        Hora: 5.019813389575856,
        Dia_Semana: -3.031176657433644,
      },
    },
    metricas: METRICAS.energia,
    acento: {
      texto: "text-amber-700 dark:text-amber-400",
      fondo: "bg-amber-50 dark:bg-amber-950/40",
      borde: "border-amber-200 dark:border-amber-900",
      solido: "bg-amber-600 hover:bg-amber-700 focus-visible:outline-amber-600",
    },
  },
};

/** Lista de modelos en el orden de presentación. */
export const LISTA_MODELOS: readonly DefinicionModelo[] = MODELOS_IDS.map(
  (id) => MODELOS[id],
);

/**
 * Recupera la definición de un modelo por su identificador.
 *
 * @throws Error si el identificador no corresponde a ningún modelo.
 */
export function obtenerModelo(id: string): DefinicionModelo {
  if (!(id in MODELOS)) {
    throw new Error(
      `Modelo desconocido: "${id}". Disponibles: ${MODELOS_IDS.join(", ")}.`,
    );
  }
  return MODELOS[id as ModeloId];
}
