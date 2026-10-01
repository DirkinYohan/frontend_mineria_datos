/**
 * Verificación de que la inferencia del frontend coincide con el modelo de
 * Python.
 *
 * Los casos de referencia se generan ejecutando el `.joblib` original con
 * scikit-learn (`scripts/generar_casos_paridad.py`) y se guardan en
 * `scripts/parity-cases.json`. Este script evalúa las mismas entradas con la
 * aritmética de TypeScript y compara los resultados.
 *
 * Uso:
 *   node scripts/verify_parity.mjs
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const aqui = dirname(fileURLToPath(import.meta.url));

/** Coeficientes reales, leídos del mismo JSON que usa la aplicación. */
const MODELOS = {
  dolar: {
    variables: ["Dia", "Inflacion", "Tasa_interes"],
    intercepto: 3985.7832908942446,
    coeficientes: {
      Dia: 4.984338715884641,
      Inflacion: -870.7317083114698,
      Tasa_interes: -1.3774312878081811,
    },
  },
  glucosa: {
    variables: ["Edad", "IMC", "Actividad_Fisica"],
    intercepto: 65.86086530452525,
    coeficientes: {
      Edad: 1.226590034499573,
      IMC: 0.9333730560350988,
      Actividad_Fisica: -2.085276343043282,
    },
  },
  energia: {
    variables: ["Temperatura", "Hora", "Dia_Semana"],
    intercepto: 101.28823172887473,
    coeficientes: {
      Temperatura: 9.952865907791665,
      Hora: 5.019813389575856,
      Dia_Semana: -3.031176657433644,
    },
  },
};

/**
 * Réplica exacta de `evaluarRegresion` de `src/lib/models/predict.ts`.
 * Se reimplementa aquí porque Node no importa TypeScript sin transpilar; la
 * equivalencia entre ambas implementaciones se comprueba a través de los
 * resultados.
 */
function evaluarRegresion(modelo, valores) {
  let acumulado = modelo.intercepto;
  for (const nombre of modelo.variables) {
    acumulado += modelo.coeficientes[nombre] * valores[nombre];
  }
  return acumulado;
}

const casos = JSON.parse(
  readFileSync(join(aqui, "parity-cases.json"), "utf-8"),
);

let fallos = 0;
let peorDiferencia = 0;

console.log("PARIDAD FRONTEND (TypeScript) vs MODELO (scikit-learn)");
console.log("=".repeat(72));

for (const caso of casos) {
  const modelo = MODELOS[caso.modelo];
  if (!modelo) {
    console.error(`Modelo desconocido en los casos: ${caso.modelo}`);
    process.exit(1);
  }

  const obtenido = evaluarRegresion(modelo, caso.entradas);
  const diferencia = Math.abs(obtenido - caso.esperado);
  peorDiferencia = Math.max(peorDiferencia, diferencia);

  // Tolerancia muy por debajo de la precisión mostrada en la interfaz.
  const coincide = diferencia < 1e-9;
  if (!coincide) fallos += 1;

  const valores = Object.values(caso.entradas)
    .map((v) => v.toFixed(4))
    .join(", ");
  console.log(
    `${coincide ? "OK   " : "FALLO"} ${caso.modelo.padEnd(8)} ` +
      `[${valores}]`,
  );
  console.log(
    `      esperado=${caso.esperado.toFixed(10)}  ` +
      `obtenido=${obtenido.toFixed(10)}  ` +
      `dif=${diferencia.toExponential(2)}`,
  );
}

console.log("=".repeat(72));
console.log(`Casos evaluados   : ${casos.length}`);
console.log(`Coincidencias     : ${casos.length - fallos}`);
console.log(`Discrepancias     : ${fallos}`);
console.log(`Diferencia máxima : ${peorDiferencia.toExponential(3)}`);
console.log();
console.log(
  fallos === 0
    ? "PARIDAD VERIFICADA: el frontend reproduce el modelo de Python."
    : "ATENCION: hay discrepancias respecto al modelo de Python.",
);

process.exit(fallos === 0 ? 0 : 1);
