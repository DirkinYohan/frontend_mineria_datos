/**
 * Punto de entrada de la capa de modelos.
 *
 * Reexporta la lógica de inferencia y validación, junto con los accesos
 * específicos de cada modelo, de modo que los componentes importen siempre
 * desde `@/lib/models`.
 */

export {
  evaluarRegresion,
  describirEcuacion,
  predecir,
  redondear,
  formatearNumero,
} from "@/lib/models/predict";

export {
  aNumero,
  validarEntradas,
  valorInicial,
  type ResultadoValidacion,
} from "@/lib/models/validation";

export {
  MODELO_DOLAR,
  VARIABLES_DOLAR,
  predecirDolar,
  validarDolar,
  calcularPrecioDolar,
} from "@/lib/models/dolar";

export {
  MODELO_GLUCOSA,
  VARIABLES_GLUCOSA,
  predecirGlucosa,
  validarGlucosa,
  calcularNivelGlucosa,
} from "@/lib/models/glucosa";

export {
  MODELO_ENERGIA,
  VARIABLES_ENERGIA,
  predecirEnergia,
  validarEnergia,
  calcularConsumoEnergia,
} from "@/lib/models/energia";
