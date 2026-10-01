/**
 * Validación de las entradas del usuario.
 *
 * Los límites provienen de la especificación de dominio declarada en el
 * proyecto de Machine Learning (`src/<modelo>/especificacion.py`), donde se
 * usaron para descartar valores imposibles durante la limpieza de datos. Al
 * replicarlos aquí, el frontend evita enviar al modelo valores que nunca vio
 * durante el entrenamiento y ofrece mensajes de error concretos.
 *
 * La validación está separada de los componentes para poder probarla y
 * reutilizarla sin depender de React.
 */

import type {
  DefinicionModelo,
  ErrorValidacion,
  EspecificacionVariable,
  ValoresEntrada,
} from "@/types/models";

/** Resultado de validar un conjunto de valores. */
export interface ResultadoValidacion {
  /** Indica si todos los valores son válidos. */
  valido: boolean;
  /** Valores convertidos a número, listos para la inferencia. */
  valores: ValoresEntrada;
  /** Problemas encontrados, uno por campo. */
  errores: ErrorValidacion[];
  /** Errores indexados por nombre de variable, cómodo para la interfaz. */
  erroresPorVariable: Record<string, string>;
}

/**
 * Convierte un valor de formulario a número.
 *
 * @param entrada Valor tal como llega del control de entrada.
 * @returns El número, o `null` si no es un valor numérico finito.
 */
export function aNumero(entrada: unknown): number | null {
  if (entrada === null || entrada === undefined) {
    return null;
  }

  // Un campo vacío en un `<input type="number">` llega como cadena vacía.
  if (typeof entrada === "string" && entrada.trim() === "") {
    return null;
  }

  const numero = typeof entrada === "number" ? entrada : Number(entrada);

  if (!Number.isFinite(numero)) {
    return null;
  }

  return numero;
}

/**
 * Valida el valor de una variable según su especificación.
 *
 * @returns El mensaje de error, o `null` si el valor es correcto.
 */
function validarVariable(
  variable: EspecificacionVariable,
  valor: number | null,
): string | null {
  if (valor === null) {
    return `Introduce un valor numérico para «${variable.etiqueta}».`;
  }

  if (valor < variable.minimo || valor > variable.maximo) {
    return `«${variable.etiqueta}» debe estar entre ${variable.minimo} y ${variable.maximo} ${variable.unidad}.`;
  }

  if (variable.entera && !Number.isInteger(valor)) {
    return `«${variable.etiqueta}» debe ser un número entero.`;
  }

  return null;
}

/**
 * Valida todos los valores de un modelo.
 *
 * @param modelo Modelo cuya especificación define los límites.
 * @param entradas Valores introducidos por el usuario.
 * @returns El resultado con los valores convertidos y los errores detectados.
 */
export function validarEntradas(
  modelo: DefinicionModelo,
  entradas: Record<string, unknown>,
): ResultadoValidacion {
  const valores: ValoresEntrada = {};
  const errores: ErrorValidacion[] = [];
  const erroresPorVariable: Record<string, string> = {};

  for (const variable of modelo.variables) {
    const numero = aNumero(entradas[variable.nombre]);
    const error = validarVariable(variable, numero);

    if (error) {
      errores.push({
        variable: variable.nombre,
        etiqueta: variable.etiqueta,
        mensaje: error,
      });
      erroresPorVariable[variable.nombre] = error;
      continue;
    }

    valores[variable.nombre] = numero as number;
  }

  return {
    valido: errores.length === 0,
    valores,
    errores,
    erroresPorVariable,
  };
}

/**
 * Devuelve el valor inicial de un campo: el mínimo de su rango.
 *
 * Es un punto de partida seguro, siempre dentro de los límites del modelo.
 */
export function valorInicial(variable: EspecificacionVariable): number {
  return variable.minimo;
}
