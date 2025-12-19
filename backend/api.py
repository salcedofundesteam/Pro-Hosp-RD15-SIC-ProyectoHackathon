# -*- coding: utf-8 -*-
"""
API REST: ORQUESTADOR DE MODELOS PREDICTIVOS (SALUD + AMBIENTE)
Modo DEMO: Si los modelos hospitalarios no cargan, usa fallback heurístico
para que /ingest_hospital y /dashboard_summary funcionen en la presentación.
"""

import pandas as pd
import joblib
import requests
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# --- 1. CONFIGURACIÓN ---
OPENWEATHER_API_KEY = "20c792d9b596b41a1fe1312d4343c7ca"
LAT_SD = 18.4861
LON_SD = -69.9312

app = FastAPI(
    title="Samsung Innovation AI Core",
    version="2.0 DEMO",
    description="API híbrida (Reglas + ML) para hospital y riesgo vial."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. MODELOS ---
model_stay_days = None
model_stay_block = None
model_accident = None

STATUS_IA1 = False
STATUS_IA2 = False

print("--- INICIALIZANDO KERNEL DE IA ---")

# IA1: Hospital (puede fallar por versiones sklearn)
try:
    model_stay_days = joblib.load("model_stay_day_logist.pkl")
    model_stay_block = joblib.load("model_stay_block_randomf.pkl")
    STATUS_IA1 = True
    print("✅ [IA 1] Modelos Hospitalarios: CARGADOS")
except Exception as e:
    STATUS_IA1 = False
    print(f"⚠️ [IA 1] No cargó (DEMO fallback activo): {e}")

# IA2: Ambiental
try:
    model_accident = joblib.load("model_ia2.pkl")
    STATUS_IA2 = True
    print("✅ [IA 2] Modelo Ambiental: CARGADO")
except Exception as e:
    STATUS_IA2 = False
    print(f"⚠️ [IA 2] No cargó: {e}")

# --- 3. DTOs ---
class PacienteInput(BaseModel):
    Hospital_type: int
    Hospital_city: int
    Hospital_region: int
    Available_Extra_Rooms_in_Hospital: int
    Bed_Grade: float
    Patient_Visitors: int
    City_Code_Patient: float
    Admission_Deposit: float
    Department: str
    Ward_Type: str
    Ward_Facility: str
    Type_of_Admission: str
    Illness_Severity: str
    Age: str

class FechaInput(BaseModel):
    fecha: str  # YYYY-MM-DD

# --- 4. ESTADO EN MEMORIA (dashboard) ---
LAST_PREDICTION = {
    "last_input": None,
    "last_output": None,
    "updated_at": None
}

# --- 5. HELPERS DEMO ---
def demo_hospital_fallback(input_data: dict) -> dict:
    """
    Heurística para DEMO:
    - Fast-track si Department ambulatorio y severidad Minor
    - Si Severe o deposit alto o pocas rooms, sube días y riesgo
    """
    dept = str(input_data.get("Department", "")).lower()
    sev = str(input_data.get("Illness_Severity", "Minor"))
    extra_rooms = int(input_data.get("Available_Extra_Rooms_in_Hospital", 0))
    visitors = int(input_data.get("Patient_Visitors", 0))
    deposit = float(input_data.get("Admission_Deposit", 0))
    bed_grade = float(input_data.get("Bed_Grade", 2.0))

    es_ambulatorio = dept in ["radiotherapy", "anesthesia"]
    es_leve = sev == "Minor"

    # regla 1: fast-track
    if es_ambulatorio and es_leve:
        return {
            "dias_estimados": 1,
            "nivel_riesgo": 0,
            "alerta_gestion": "🟢 FLUJO EFICIENTE (DEMO Fast-Track)",
            "confianza_modelo": 98.5,
            "mensaje_clinico": "Paciente ambulatorio leve. Alta rápida sugerida (regla demo).",
            "modo": "DEMO_RULES"
        }

    # regla 2: score simple
    score = 0
    if sev == "Moderate":
        score += 2
    if sev == "Severe":
        score += 4
    if extra_rooms <= 1:
        score += 3
    if visitors >= 4:
        score += 1
    if deposit >= 8000:
        score += 2
    if bed_grade >= 3.5:
        score += 1

    dias = 2 + max(0, score // 2)
    riesgo = 1 if score >= 6 or dias >= 7 else 0

    alerta = "🔴 ALERTA DE BLOQUEO (DEMO)" if riesgo == 1 else "🟢 FLUJO NORMAL (DEMO)"
    confianza = 72.0 + min(25.0, score * 3.0)

    mensaje = (
        f"Estimación por reglas demo: score={score}. "
        f"Estancia ~{dias} días. "
        + ("Posible bloqueo, planificar camas." if riesgo else "Flujo estable.")
    )

    return {
        "dias_estimados": dias,
        "nivel_riesgo": riesgo,
        "alerta_gestion": alerta,
        "confianza_modelo": round(confianza, 1),
        "mensaje_clinico": mensaje,
        "modo": "DEMO_RULES"
    }

def predict_hospital(input_data: dict) -> dict:
    """
    Si IA1 está disponible -> usa modelos.
    Si no -> fallback demo (NO 503).
    """
    # Si no hay IA1, usa demo rules
    if not STATUS_IA1:
        return demo_hospital_fallback(input_data)

    # IA1 real
    try:
        d = dict(input_data)
        # normalización para el modelo
        d["Type of Admission"] = d.pop("Type_of_Admission")
        df = pd.DataFrame([d])

        pred_dias = int(np.round(model_stay_days.predict(df)[0]))
        pred_riesgo = int(model_stay_block.predict(df)[0])
        prob_riesgo = float(model_stay_block.predict_proba(df)[0][1])

        if pred_riesgo == 1:
            alerta = "🔴 ALERTA DE BLOQUEO (>7 Días)"
            mensaje = f"Pronóstico ML: larga estancia (~{pred_dias} días). Requiere gestión."
        else:
            alerta = "🟢 FLUJO NORMAL"
            mensaje = f"Pronóstico ML: estancia estándar (~{pred_dias} días)."

        return {
            "dias_estimados": pred_dias,
            "nivel_riesgo": pred_riesgo,
            "alerta_gestion": alerta,
            "confianza_modelo": round(prob_riesgo * 100, 1),
            "mensaje_clinico": mensaje,
            "modo": "ML"
        }
    except Exception:
        # si el ML falla en runtime, no tumbes la demo
        return demo_hospital_fallback(input_data)

# --- 6. ENDPOINTS ---
@app.get("/")
def health_check():
    return {
        "status": "Online",
        "modules": {
            "hospital_ai": "Active" if STATUS_IA1 else "Inactive (DEMO fallback)",
            "environmental_ai": "Active" if STATUS_IA2 else "Inactive"
        }
    }

@app.post("/predict_hospital")
def predict_hospital_stay(data: PacienteInput):
    return predict_hospital(data.dict())

@app.post("/ingest_hospital")
def ingest_hospital(data: PacienteInput):
    result = predict_hospital(data.dict())

    LAST_PREDICTION["last_input"] = data.dict()
    LAST_PREDICTION["last_output"] = result
    LAST_PREDICTION["updated_at"] = datetime.now().isoformat()

    return result

@app.get("/dashboard_summary")
def dashboard_summary():
    return LAST_PREDICTION

@app.post("/predict_accident_future")
def predict_accident_future(data: FechaInput):
    target_date = data.fecha

    # validación simple
    try:
        date_obj = datetime.strptime(target_date, "%Y-%m-%d")
        today = datetime.now()
        diff = (date_obj - today).days
        if diff < 0:
            return {"error": "Fecha inválida (Pasado)."}
        if diff > 5:
            return {"error": "Pronóstico máximo 5 días."}
    except ValueError:
        return {"error": "Formato inválido. Use YYYY-MM-DD"}

    try:
        url = (
            f"https://api.openweathermap.org/data/2.5/forecast?"
            f"lat={LAT_SD}&lon={LON_SD}&appid={OPENWEATHER_API_KEY}&units=metric"
        )
        res = requests.get(url, timeout=5).json()

        temps, hums, winds, viss, desc = [], [], [], [], []
        for item in res.get("list", []):
            fecha_item = item["dt_txt"].split(" ")[0]
            if fecha_item == target_date:
                temps.append(item["main"]["temp"])
                hums.append(item["main"]["humidity"])
                winds.append(item["wind"]["speed"])
                viss.append(item.get("visibility", 10000))
                desc.append(item["weather"][0]["description"])

        if not temps:
            return {"error": f"No hay datos para {target_date}."}

        avg_temp = sum(temps) / len(temps)
        avg_hum = sum(hums) / len(hums)
        max_wind = max(winds)
        min_vis_km = min(viss) / 1000.0
        most_common_desc = max(set(desc), key=desc.count)

        tasa = 0.0
        label = "N/A"
        if STATUS_IA2:
            features = pd.DataFrame([{
                "temp": avg_temp,
                "humidity": avg_hum,
                "windspeed": max_wind,
                "visibility": min_vis_km
            }])
            tasa = float(model_accident.predict(features)[0])
            if tasa >= 7.0:
                label = "🔴 ALTO (CRÍTICO)"
            elif tasa >= 4.0:
                label = "🟡 MEDIO (PRECAUCIÓN)"
            else:
                label = "🟢 BAJO (ÓPTIMO)"

        return {
            "fecha_analisis": target_date,
            "metrica_meteorologica": {
                "condicion": most_common_desc,
                "temp_media": round(avg_temp, 1),
                "viento_max_dia": round(max_wind, 1),
                "visibilidad_min_dia": round(min_vis_km, 1),
            },
            "prediccion_ia": {
                "riesgo_vial": label,
                "indice_accidentalidad": round(tasa, 2),
            },
        }
    except Exception as e:
        return {"error": "Fallo en pronóstico", "detalle": str(e)}