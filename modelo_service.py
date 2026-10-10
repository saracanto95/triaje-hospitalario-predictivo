# -*- coding: utf-8 -*-

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, numpy as np, xgboost as xgb, json

app = Flask(__name__)
CORS(app)

# ── Cargar artefactos al arrancar el servidor ─────────────
imputer   = joblib.load('imputer.pkl')
scaler    = joblib.load('scaler.pkl')
xgb_model = xgb.XGBClassifier()
xgb_model.load_model('xgb_model.json')

with open('feature_names.json') as f:
    feature_names = json.load(f)

# Columnas de síntomas en el mismo orden que el notebook
ALL_SYMPTOM_COLS = [
    'Abdominal_Grave', 'Alteracion_Conciencia', 'Cardiovascular_Agudo',
    'Cefalea_Mareo', 'Dificultad_Respiratoria', 'Infeccioso_Fiebre',
    'Neurologico_Ictus', 'Otros_Sintomas', 'Trauma_Accidente'
]

@app.route("/health", methods=["GET"])
def health():
    return {"ok": True}

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # ── Síntomas → columnas binarias ──────────────────────
    symptom_vals = {col: 0 for col in ALL_SYMPTOM_COLS}
    for s in data.get('symptoms', []):
        if s in symptom_vals:
            symptom_vals[s] = 1

    # ── Variables base ────────────────────────────────────
    base = {
        'Sex':        int(data['sex']),
        'Age':        float(data['age']),
        'Injury':     int(data['injury']),
        'Pain':       int(data['pain']),
        'SBP':        float(data['sbp']),
        'DBP':        float(data['dbp']),
        'HR':         float(data['hr']),
        'RR':         float(data['rr']),
        'BT':         float(data['bt']),
        'Saturation': float(data['saturation_o2']),
        'Mental':     int(data['mental'])
    }
    base.update(symptom_vals)

    # ── Vector en el orden exacto del entrenamiento ───────
    row = [base[col] for col in feature_names]
    X = np.array(row).reshape(1, -1)

    # ── Pipeline de preprocesamiento ──────────────────────
    X_imp    = imputer.transform(X)
    X_scaled = scaler.transform(X_imp)

    # ── Predicción ────────────────────────────────────────
    clase = int(xgb_model.predict(X_scaled)[0]) + 1  # modelo usa 0-indexed
    proba = xgb_model.predict_proba(X_scaled)[0].tolist()

    label_map = {1: 'Crítico', 2: 'Urgente', 3: 'No urgente'}

    return jsonify({
        'clase':    clase,
        'etiqueta': label_map[clase],
        'probabilidades': {
            'Critico':     round(proba[0], 3),
            'Urgente':     round(proba[1], 3),
            'No_urgente':  round(proba[2], 3)
        }
    })

if __name__ == '__main__':
    app.run( port=5000)