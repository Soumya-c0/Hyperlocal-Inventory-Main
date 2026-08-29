from fastapi import FastAPI
from pydantic import BaseModel
import xgboost as xgb
import pandas as pd
import redis
import threading
import time
import os
import random

app = FastAPI()

# 1. Self-healing model generation
if not os.path.exists("xgboost_carbon_model.json"):
    print("Training synthetic XGBoost model...", flush=True)
    data = [{'weight_kg': random.uniform(1, 10), 'gradient': random.uniform(-5, 10)} for _ in range(100)]
    df_train = pd.DataFrame(data)
    y = df_train['weight_kg'] * 2.5 + df_train['gradient'] * 1.5 + 100
    dtrain = xgb.DMatrix(df_train, label=y)
    bst = xgb.train({"objective": "reg:squarederror"}, dtrain, num_boost_round=10)
    bst.save_model("xgboost_carbon_model.json")

# 2. Load the compiled model
model = xgb.Booster()
model.load_model("xgboost_carbon_model.json")

# 3. Initialize Redis Connection
redis_client = redis.Redis(host='hyperlocal_redis', port=6379, db=0, decode_responses=True)

class InferencePayload(BaseModel):
    order_id: int
    current_weight_kg: float
    gradient: float

@app.post("/predict-carbon")
def predict_carbon(payload: InferencePayload):
    df = pd.DataFrame([{
        'weight_kg': payload.current_weight_kg,
        'gradient': payload.gradient
    }])
    dmatrix = xgb.DMatrix(df)
    prediction = model.predict(dmatrix)
    
    return {
        "order_id": payload.order_id,
        "predicted_co2_grams": float(prediction[0])
    }

def consume_telemetry_stream():
    last_id = '$'
    while True:
        try:
            events = redis_client.xread({'telemetry_stream': last_id}, count=1, block=1000)
            if events:
                for stream_name, messages in events:
                    for message_id, message_data in messages:
                        print(f"[ML Engine] Ingested Live Telemetry: {message_data}", flush=True)
                        last_id = message_id
        except Exception as e:
            print(f"Redis stream error: {e}")
            time.sleep(2)

@app.on_event("startup")
def startup_event():
    listener_thread = threading.Thread(target=consume_telemetry_stream, daemon=True)
    listener_thread.start()