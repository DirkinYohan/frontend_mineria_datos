# Frontend de Minería de Datos

Interfaz web para realizar predicciones con los **tres modelos de regresión
lineal múltiple** entrenados en el proyecto de Machine Learning del laboratorio.

Construida con **Next.js**, **TypeScript** y **Tailwind CSS**, sin backend.

---

## Modelos

| Modelo | Variables de entrada | Salida | Artefacto temporal |
|--------|---------------------|--------|--------------------|
| Precio del Dólar | `Dia`, `Inflacion`, `Tasa_interes` | `Precio_Dolar` | `modelo_dolar.joblib` |
| Nivel de Glucosa | `Edad`, `IMC`, `Actividad_Fisica` | `Nivel_Glucosa` | `modelo_glucosa.joblib` |
| Consumo de Energía | `Temperatura`, `Hora`, `Dia_Semana` | `Consumo_Energia` | `modelo_energia.joblib` |

Los tres modelos fueron entrenados previamente con `scikit-learn`. **No se
volvieron a entrenar, no se modificaron y no se convirtieron a ningún otro
formato.**

---

## Limitación técnica (importante)

### ¿Se puede ejecutar un `.joblib` desde Next.js?

**No, y no es una limitación evitable.**

Un archivo `.joblib` es un flujo de bytes de **pickle de Python** que describe
objetos de `scikit-learn` y `numpy`. Verificado sobre los artefactos reales:

```
modelo_dolar.joblib → primeros bytes: 80 05 95 5d 01 00 00 00
  · 0x80 = marcador de protocolo pickle
  · protocolo 5
  · contiene las cadenas "sklearn" y "numpy" en claro
```

Deserializarlo requiere el intérprete de Python. El navegador solo ejecuta
JavaScript y no existe ninguna biblioteca capaz de reconstruir objetos de
scikit-learn a partir de un pickle de Python. **No hay forma de rodear esto sin
un intérprete de Python en el servidor.**

Por eso no se convirtió nada a ONNX ni a otro formato: se documenta la
limitación y se aplica una solución que **conserva los modelos originales**.

### Solución adoptada

Una regresión lineal múltiple queda **completamente definida** por su intercepto
y sus coeficientes:

```
ŷ = β₀ + β₁·x₁ + β₂·x₂ + β₃·x₃
```

El pipeline de Python ya exporta esos valores a
`results/<modelo>/modelo.json`, generados a partir del `.joblib` entrenado. El
frontend evalúa esa misma expresión aritmética, que es **exactamente** la
operación que ejecuta `LinearRegression.predict` (un producto matricial seguido
de la suma del intercepto).

**No es una aproximación.** Con los mismos coeficientes y la misma aritmética de
coma flotante IEEE 754, el resultado coincide con el del modelo de Python.

### Evidencia de paridad

El repositorio incluye una verificación ejecutable. Se generan casos de
referencia ejecutando el `.joblib` original con scikit-learn y se comparan con
la aritmética de TypeScript:

```bash
# 1. Generar los casos de referencia (requiere el entorno de Python del laboratorio)
#    desde laboratorio_mineria_datos:
.venv\Scripts\python.exe ..\frontend_mineria_datos\scripts\generar_casos_paridad.py

# 2. Verificar la paridad
node scripts/verify_parity.mjs
```

Resultado real obtenido:

```
Casos evaluados   : 9
Coincidencias     : 9
Discrepancias     : 0
Diferencia máxima : 9.095e-13

PARIDAD VERIFICADA: el frontend reproduce el modelo de Python.
```

La diferencia máxima (9.095e-13) es ruido de coma flotante, muy por debajo de
cualquier precisión mostrada en la interfaz (2 decimales).

### Los artefactos originales se conservan

Los tres `.joblib` se distribuyen **sin modificar** en `public/models/`. Se
verificó que su hash MD5 coincide con el original del proyecto de Machine
Learning:

| Archivo | MD5 |
|---------|-----|
| `modelo_dolar.joblib` | `a5ddc8d4ba2cab134117a6c120b8b088` |
| `modelo_glucosa.joblib` | `22559858eaae7103a3de5df429a519f9` |
| `modelo_energia.joblib` | `afb9d678ce6696204738333b8a3a1ffc` |

Pueden descargarse desde la sección «Información de los modelos».

### Consecuencia en el despliegue

La aplicación es **completamente estática**: no necesita backend, servidor de
predicciones ni base de datos. Se puede desplegar en cualquier plataforma que
sirva archivos estáticos.

Si en el futuro se quisiera ejecutar el `.joblib` original en servidor, bastaría
añadir un servicio de Python que lo cargara con `joblib.load` y expusiera un
endpoint; **el frontend no tendría que cambiar su lógica de presentación** ni
reentrenar nada.

---

## Instalación

Requiere **Node.js 20 o superior**.

```bash
npm install
```

## Ejecución

```bash
npm run dev      # desarrollo  → http://localhost:3000
npm run build    # compilación de producción
npm start        # servir la compilación
npm run lint     # análisis estático
npm run typecheck # verificación de tipos
```

---

## Estructura

```text
frontend_mineria_datos/
│
├── public/
│   └── models/                     # Artefactos .joblib originales (intactos)
│       ├── modelo_dolar.joblib
│       ├── modelo_glucosa.joblib
│       └── modelo_energia.joblib
│
├── scripts/
│   ├── generar_casos_paridad.py    # genera casos de referencia con scikit-learn
│   ├── parity-cases.json           # casos entrada/salida reales
│   └── verify_parity.mjs           # compara TypeScript contra Python
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              # estructura HTML y metadatos
│   │   ├── page.tsx                # página principal (composición)
│   │   └── globals.css             # estilos globales y tema
│   │
│   ├── components/
│   │   ├── layout/                 # cabecera, pie y panel principal
│   │   ├── prediction/             # selector, formulario y resultado
│   │   ├── models/                 # tarjetas, tabla de métricas y aviso técnico
│   │   └── ui/                     # componentes reutilizables (botón, tarjeta…)
│   │
│   ├── config/
│   │   └── models.ts               # fuente única de verdad de los modelos
│   │
│   ├── lib/
│   │   ├── models/
│   │   │   ├── predict.ts          # motor de inferencia
│   │   │   ├── validation.ts       # validación de entradas
│   │   │   ├── dolar.ts            # acceso al modelo de dólar
│   │   │   ├── glucosa.ts          # acceso al modelo de glucosa
│   │   │   ├── energia.ts          # acceso al modelo de energía
│   │   │   └── index.ts            # punto de entrada de la capa
│   │   └── utils.ts                # utilidades de formato
│   │
│   └── types/
│       └── models.ts               # tipos compartidos
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── README.md
└── .gitignore
```

### Separación de responsabilidades

| Capa | Responsabilidad | No hace |
|------|-----------------|---------|
| `components/` | Presentación e interacción | No calcula ni valida |
| `lib/models/` | Inferencia y validación | No renderiza nada |
| `config/` | Datos de los modelos | No contiene lógica |
| `types/` | Contratos de tipos | No contiene lógica |

Los componentes no conocen los coeficientes: los leen de la configuración a
través de la capa de modelos. Cambiar un coeficiente solo requiere editar
`src/config/models.ts`.

---

## Procedencia de los datos

**Ningún valor de este proyecto es inventado.** Todos proceden de los resultados
reales del proyecto de Machine Learning:

| Dato | Origen |
|------|--------|
| Coeficientes e intercepto | `laboratorio_mineria_datos/results/<modelo>/modelo.json` |
| Métricas (R², MAE, MSE, RMSE) | `laboratorio_mineria_datos/results/<modelo>/metricas.json` → `metricas_prueba` |
| Rangos válidos de las variables | `laboratorio_mineria_datos/src/<modelo>/especificacion.py` |

Las métricas corresponden al **conjunto de prueba** (20 % reservado, semilla 42),
que el modelo no vio durante el entrenamiento.

### Métricas de evaluación

| Modelo | R² | R² ajustado | MAE | MSE | RMSE | Exigidas |
|--------|------|-------------|-------|-------|-------|----------|
| Precio del Dólar | 0.9963 | 0.9962 | 37.01 | 2376.97 | 48.75 | MSE, R² |
| Nivel de Glucosa | 0.6814 | 0.6790 | 12.22 | 233.69 | 15.29 | MSE, R² |
| Consumo de Energía | 0.8968 | 0.8967 | 16.51 | 429.52 | 20.72 | RMSE, R² |

---

## Funcionalidades

### Panel principal

Presenta el proyecto, los tres modelos disponibles y la comparación de sus
métricas reales.

### Predicción

- Selector de modelo: al cambiar, el formulario muestra **únicamente** las
  variables de ese modelo.
- Campos con etiqueta, unidad, rango admitido y ayuda contextual.
- Validación en cliente: valor numérico, dentro del rango y entero cuando
  corresponde.
- Estado de carga durante el cálculo.
- Resultado destacado con la cifra, la unidad, los coeficientes aplicados y la
  expresión evaluada.
- Botón para reiniciar y realizar una nueva predicción.

### Información de los modelos

Ficha técnica de cada modelo con variables, ecuación, coeficientes, métricas y
enlace de descarga del `.joblib` original.

### Documentación de la integración

La propia interfaz explica la limitación técnica y el método adoptado, para que
la decisión quede visible junto al producto y no solo en esta documentación.

---

## Reglas respetadas

- Se usan exactamente `modelo_dolar.joblib`, `modelo_glucosa.joblib` y
  `modelo_energia.joblib`.
- No se generó ningún archivo `.onnx` ni se instaló ninguna dependencia de ONNX
  para el frontend.
- No se volvió a entrenar ningún modelo.
- No se modificó ningún `.joblib` (verificado por MD5).
- No se sustituyeron los modelos por otro formato.
- No hay backend, API REST, base de datos ni Streamlit.
- No se inventaron resultados.
- La lógica de los modelos está separada de los componentes visuales.
- TypeScript está tipado y el proyecto compila sin errores.

---

## Verificación realizada

| Comprobación | Resultado |
|--------------|-----------|
| Integridad de los `.joblib` | MD5 idéntico al original |
| Compilación (`npm run build`) | Correcta, salida estática |
| Tipos (`tsc --noEmit`) | Sin errores |
| Paridad con Python | 9/9 casos, diferencia máxima 9.095e-13 |
| Predicción en navegador (Dólar) | 3963,65 (Python: 3963.6654422239) |
| Predicción en navegador (Energía) | 390,83 (Python: 390.8331332505) |
| Validación fuera de rango | Rechazada con mensaje y `aria-invalid` |
| Cambio de modelo | Muestra solo las variables del modelo activo |
| Descarga de `.joblib` | HTTP 200, MD5 idéntico |
