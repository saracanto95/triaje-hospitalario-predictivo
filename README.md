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

## Ejecución local

### Requisitos previos
- Python 3 (con `python` disponible en el PATH) y pip
- Node.js y npm
- MySQL o MariaDB en ejecución

### 1. Base de datos
Importa el esquema y los datos (crea la base `app_triaje`):
```bash
mysql -u root -p < database/app_triaje.sql
```
La conexión está definida en `servidor_rest.js` (por defecto: usuario `root`, sin contraseña, `localhost:3306`). Ajústala si tu configuración es distinta.

### 2. Dependencias de Python
```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Dependencias de Node y arranque
Con el entorno virtual activado, en la raíz del repositorio:
```bash
npm install
npm start
```
El servidor Node (puerto 3000) lanza automáticamente el servicio de predicción Flask (puerto 5000).

### 4. Uso
Abre http://localhost:3000/appTriaje/ en el navegador.

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
Ampliar el dataset, integrar datos hospitalarios en tiempo real, incorporar más variables clínicas y añadir autenticación, trazabilidad y validación clínica.

## Autora
Sara Cantó Sánchez. Trabajo de Fin de Grado en Ingeniería Biomédica, Universidad de Alicante. Tutor: Alberto Antonio De Ramón Fernández.
