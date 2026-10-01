/**
 * Tipos compartidos por toda la aplicación.
 *
 * Se mantienen deliberadamente separados de la configuración y de la lógica
 * para que cualquier capa (UI, inferencia, configuración) pueda importarlos sin
 * crear dependencias cruzadas.
 */

/** Identificadores de los tres modelos del laboratorio. */
export type ModeloId = "dolar" | "glucosa" | "energia";

/** Tipo de dato admitido en un campo de entrada. */
export type ValorEntrada = number;

/** Mapa de valores introducidos por el usuario: `{ nombreVariable: valor }`. */
export type ValoresEntrada = Record<string, ValorEntrada>;

/**
 * Especificación de una variable de entrada.
 *
 * Los rangos provienen de `src/common/especificacion.py` del proyecto de
 * Machine Learning, donde se usan para validar los datos de entrenamiento. Aquí
 * permiten validar la entrada del usuario antes de calcular la predicción, de
 * modo que el frontend rechace valores que el modelo nunca vio.
 */
export interface EspecificacionVariable {
  /** Nombre exacto de la columna usada al entrenar el modelo. */
  nombre: string;
  /** Etiqueta legible mostrada en la interfaz. */
  etiqueta: string;
  /** Unidad de medida. */
  unidad: string;
  /** Valor mínimo plausible. */
  minimo: number;
  /** Valor máximo plausible. */
  maximo: number;
  /** Descripción de ayuda para el usuario. */
  ayuda: string;
  /** Indica si la variable admite únicamente valores enteros. */
  entera?: boolean;
  /** Incremento sugerido del control de entrada. */
  paso: number;
}

/**
 * Coeficientes exportados por el proyecto de Machine Learning.
 *
 * Proceden de `results/<modelo>/modelo.json`, archivo que genera el pipeline de
 * Python a partir del modelo `.joblib` entrenado. Para una regresión lineal, el
 * vector de coeficientes y el intercepto describen el modelo de forma completa
 * y exacta.
 */
export interface CoeficientesModelo {
  /** Término independiente de la regresión. */
  intercepto: number;
  /** Coeficiente asociado a cada variable, indexado por nombre. */
  coeficientes: Record<string, number>;
}

/**
 * Métricas de evaluación del modelo.
 *
 * Se tomaron de `results/<modelo>/metricas.json` (clave `metricas_prueba`), es
 * decir, medidas sobre el 20 % de datos reservados que el modelo no vio durante
 * el entrenamiento. Son los valores reales del laboratorio, no estimaciones.
 */
export interface MetricasModelo {
  /** Coeficiente de determinación. */
  r2: number;
  /** R² corregido por el número de variables. */
  r2Ajustado: number;
  /** Error absoluto medio. */
  mae: number;
  /** Error cuadrático medio. */
  mse: number;
  /** Raíz del error cuadrático medio. */
  rmse: number;
}

/** Descripción completa de uno de los tres modelos. */
export interface DefinicionModelo {
  id: ModeloId;
  /** Nombre corto del modelo. */
  nombre: string;
  /** Descripción del fenómeno que predice. */
  descripcion: string;
  /** Variable de salida. */
  variableObjetivo: string;
  /** Etiqueta legible de la salida. */
  etiquetaObjetivo: string;
  /** Unidad de la salida. */
  unidadObjetivo: string;
  /** Variables de entrada, en el orden exacto que espera el modelo. */
  variables: EspecificacionVariable[];
  /** Nombre del archivo `.joblib` original en el proyecto de Machine Learning. */
  archivoJoblib: string;
  /** Ruta pública para descargar el `.joblib` original. */
  rutaJoblib: string;
  /** Coeficientes de la regresión. */
  coeficientes: CoeficientesModelo;
  /** Métricas reales de evaluación. */
  metricas: MetricasModelo;
  /** Métricas exigidas por el enunciado del laboratorio. */
  metricasExigidas: string[];
  /** Paleta de acento usada por la interfaz para este modelo. */
  acento: {
    /** Clases Tailwind para el texto. */
    texto: string;
    /** Clases Tailwind para el fondo suave. */
    fondo: string;
    /** Clases Tailwind para el borde. */
    borde: string;
    /** Clases Tailwind para el fondo sólido del botón. */
    solido: string;
  };
}

/** Resultado de una predicción. */
export interface ResultadoPrediccion {
  modelId: ModeloId;
  /** Valor predicho. */
  valor: number;
  /** Unidad del valor predicho. */
  unidad: string;
  /** Etiqueta de la magnitud predicha. */
  etiqueta: string;
  /** Ecuación evaluada, útil para mostrar la trazabilidad del cálculo. */
  detalle: string;
}

/** Error de validación asociado a un campo concreto. */
export interface ErrorValidacion {
  variable: string;
  etiqueta: string;
  mensaje: string;
}
