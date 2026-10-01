/**
 * Iconos de la aplicación.
 *
 * Se implementan como componentes SVG en línea, sin dependencias externas, para
 * mantener el bundle pequeño y evitar emojis como elementos de interfaz. Todos
 * heredan el color del texto y aceptan las props habituales de un `<svg>`.
 */

import type { SVGProps } from "react";

type IconoProps = SVGProps<SVGSVGElement>;

const BASE: IconoProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

/** Icono de gráfica ascendente, usado para el modelo de dólar. */
export function IconoTendencia(props: IconoProps) {
  return (
    <svg {...BASE} {...props}>
      <path d="M3 17l5-5 4 4 7-7" />
      <path d="M14 9h5v5" />
    </svg>
  );
}

/** Icono de actividad, usado para el modelo de glucosa. */
export function IconoActividad(props: IconoProps) {
  return (
    <svg {...BASE} {...props}>
      <path d="M3 12h4l2.5-6 4 12L16 12h5" />
    </svg>
  );
}

/** Icono de rayo, usado para el modelo de energía. */
export function IconoEnergia(props: IconoProps) {
  return (
    <svg {...BASE} {...props}>
      <path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10.5H13z" />
    </svg>
  );
}

/** Icono de calculadora, usado en la acción de predecir. */
export function IconoCalcular(props: IconoProps) {
  return (
    <svg {...BASE} {...props}>
      <rect x="4" y="2.5" width="16" height="19" rx="2.5" />
      <path d="M8 7h8M8 12h2m4 0h2M8 16.5h2m4 0h2" />
    </svg>
  );
}

/** Icono de refresco, usado para reiniciar el formulario. */
export function IconoReiniciar(props: IconoProps) {
  return (
    <svg {...BASE} {...props}>
      <path d="M20 11a8 8 0 1 0-2.3 5.7" />
      <path d="M20 5v6h-6" />
    </svg>
  );
}

/** Icono de advertencia, usado en los mensajes de error. */
export function IconoAlerta(props: IconoProps) {
  return (
    <svg {...BASE} {...props}>
      <path d="M12 3.5L2.5 20h19z" />
      <path d="M12 10v4.5M12 17.5h.01" />
    </svg>
  );
}

/** Icono de verificación, usado en los mensajes de éxito. */
export function IconoVerificado(props: IconoProps) {
  return (
    <svg {...BASE} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  );
}

/** Icono de descarga, usado en los enlaces a los artefactos `.joblib`. */
export function IconoDescarga(props: IconoProps) {
  return (
    <svg {...BASE} {...props}>
      <path d="M12 3.5v11m0 0l-4-4m4 4l4-4" />
      <path d="M4 17.5v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
    </svg>
  );
}

/** Icono de información, usado en las notas explicativas. */
export function IconoInformacion(props: IconoProps) {
  return (
    <svg {...BASE} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.5h.01" />
    </svg>
  );
}

/** Icono de cubo, usado para representar los modelos. */
export function IconoModelo(props: IconoProps) {
  return (
    <svg {...BASE} {...props}>
      <path d="M12 2.8l8 4.3v9.8l-8 4.3-8-4.3V7.1z" />
      <path d="M4 7.1l8 4.3 8-4.3M12 11.4V21" />
    </svg>
  );
}

/** Icono de flecha hacia abajo, usado en indicadores decrecientes. */
export function IconoFlechaAbajo(props: IconoProps) {
  return (
    <svg {...BASE} {...props}>
      <path d="M12 5v14m0 0l-5-5m5 5l5-5" />
    </svg>
  );
}

/** Icono de flecha hacia arriba, usado en indicadores crecientes. */
export function IconoFlechaArriba(props: IconoProps) {
  return (
    <svg {...BASE} {...props}>
      <path d="M12 19V5m0 0l-5 5m5-5l5 5" />
    </svg>
  );
}

/** Mapa de iconos por modelo, para resolver el icono a partir del identificador. */
export const ICONOS_POR_MODELO = {
  dolar: IconoTendencia,
  glucosa: IconoActividad,
  energia: IconoEnergia,
} as const;
