"""Genera los casos de referencia de paridad para el frontend.

Ejecuta el `.joblib` original con scikit-learn sobre filas reales del dataset
procesado y escribe los pares entrada/salida en un archivo JSON que el script
`scripts/verify_parity.ts` del frontend usa para comprobar que la aritmética de
TypeScript reproduce el modelo de Python.

Los `.joblib` no se modifican: solo se cargan con `joblib.load` para leer.

Uso (desde el proyecto de Machine Learning):
    .venv\\Scripts\\python.exe ..\\frontend_mineria_datos\\scripts\\generar_casos_paridad.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

LABORATORIO = Path(__file__).resolve().parents[2] / "laboratorio_mineria_datos"
sys.path.insert(0, str(LABORATORIO))

import joblib  # noqa: E402
import pandas as pd  # noqa: E402
from sklearn.linear_model import LinearRegression  # noqa: E402

FRONTEND = Path(__file__).resolve().parents[1]
SALIDA = FRONTEND / "scripts" / "parity-cases.json"

MODELOS = {
    "dolar": {
        "joblib": "dolar/modelo_dolar.joblib",
        "procesado": "dolar_clean.csv",
        "variables": ["Dia", "Inflacion", "Tasa_interes"],
    },
    "glucosa": {
        "joblib": "glucosa/modelo_glucosa.joblib",
        "procesado": "glucosa_clean.csv",
        "variables": ["Edad", "IMC", "Actividad_Fisica"],
    },
    "energia": {
        "joblib": "energia/modelo_energia.joblib",
        "procesado": "energia_clean.csv",
        "variables": ["Temperatura", "Hora", "Dia_Semana"],
    },
}

# Se toman la primera, la central y la última fila de cada dataset para cubrir
# valores bajos, medios y altos de las distribuciones.
FILAS = (0, "media", -1)


def main() -> None:
    """Genera el archivo de casos de paridad."""
    casos: list[dict[str, object]] = []

    for clave, spec in MODELOS.items():
        modelo: LinearRegression = joblib.load(
            LABORATORIO / "models" / spec["joblib"]
        )
        df = pd.read_csv(LABORATORIO / "data" / "processed" / spec["procesado"])

        for posicion in FILAS:
            fila = df.iloc[len(df) // 2] if posicion == "media" else df.iloc[posicion]
            entradas = {v: float(fila[v]) for v in spec["variables"]}
            matriz = pd.DataFrame([entradas])[spec["variables"]]
            esperado = float(modelo.predict(matriz)[0])

            casos.append(
                {
                    "modelo": clave,
                    "entradas": entradas,
                    "esperado": esperado,
                }
            )

        print(f"  {clave:8} {len(FILAS)} casos (joblib cargado y original intacto)")

    SALIDA.write_text(
        json.dumps(casos, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"\nEscritos {len(casos)} casos en {SALIDA.relative_to(FRONTEND)}")


if __name__ == "__main__":
    main()
