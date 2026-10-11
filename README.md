# Aplicación de Triaje Hospitalario Predictivo

## Descripción
Trabajo de Fin de Grado de Ingeniería Biomédica (Universidad de Alicante, curso 2025/2026). Aplicación de ayuda a la decisión en triaje hospitalario: a partir de los datos clínicos que introduce el usuario (signos vitales, dolor y síntomas), estima su nivel de prioridad (Crítico, Urgente o No urgente) y recomienda el centro sanitario más adecuado según la prioridad, la distancia y la saturación simulada de los hospitales.

## Tecnologías utilizadas
- **Frontend:** HTML, CSS y JavaScript (interfaz web en `cliente_rest/`). Mapas con Leaflet y OpenStreetMap. La versión móvil se empaqueta con Cordova (proyecto no incluido de momento en este repositorio).
- **Backend:** Node.js y Express.
- **API de predicción:** Python y Flask.
- **Machine Learning:** XGBoost, Scikit-learn y SHAP.
- **Base de datos:** MySQL (datos hospitalarios simulados).
- **Procesamiento de datos:** imputación, escalado, one-hot encoding, MultiLabelBinarizer y SMOTE (solo sobre el conjunto de entrenamiento).

## Arquitectura
1. **Interfaz:** permite introducir las variables clínicas y consultar los resultados y los hospitales.
2. **Backend Node.js:** valida los datos de entrada, consulta la base de datos hospitalaria y lanza el servicio de predicción.
3. **Servicio de Machine Learning:** API Flask que aplica el preprocesamiento y devuelve la predicción del modelo XGBoost.

## Modelo predictivo
Se entrenó con el dataset público KTAS, agrupando los niveles de triaje originales en tres categorías clínicas. Se compararon XGBoost, Perceptrón Multicapa y Regresión Logística, con dos técnicas de balanceo (SMOTE y RandomOverSampler). El modelo seleccionado es **XGBoost + SMOTE**.

### Resultados (conjunto de test independiente, n = 254)
Accuracy global: **0,665** · F1 macro: **0,659**

| Clase | Precision | Recall | F1-score | AUC |
|---|---|---|---|---|
| Crítico | 0,596 | 0,694 | 0,642 | 0,882 |
| Urgente | 0,648 | 0,582 | 0,613 | 0,751 |
| No urgente | 0,716 | 0,729 | 0,722 | 0,834 |

Matriz de confusión (filas: clase real; columnas: predicción):

| | Crítico | Urgente | No urgente |
|---|---|---|---|
| **Crítico** | 34 | 9 | 6 |
| **Urgente** | 16 | 57 | 25 |
| **No urgente** | 7 | 22 | 78 |

- Solo 6 de los 49 pacientes críticos (12,2 %) se clasifican como No urgente.
- La mayor confusión se da en la clase intermedia (Urgente), habitual entre niveles de triaje adyacentes.
- Según el análisis SHAP, las variables más influyentes son Dolor, Saturación de oxígeno, Otros síntomas, Síntomas cardiovasculares, Edad y Frecuencia cardíaca.

## Datos
El modelo se entrenó con el dataset público KTAS ([https://www.kaggle.com/datasets/ilkeryildiz/emergency-service-triage-application/data]). No se incluye en el repositorio: descárgalo y guárdalo como `data/data.csv` (ver `data/README.md`).

## Notebooks 
Los cuadernos de la carpeta `notebooks/` documentan el entrenamiento y **no son necesarios para ejecutar la aplicación**, que usa el modelo ya entrenado incluido en el repositorio.

- `01_comparativa_modelos.ipynb`: comparación de XGBoost, Perceptrón Multicapa y Regresión Logística.
- `02_modelo_final.ipynb`: entrenamiento y evaluación del modelo final (XGBoost + SMOTE) y generación de los archivos del modelo (`imputer.pkl`, `scaler.pkl`, `xgb_model.json`, `feature_names.json`). Si se ejecuta, los archivos se guardan en `notebooks/`; cópialos a la raíz para que los use la aplicación.

## Ejecución local

### Requisitos previos
- Git
- Python 3 (con `python` disponible en el PATH) y pip
- Node.js y npm
- MySQL o MariaDB en ejecución (por ejemplo, con XAMPP)
- Navegador con la ubicación activada (ver paso 5)
> Probado con Python 3.12.6 y Node v20.9.0

### 1. Clonar el repositorio
```bash
git clone https://github.com/saracanto95/triaje-hospitalario-predictivo.git
cd triaje-hospitalario-predictivo
```
Los comandos siguientes se ejecutan desde esta carpeta.

### 2. Base de datos
Con MySQL encendido, importa el esquema y los datos (crea la base `app_triaje`). Opción A, por línea de comandos:
```bash
mysql -u root -p < database/app_triaje.sql
```
Opción B, desde phpMyAdmin: pestaña **Importar** y selecciona `database/app_triaje.sql`.

> MySQL debe estar en ejecución antes de iniciar la aplicación; si no, el servidor se cierra al no poder conectar.

La conexión está definida en `servidor_rest.js` (por defecto: usuario `root`, sin contraseña, `localhost:3306`). Ajústala si tu configuración es distinta.

### 3. Dependencias de Python
```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
> En Windows PowerShell, si `activate` da un error de ejecución de scripts, ejecuta antes `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

### 4. Dependencias de Node y arranque
Con el entorno virtual activado, en la raíz del repositorio:
```bash
npm install
npm start
```
El servidor Node (puerto 3000) lanza automáticamente el servicio de predicción Flask (puerto 5000).

### 5. Uso
Abre http://localhost:3000/appTriaje/ en el navegador.

> La recomendación de hospital necesita la ubicación del dispositivo. Cuando el navegador la solicite, pulsa **Permitir**. Si la bloqueaste, actívala desde el icono del candado junto a la dirección y recarga la página.

Comprobación rápida de la API:
```bash
curl "http://localhost:3000/api/estado-hospitales?tipo_dia=laborable&hora=10:00:00"
```

### Archivos del modelo
El servicio de predicción carga al arrancar `imputer.pkl`, `scaler.pkl`, `xgb_model.json` y `feature_names.json`, que deben estar en la raíz del repositorio. Los archivos `.pkl` dependen de la versión de scikit-learn indicada en `requirements.txt`.

## Estado y limitaciones
- Dataset de entrenamiento de tamaño reducido y con clases desequilibradas.
- La variable Dolor está codificada de forma binaria.
- La información hospitalaria es simulada.
- Prototipo académico con fines demostrativos: no es un dispositivo médico ni una herramienta validada para decisiones clínicas. Las predicciones no sustituyen la valoración de profesionales sanitarios.

## Trabajo futuro
- Ampliar el dataset
- Integrar datos hospitalarios en tiempo real
- Incorporar más variables clínicas 
- Añadir autenticación, trazabilidad y validación clínica.

## Documentación
- [Resumen](docs/Resumen_TFG.pdf)
- [Póster](docs/Poster_TFG.pdf)
- [Presentación](docs/Presentacion_TFG.pdf)

## Autora y Tutor
Sara Cantó Sánchez. 
Tutor: Alberto Antonio De Ramón Fernández.
Trabajo de Fin de Grado en Ingeniería Biomédica, Universidad de Alicante. 

