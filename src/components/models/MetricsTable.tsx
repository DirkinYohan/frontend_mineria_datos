/**
 * Tabla de métricas reales de evaluación.
 *
 * Los valores proceden de `results/<modelo>/metricas.json` del proyecto de
 * Machine Learning, medidos sobre el conjunto de prueba. No hay cifras
 * estimadas ni de ejemplo.
 */

import { Tarjeta, TarjetaCabecera, TarjetaCuerpo } from "@/components/ui/Card";
import { Insignia } from "@/components/ui/Badge";
import { IconoModelo } from "@/components/ui/Icons";
import { LISTA_MODELOS } from "@/config/models";
import { formatearNumero } from "@/lib/utils";

/**
 * Compara las métricas de los tres modelos en una sola tabla.
 */
export function TablaMetricas() {
  return (
    <Tarjeta>
      <TarjetaCabecera
        icono={<IconoModelo className="size-5" />}
        titulo="Métricas de evaluación"
        descripcion="Resultados reales medidos sobre el conjunto de prueba (20 % de los datos, semilla 42). El modelo no vio esas observaciones durante el entrenamiento."
      />
      <TarjetaCuerpo className="px-0 py-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">
              Métricas de evaluación de los tres modelos de regresión lineal
              múltiple
            </caption>
            <thead>
              <tr className="border-b border-zinc-200 text-left dark:border-zinc-800">
                <th
                  scope="col"
                  className="whitespace-nowrap px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                >
                  Modelo
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                >
                  Exigidas
                </th>
                {["R²", "R² ajustado", "MAE", "MSE", "RMSE"].map((metrica) => (
                  <th
                    key={metrica}
                    scope="col"
                    className="whitespace-nowrap px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                  >
                    {metrica}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {LISTA_MODELOS.map((modelo) => (
                <tr
                  key={modelo.id}
                  className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-5 py-3 text-left font-medium text-zinc-900 dark:text-zinc-50"
                  >
                    {modelo.nombre}
                  </th>
                  <td className="whitespace-nowrap px-5 py-3">
                    <span className="flex gap-1">
                      {modelo.metricasExigidas.map((metrica) => (
                        <Insignia key={metrica} variante="neutra">
                          {metrica}
                        </Insignia>
                      ))}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                    {formatearNumero(modelo.metricas.r2, 4)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums text-zinc-600 dark:text-zinc-400">
                    {formatearNumero(modelo.metricas.r2Ajustado, 4)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums text-zinc-600 dark:text-zinc-400">
                    {formatearNumero(modelo.metricas.mae, 2)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums text-zinc-600 dark:text-zinc-400">
                    {formatearNumero(modelo.metricas.mse, 2)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums text-zinc-600 dark:text-zinc-400">
                    {formatearNumero(modelo.metricas.rmse, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TarjetaCuerpo>
    </Tarjeta>
  );
}
