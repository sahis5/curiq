from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="MediFlow AI Health Engine")

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientVitals(BaseModel):
    patientId: str
    weight_kg: float
    height_cm: float
    systolic_bp: int
    diastolic_bp: int
    fasting_sugar_mg_dl: int
    age: int

class RiskResponse(BaseModel):
    bmi: float
    bmi_category: str
    diabetes_risk_score: float
    cardiovascular_risk_score: float
    recommendations: list[str]

def calculate_bmi(weight: float, height_cm: float) -> tuple[float, str]:
    height_m = height_cm / 100
    bmi = round(weight / (height_m ** 2), 1)
    
    if bmi < 18.5:
        return bmi, "Underweight"
    elif 18.5 <= bmi < 24.9:
        return bmi, "Normal"
    elif 25 <= bmi < 29.9:
        return bmi, "Overweight"
    else:
        return bmi, "Obese"

@app.post("/predict-risk", response_model=RiskResponse)
def predict_risk(vitals: PatientVitals):
    bmi, category = calculate_bmi(vitals.weight_kg, vitals.height_cm)
    
    # In a real scenario, this would load a pre-trained scikit-learn or XGBoost model
    # e.g., model = joblib.load('diabetes_rf_model.pkl')
    # risk_prob = model.predict_proba([[bmi, age, bp...]])
    
    # Mocking the ML model prediction logic based on clinical thresholds
    diabetes_risk = 0.1
    cvd_risk = 0.1
    recommendations = []

    if bmi >= 25:
        diabetes_risk += 0.2
        cvd_risk += 0.15
        recommendations.append("Weight management plan recommended.")
    
    if vitals.fasting_sugar_mg_dl > 125:
        diabetes_risk += 0.5
        recommendations.append("High fasting sugar detected. Schedule HbA1c test immediately.")
    elif vitals.fasting_sugar_mg_dl > 100:
        diabetes_risk += 0.2
        recommendations.append("Pre-diabetic sugar levels. Lifestyle and dietary intervention required.")

    if vitals.systolic_bp > 140 or vitals.diastolic_bp > 90:
        cvd_risk += 0.4
        recommendations.append("Stage 2 Hypertension detected. Initiate anti-hypertensive protocol.")
    elif vitals.systolic_bp > 130 or vitals.diastolic_bp > 80:
        cvd_risk += 0.2
        recommendations.append("Elevated blood pressure. Recommend DASH diet and daily monitoring.")

    # Cap risks at 99%
    diabetes_risk = min(diabetes_risk, 0.99)
    cvd_risk = min(cvd_risk, 0.99)

    if not recommendations:
        recommendations.append("Patient metabolic profile is within normal limits. Continue routine annual screening.")

    return RiskResponse(
        bmi=bmi,
        bmi_category=category,
        diabetes_risk_score=round(diabetes_risk * 100, 1),
        cardiovascular_risk_score=round(cvd_risk * 100, 1),
        recommendations=recommendations
    )

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "MediFlow AI Engine"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
