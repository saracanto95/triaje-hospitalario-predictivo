# Aplicación de triaje hospitalario predictivo

## Descripción

Trabajo de Fin de Grado de Ingeniería Biomédica para explorar la aplicación de técnicas de Machine Learning al triaje hospitalario. La aplicación integra un modelo predictivo con una interfaz y un backend que consulta información sobre hospitales y su estado de saturación estimado.

El objetivo es desarrollar un prototipo que combine procesamiento de datos clínicos, predicción de prioridades de triaje y consulta de información hospitalaria (distancia y saturación del servicio de urgencias).

## Tecnologías utilizadas

- **Frontend:** HTML, CSS y JavaScript.
- **Backend:** Node.js y Express.
- **API de predicción:** Python y Flask.
- **Machine Learning:** XGBoost, Scikit-learn y NumPy.
- **Base de datos:** MySQL.
- **Procesamiento de datos:** imputación iterativa, estandarización y SMOTE para el tratamiento del desequilibrio de clases durante el entrenamiento.

## Arquitectura

La aplicación se organiza en tres componentes principales:

1. **Interfaz:** permite introducir las variables del caso y consultar los resultados.
2. **Backend Node.js:** gestiona las peticiones, valida los datos de entrada y consulta la base de datos hospitalaria.
3. **Servicio de Machine Learning:** recibe las variables mediante una API Flask, aplica el preprocesamiento y devuelve la predicción del modelo XGBoost.

## Modelo predictivo

Durante el desarrollo se exploraron distintas configuraciones de clasificación. La versión integrada en la aplicación utiliza tres categorías de prioridad: crítico, urgente y no urgente.

El proceso de entrenamiento incluye imputación de valores ausentes, estandarización de las variables y sobremuestreo SMOTE aplicado únicamente al conjunto de entrenamiento. El rendimiento se evaluó sobre un conjunto de test independiente del entrenamiento.

## Funcionalidades

- Evaluación experimental de la prioridad de triaje a partir de variables clínicas.
- Comunicación entre el backend y el servicio de predicción.
- Consulta del estado estimado de los hospitales.
- Consulta de la evolución del estado hospitalario por franjas horarias.

## Estado y limitaciones

Prototipo académico con fines demostrativos. No constituye un dispositivo médico ni una herramienta validada para tomar decisiones clínicas reales. Las predicciones no sustituyen la valoración de profesionales sanitarios.

La información hospitalaria utilizada en el proyecto es estimada o sintética, según la configuración de los datos del prototipo.

## Autora

Proyecto desarrollado como parte del Trabajo de Fin de Grado en Ingeniería Biomédica en la Universidad de Alicante.
