/**
 * Utilidades de presentación.
 *
 * Se mantienen fuera de los componentes para poder reutilizarlas y probarlas
 * de forma independiente.
 */

/** Formatea un número con separador de miles y decimales fijos. */
export function formatearNumero(valor: number, decimales = 2): string {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor);
}

/** Formatea un porcentaje a partir de una fracción (0.9963 → «99,63 %»). */
export function formatearPorcentaje(fraccion: number, decimales = 2): string {
  return `${formatearNumero(fraccion * 100, decimales)} %`;
}

/** Formatea un número para mostrarlo con muchos decimales (coeficientes). */
export function formatearCoeficiente(valor: number, decimales = 6): string {
  return formatearNumero(valor, decimales);
}

/**
 * Combina clases condicionales en una sola cadena.
 *
 * Alternativa mínima a `clsx`/`cn`: evita añadir una dependencia solo para
 * concatenar clases de Tailwind.
 */
export function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}
