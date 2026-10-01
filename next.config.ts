import type { NextConfig } from "next";

/**
 * Configuración de Next.js.
 *
 * No se define ninguna reescritura ni proxy hacia un servidor de predicciones
 * porque este proyecto **no tiene backend**: la inferencia se resuelve en el
 * propio frontend a partir de los coeficientes exportados de los modelos.
 *
 * Los archivos `.joblib` se sirven como estáticos desde `public/models/`
 * únicamente con fines de trazabilidad y descarga; ver `README.md` para la
 * explicación de por qué el navegador no puede ejecutarlos.
 */
const nextConfig: NextConfig = {
  // Cabeceras que permiten descargar los .joblib originales como artefacto.
  //
  // Nota: el parámetro comodín `:archivo*` captura un array de segmentos, por
  // lo que no puede interpolarse en el nombre del archivo. Se usa el comodín
  // simple `:archivo` porque los artefactos viven directamente en /models/.
  async headers() {
    return [
      {
        source: "/models/:archivo",
        headers: [
          { key: "Content-Type", value: "application/octet-stream" },
          {
            key: "Content-Disposition",
            value: "attachment; filename=\":archivo\"",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
