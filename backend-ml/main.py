from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import xgboost as xgb
import pandas as pd
import os

app = FastAPI(title="Carbon Ledger ML Engine")

# Initialize XGBoost architecture
model = xgb.XGBRegressor()
MODEL_PATH = "carbon_model.json"

@app.on_event("startup")
def load_trained_model():
    """Loads the binary weights into memory during server boot."""
    if os.path.exists(MODEL_PATH):
        model.load_model(MODEL_PATH)
        print("System Ready: Carbon prediction model loaded successfully.")
    else:
        raise RuntimeError("Fatal: carbon_model.json missing. Execute train_model.py first.")

class TelemetryPayload(BaseModel):
    vehicle_weight_kg: float
    road_gradient_deg: float
    distance_km: float

@app.post("/predict-emissions")
def predict_route_emissions(payload: TelemetryPayload):
    try:
        features = pd.DataFrame([{
            'vehicle_weight_kg': payload.vehicle_weight_kg,
            'road_gradient_deg': payload.road_gradient_deg,
            'distance_km': payload.distance_km
        }])
        prediction = model.predict(features)
        projected_co2 = float(prediction[0])

        return {
            "status": "success",
            "telemetry_processed": {
                "weight_kg": payload.vehicle_weight_kg,
                "gradient_deg": payload.road_gradient_deg,
                "distance_km": payload.distance_km
            },
            "projected_co2_g": projected_co2
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

# Standard execution block for local debugging
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)