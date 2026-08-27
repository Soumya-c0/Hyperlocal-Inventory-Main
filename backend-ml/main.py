from fastapi import FastAPI
from pydantic import BaseModel
import xgboost as xgb
import redis
import numpy as np
import os

app = FastAPI(title="Carbon Optimizer ML Service")

redis_client = redis.Redis(host='hyperlocal_redis', port=6379, db=0)

# Load the trained XGBoost model into memory
model = xgb.XGBRegressor()
model_path = "carbon_model.json"
if os.path.exists(model_path):
    model.load_model(model_path)

class PayloadData(BaseModel):
    order_id: int
    current_weight_kg: float
    gradient: float

@app.get("/")
def read_root():
    return {"status": "ML Microservice is operational"}

@app.post("/predict-carbon")
def predict_carbon(data: PayloadData):
    if not os.path.exists(model_path):
        return {"error": "Prediction model missing"}
        
    # Format the incoming request into a 2D NumPy array for inference
    features = np.array([[data.current_weight_kg, data.gradient]])
    
    # Execute inference
    predicted_co2 = model.predict(features)[0]
    
    return {"predicted_co2_grams": round(float(predicted_co2), 2)}